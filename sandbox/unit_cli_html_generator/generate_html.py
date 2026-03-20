#!/usr/bin/env python3.11

from __future__ import annotations

import argparse
import json
import os
import re
import ssl
import sys
import textwrap
import time
import urllib.error
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Any


MODEL = "gpt-4o-mini"
DEFAULT_RAG_DIR = "sandbox/unit_cli_html_generator/chroma_db"
DEFAULT_BUSINESS_RAG_DIR = "sandbox/unit_cli_html_generator/chroma_business_playbooks"
DEFAULT_DESIGN_MODES_PATH = "sandbox/unit_cli_html_generator/design_patterns.json"
DEFAULT_SECTION_PATTERNS_PATH = "sandbox/unit_cli_html_generator/section_patterns.json"
PAGE_TYPES = ["local-business", "service-business", "saas", "coach", "product-sales"]
TONES = ["professional", "casual", "playful", "bold", "elegant", "friendly", "authoritative"]
THEME_VARIANTS = ["clean", "bold", "premium", "playful"]
DESIGN_MODES = [
    "soft-glass",
    "editorial-luxe",
    "warm-service",
    "clinical-structured",
    "soft_concierge",
    "direct_local_conversion",
    "crisp_b2b_saas",
    "premium_editorial",
    "modern_glass_saas",
    "warm_local_service",
]
SECTION_TYPES = [
    "hero",
    "trust-bar",
    "features",
    "benefits",
    "problem-solution",
    "how-it-works",
    "services",
    "testimonials",
    "results",
    "pricing",
    "faq",
    "cta-band",
    "contact",
    "footer",
    "gallery",
    "service-area",
    "about-team",
]
SECTION_VARIANTS = {
    "hero": ["centered", "split-image", "background-image", "offer-focused", "trust-panel"],
    "trust-bar": ["simple", "with-icons"],
    "features": ["icon-grid", "image-cards", "list-with-icons"],
    "benefits": ["icon-list", "cards", "alternating-rows"],
    "problem-solution": ["two-column", "stacked"],
    "how-it-works": ["numbered-steps", "timeline"],
    "services": ["cards", "image-cards", "alternating-rows", "list-with-icons", "story"],
    "testimonials": ["cards", "avatars", "single-highlight", "grid-quotes", "side-by-side-proof"],
    "results": ["stat-bar", "full-section"],
    "pricing": ["side-by-side", "single-featured"],
    "faq": ["accordion", "two-column", "grouped", "faq-plus-cta"],
    "cta-band": ["centered", "dual", "contact-strip", "whatsapp-focused"],
    "contact": ["form-only", "form-with-info"],
    "footer": ["simple", "multi-column", "legal-heavy", "default"],
    "gallery": ["grid", "masonry", "carousel"],
    "service-area": ["list", "grid", "map-note"],
    "about-team": ["story", "team-grid", "values"],
}


def load_env_var(key: str) -> str | None:
    if os.environ.get(key):
        return os.environ[key]

    for env_name in (".env.local", ".env"):
        env_path = Path.cwd() / env_name
        if not env_path.exists():
            continue
        for line in env_path.read_text().splitlines():
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            if k.strip() == key:
                value = v.strip().strip('"').strip("'")
                os.environ[key] = value
                return value
    return None


def parse_json(text: str) -> Any:
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r"```(?:json)?\s*([\s\S]*?)```", text)
        if match:
            return json.loads(match.group(1).strip())
        raise


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", str(value).strip().lower()).strip("-")
    return slug or "page"


def normalize_list(value: Any) -> list[Any]:
    if isinstance(value, list):
        return value
    if value in (None, "", False):
        return []
    return [value]


def ensure_hex(value: Any, fallback: str) -> str:
    if isinstance(value, str) and re.fullmatch(r"#[0-9a-fA-F]{6}", value.strip()):
        return value.strip()
    return fallback


def normalize_text_for_matching(*values: Any) -> str:
    """Flatten mixed values into one lowercase searchable text blob."""
    parts: list[str] = []

    def visit(value: Any) -> None:
        if value in (None, "", False):
            return
        if isinstance(value, dict):
            for inner in value.values():
                visit(inner)
            return
        if isinstance(value, (list, tuple, set)):
            for inner in value:
                visit(inner)
            return
        parts.append(str(value).strip().lower())

    for item in values:
        visit(item)
    joined = " ".join(part for part in parts if part)
    return re.sub(r"\s+", " ", joined).strip()


def get_business_keyword_blob(business_context: dict[str, Any]) -> str:
    """Create one normalized text blob from the most relevant business context fields."""
    return normalize_text_for_matching(
        business_context.get("businessName"),
        business_context.get("businessDescription"),
        business_context.get("businessType"),
        business_context.get("targetAudience"),
        business_context.get("primaryCta"),
        business_context.get("tone"),
        business_context.get("pageType"),
        business_context.get("mainOffer"),
        business_context.get("location"),
        business_context.get("differentiators"),
        business_context.get("trustDrivers"),
        business_context.get("customerMotivations"),
        business_context.get("likelyObjections"),
        business_context.get("visualStyleHints"),
    )


def load_design_modes(path: Path | str) -> dict[str, Any]:
    """Load and validate the design mode JSON library."""
    file_path = Path(path)
    try:
        payload = json.loads(file_path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise ValueError(f"Design modes file not found: {file_path}") from exc
    except json.JSONDecodeError as exc:
        raise ValueError(f"Design modes file is not valid JSON: {file_path}") from exc
    design_modes = payload.get("designModes")
    if not isinstance(payload, dict) or not isinstance(design_modes, list):
        raise ValueError(f"Design modes JSON must contain a top-level 'designModes' array: {file_path}")
    return payload


def load_section_patterns(path: Path | str) -> dict[str, Any]:
    """Load and validate the section pattern JSON library."""
    file_path = Path(path)
    try:
        payload = json.loads(file_path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise ValueError(f"Section patterns file not found: {file_path}") from exc
    except json.JSONDecodeError as exc:
        raise ValueError(f"Section patterns file is not valid JSON: {file_path}") from exc
    patterns = payload.get("sectionPatterns")
    if not isinstance(payload, dict) or not isinstance(patterns, list):
        raise ValueError(f"Section patterns JSON must contain a top-level 'sectionPatterns' array: {file_path}")
    return payload


def section_pref_key(section_type: str) -> str:
    """Normalize section type keys to the sectionPreferences shape used in design modes."""
    if section_type == "cta-band":
        return "ctaBand"
    chunks = str(section_type).split("-")
    if not chunks:
        return str(section_type)
    return chunks[0] + "".join(chunk.capitalize() for chunk in chunks[1:])


def _keyword_match_score(blob: str, candidates: list[Any], exact_weight: int = 2, partial_weight: int = 1) -> tuple[int, list[str]]:
    score = 0
    reasons: list[str] = []
    for raw in candidates:
        candidate = normalize_text_for_matching(raw)
        if not candidate:
            continue
        if candidate == "all":
            score += partial_weight
            reasons.append("generic-all-match")
            continue
        if candidate in blob:
            score += exact_weight
            reasons.append(f"matched:{candidate}")
            continue
        tokens = [token for token in candidate.split() if len(token) > 2]
        if tokens and all(token in blob for token in tokens):
            score += partial_weight
            reasons.append(f"partial:{candidate}")
    return score, reasons


def _design_mode_fallback(page_type: str) -> str:
    if page_type == "saas":
        return "crisp_b2b_saas"
    if page_type in {"local-business", "service-business"}:
        return "warm_local_service"
    return "direct_local_conversion"


def pick_design_mode(business_context: dict[str, Any], design_modes: dict[str, Any]) -> dict[str, Any]:
    """Pick the best overall design mode using deterministic rule-based scoring."""
    modes = [mode for mode in design_modes.get("designModes", []) if isinstance(mode, dict)]
    if not modes:
        raise ValueError("No design modes available to score.")

    blob = get_business_keyword_blob(business_context)
    tone = normalize_text_for_matching(business_context.get("tone"))
    page_type = normalize_text_for_matching(business_context.get("pageType"))
    score_table: list[dict[str, Any]] = []

    saas_keywords = ["saas", "software", "ai", "dashboard", "workflow", "automation", "product-led", "b2b"]
    care_keywords = ["pet", "wellness", "care", "therapy", "home service", "child", "elder", "grooming"]
    premium_keywords = ["luxury", "premium", "boutique", "editorial", "interior design", "high-end", "bridal"]
    local_keywords = ["local", "nearby", "same-day", "repair", "booking", "service area", "neighborhood", "clinic"]

    for mode in modes:
        mode_id = str(mode.get("id") or "").strip()
        score = 0
        reasons: list[str] = []

        matched_score, matched_reasons = _keyword_match_score(blob, normalize_list(mode.get("businessTags")), exact_weight=4, partial_weight=2)
        score += matched_score
        reasons.extend(matched_reasons)

        matched_score, matched_reasons = _keyword_match_score(blob, normalize_list(mode.get("bestFor")), exact_weight=3, partial_weight=2)
        score += matched_score
        reasons.extend(matched_reasons)

        matched_score, matched_reasons = _keyword_match_score(tone, normalize_list(mode.get("toneTraits")), exact_weight=2, partial_weight=1)
        score += matched_score
        reasons.extend(matched_reasons)

        if mode_id in {"crisp_b2b_saas", "modern_glass_saas"} and any(keyword in blob for keyword in saas_keywords):
            score += 6 if mode_id == "crisp_b2b_saas" else 5
            reasons.append("boost:saas-keywords")
        if mode_id == "soft_concierge" and any(keyword in blob for keyword in care_keywords):
            score += 5
            reasons.append("boost:care-service")
        if mode_id in {"warm_local_service", "direct_local_conversion"} and any(keyword in blob for keyword in local_keywords):
            score += 5
            reasons.append("boost:local-conversion")
        if mode_id == "premium_editorial" and any(keyword in blob for keyword in premium_keywords):
            score += 6
            reasons.append("boost:premium-editorial")

        if page_type == "saas" and mode_id in {"crisp_b2b_saas", "modern_glass_saas"}:
            score += 4
            reasons.append("boost:page-type-saas")
        elif page_type in {"local-business", "service-business"} and mode_id in {"warm_local_service", "direct_local_conversion", "soft_concierge"}:
            score += 3
            reasons.append("boost:page-type-service")

        score_table.append({"id": mode_id, "score": score, "reasons": reasons, "mode": mode})

    score_table.sort(key=lambda item: item["score"], reverse=True)
    best = score_table[0]
    if best["score"] <= 0:
        fallback_id = _design_mode_fallback(page_type)
        fallback = next((item for item in score_table if item["id"] == fallback_id), score_table[0])
        return {
            "selected": fallback["mode"],
            "score": fallback["score"],
            "reasons": fallback["reasons"] + [f"fallback:{fallback_id}"],
            "score_table": [{"id": item["id"], "score": item["score"]} for item in score_table],
        }
    return {
        "selected": best["mode"],
        "score": best["score"],
        "reasons": best["reasons"],
        "score_table": [{"id": item["id"], "score": item["score"]} for item in score_table],
    }


def initialize_used_patterns() -> dict[str, Any]:
    """Create a serializable pattern-tracking structure for one page."""
    return {
        "pattern_ids": [],
        "variants": [],
        "section_types": [],
        "layout_styles": [],
        "visual_traits": [],
    }


def _section_pattern_fallback(section_type: str) -> dict[str, Any]:
    return {
        "id": f"fallback_{section_type}",
        "sectionType": section_type,
        "variant": "default",
        "label": "Fallback Pattern",
        "bestFor": [],
        "styleFit": [],
        "description": "Fallback section pattern",
        "contentNeeds": [],
        "visualTraits": [],
        "avoidIf": [],
    }


def _normalize_pattern_variant(section_type: str, variant: str) -> str:
    alias_map = {
        ("services", "card-grid"): "cards",
        ("services", "icon-list"): "list-with-icons",
        ("services", "story"): "story",
        ("benefits", "alternating-rows"): "alternating-rows",
        ("testimonials", "grid-quotes"): "cards",
        ("testimonials", "side-by-side-proof"): "side-by-side-proof",
        ("faq", "grouped"): "grouped",
        ("faq", "faq-plus-cta"): "faq-plus-cta",
        ("footer", "default"): "default",
        ("hero", "trust-panel"): "trust-panel",
    }
    return alias_map.get((section_type, variant), variant)


def pick_section_pattern(
    section_type: str,
    business_context: dict[str, Any],
    selected_design_mode: dict[str, Any],
    section_patterns: dict[str, Any],
    used_patterns: dict[str, Any],
) -> dict[str, Any]:
    """Pick the best section pattern for one section while avoiding repetitive page layouts."""
    candidates = [
        pattern
        for pattern in section_patterns.get("sectionPatterns", [])
        if isinstance(pattern, dict) and str(pattern.get("sectionType") or "").strip() == section_type
    ]
    if not candidates:
        fallback = _section_pattern_fallback(section_type)
        return {"selected": fallback, "score": 0, "reasons": ["fallback:no-patterns"], "score_table": []}

    blob = get_business_keyword_blob(business_context)
    selected_mode_id = str(selected_design_mode.get("id") or "").strip()
    preferred_variants = normalize_list((selected_design_mode.get("sectionPreferences") or {}).get(section_pref_key(section_type)))

    used_ids = set(str(value) for value in normalize_list(used_patterns.get("pattern_ids")))
    used_variants = set(str(value) for value in normalize_list(used_patterns.get("variants")))
    used_traits = [str(value) for value in normalize_list(used_patterns.get("visual_traits"))]

    score_table: list[dict[str, Any]] = []
    for pattern in candidates:
        score = 6  # exact section type already matched
        reasons = ["matched:section-type"]
        pattern_id = str(pattern.get("id") or "")
        variant = _normalize_pattern_variant(section_type, str(pattern.get("variant") or "default"))
        visual_traits = [str(value) for value in normalize_list(pattern.get("visualTraits")) if str(value).strip()]

        style_fit = [str(value).strip() for value in normalize_list(pattern.get("styleFit"))]
        if "all" in style_fit or selected_mode_id in style_fit:
            score += 4
            reasons.append(f"matched:style-fit:{selected_mode_id or 'all'}")

        matched_score, matched_reasons = _keyword_match_score(blob, normalize_list(pattern.get("bestFor")), exact_weight=3, partial_weight=1)
        score += matched_score
        reasons.extend(matched_reasons)

        if preferred_variants and variant in preferred_variants:
            score += 5
            reasons.append(f"matched:section-preference:{variant}")

        if pattern_id in used_ids:
            score -= 6
            reasons.append("penalty:pattern-id-reuse")
        if variant in used_variants:
            score -= 3
            reasons.append("penalty:variant-reuse")

        trait_overlap = len(set(visual_traits).intersection(used_traits))
        if trait_overlap:
            score -= min(trait_overlap, 4)
            reasons.append(f"penalty:visual-trait-overlap:{trait_overlap}")

        score_table.append({"pattern": pattern, "score": score, "reasons": reasons, "variant": variant})

    score_table.sort(key=lambda item: item["score"], reverse=True)
    best = score_table[0]
    chosen = dict(best["pattern"])
    chosen["variant"] = best["variant"]
    return {
        "selected": chosen,
        "score": best["score"],
        "reasons": best["reasons"],
        "score_table": [
            {"id": str(item["pattern"].get("id") or ""), "score": item["score"]}
            for item in score_table
        ],
    }


def update_used_patterns(used_patterns: dict[str, Any], chosen_pattern: dict[str, Any]) -> dict[str, Any]:
    """Update serializable page-level used-pattern state after selecting a section pattern."""
    updated = {
        "pattern_ids": list(normalize_list(used_patterns.get("pattern_ids"))),
        "variants": list(normalize_list(used_patterns.get("variants"))),
        "section_types": list(normalize_list(used_patterns.get("section_types"))),
        "layout_styles": list(normalize_list(used_patterns.get("layout_styles"))),
        "visual_traits": list(normalize_list(used_patterns.get("visual_traits"))),
    }
    pattern_id = str(chosen_pattern.get("id") or "").strip()
    variant = str(chosen_pattern.get("variant") or "").strip()
    section_type = str(chosen_pattern.get("sectionType") or "").strip()
    if pattern_id and pattern_id not in updated["pattern_ids"]:
        updated["pattern_ids"].append(pattern_id)
    if variant and variant not in updated["variants"]:
        updated["variants"].append(variant)
    if section_type:
        updated["section_types"].append(section_type)
    if variant and variant not in updated["layout_styles"]:
        updated["layout_styles"].append(variant)
    for trait in normalize_list(chosen_pattern.get("visualTraits")):
        clean = str(trait).strip()
        if clean and clean not in updated["visual_traits"]:
            updated["visual_traits"].append(clean)
    return updated


def apply_section_patterns_to_page_plan(
    page_plan: dict[str, Any],
    business_context: dict[str, Any],
    selected_design_mode: dict[str, Any],
    section_patterns: dict[str, Any],
) -> tuple[dict[str, Any], list[dict[str, Any]], dict[str, Any]]:
    """Annotate page-plan sections with chosen pattern metadata and pattern-aware variants."""
    updated_plan = dict(page_plan)
    updated_sections: list[dict[str, Any]] = []
    selection_trace: list[dict[str, Any]] = []
    used_patterns = initialize_used_patterns()
    selected_mode = selected_design_mode.get("selected") or {}

    for section in updated_plan.get("sections", []):
        current = dict(section)
        selection = pick_section_pattern(
            str(current.get("type") or ""),
            business_context,
            selected_mode,
            section_patterns,
            used_patterns,
        )
        chosen = selection["selected"]
        current["selectedPattern"] = chosen
        current["patternSelection"] = {
            "selected_pattern_id": chosen.get("id"),
            "score": selection.get("score", 0),
            "reasons": selection.get("reasons", []),
        }
        variant = _normalize_pattern_variant(str(current.get("type") or ""), str(chosen.get("variant") or current.get("variant") or ""))
        if variant in SECTION_VARIANTS.get(str(current.get("type") or ""), []):
            current["variant"] = variant
        used_patterns = update_used_patterns(used_patterns, chosen)
        selection_trace.append(
            {
                "section_type": current.get("type"),
                "selected_pattern_id": chosen.get("id"),
                "variant": current.get("variant"),
                "score": selection.get("score", 0),
                "reasons": selection.get("reasons", []),
            }
        )
        updated_sections.append(current)

    updated_plan["sections"] = updated_sections
    return updated_plan, selection_trace, used_patterns


def get_variant_guidance(section_type: str, variant: str, rag_dir: str | None) -> str:
    if not rag_dir or not section_type:
        return ""
    try:
        from rag_tailwind import format_guidance_for_prompt  # type: ignore
    except Exception:
        return ""
    try:
        guidance = format_guidance_for_prompt(section_type, variant, rag_dir, limit=3)
        if guidance:
            print(f"[RAG tailwind] {section_type}/{variant}")
            for line in guidance.splitlines():
                if line.startswith("[Guide "):
                    print(f"  {line}")
        else:
            print(f"[RAG tailwind] {section_type}/{variant} -> no match")
        return guidance
    except Exception:
        return ""


def get_business_guidance(query: str, business_rag_dir: str | None) -> str:
    if not business_rag_dir or not query.strip():
        return ""
    try:
        from rag_business_playbooks import format_business_guidance_for_prompt  # type: ignore
    except Exception:
        return ""
    try:
        guidance = format_business_guidance_for_prompt(query, business_rag_dir, limit=3)
        if guidance:
            head = query[:120].replace("\n", " ")
            print(f"[RAG business] {head}")
            for line in guidance.splitlines():
                if line.startswith("[Playbook "):
                    print(f"  {line}")
        else:
            print(f"[RAG business] {query[:80]} -> no match")
        return guidance
    except Exception:
        return ""


def chat_json(api_key: str, system_prompt: str, user_prompt: str, temperature: float = 0.7, max_tokens: int = 3000) -> Any:
    body = {
        "model": MODEL,
        "temperature": temperature,
        "max_tokens": max_tokens,
        "response_format": {"type": "json_object"},
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    }
    req = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=json.dumps(body).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        method="POST",
    )
    ssl_context = build_ssl_context()
    try:
        with urllib.request.urlopen(req, timeout=90, context=ssl_context) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="ignore")
        raise RuntimeError(f"OpenAI API error {exc.code}: {detail}") from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"Network error while calling OpenAI: {exc}") from exc

    content = payload["choices"][0]["message"]["content"]
    return parse_json(content)


def phase_chat_json(
    api_key: str,
    phase_name: str,
    system_prompt: str,
    user_prompt: str,
    validator,
    temperature: float,
    max_tokens: int,
    retries: int = 2,
    prompt_log: list[dict[str, Any]] | None = None,
) -> Any:
    last_error: Exception | None = None
    repair_note = ""
    for attempt in range(retries + 1):
        prompt = user_prompt
        if repair_note:
            prompt = (
                f"{user_prompt}\n\nYour previous response failed validation.\n"
                f"Fix these issues exactly and return corrected JSON only:\n{repair_note}"
            )
        try:
            raw = chat_json(api_key, system_prompt, prompt, temperature=temperature, max_tokens=max_tokens)
            validated = validator(raw)
            validated.setdefault("_meta", {})
            validated["_meta"]["phase"] = phase_name
            validated["_meta"]["attempt"] = attempt + 1
            if prompt_log is not None:
                prompt_log.append(
                    {
                        "phase": phase_name,
                        "attempt": attempt + 1,
                        "system_prompt": system_prompt,
                        "user_prompt": prompt,
                        "response_json": validated,
                        "error": None,
                    }
                )
            return validated
        except Exception as exc:
            last_error = exc
            if prompt_log is not None:
                prompt_log.append(
                    {
                        "phase": phase_name,
                        "attempt": attempt + 1,
                        "system_prompt": system_prompt,
                        "user_prompt": prompt,
                        "response_json": None,
                        "error": str(exc),
                    }
                )
            repair_note = str(exc)
            if attempt < retries:
                time.sleep(1.2 * (attempt + 1))
    raise RuntimeError(f"{phase_name} failed after {retries + 1} attempts: {last_error}") from last_error


def build_ssl_context() -> ssl.SSLContext:
    cafile = os.environ.get("SSL_CERT_FILE") or os.environ.get("REQUESTS_CA_BUNDLE")
    if cafile:
        return ssl.create_default_context(cafile=cafile)

    try:
        import certifi  # type: ignore

        return ssl.create_default_context(cafile=certifi.where())
    except Exception:
        return ssl.create_default_context()


def validate_inferred_context(raw: Any) -> dict[str, Any]:
    if not isinstance(raw, dict):
        raise ValueError("Context inference must return a JSON object.")
    ctx = dict(raw)
    ctx["businessName"] = str(ctx.get("businessName") or "").strip() or "Unnamed Business"
    ctx["businessDescription"] = str(ctx.get("businessDescription") or "").strip()
    ctx["businessType"] = str(ctx.get("businessType") or ctx["businessName"]).strip() or "service-business"
    ctx["targetAudience"] = str(ctx.get("targetAudience") or "General audience").strip()
    ctx["primaryCta"] = str(ctx.get("primaryCta") or "Contact Us").strip()
    tone = str(ctx.get("tone") or "professional").strip()
    ctx["tone"] = tone if tone in TONES else "professional"
    page_type = str(ctx.get("pageType") or "service-business").strip()
    ctx["pageType"] = page_type if page_type in PAGE_TYPES else "service-business"
    ctx["mainOffer"] = str(ctx.get("mainOffer") or ctx["businessDescription"] or "Primary service").strip()
    ctx["location"] = str(ctx.get("location") or "").strip()
    ctx["differentiators"] = [str(v).strip() for v in normalize_list(ctx.get("differentiators")) if str(v).strip()]
    ctx["trustDrivers"] = [str(v).strip() for v in normalize_list(ctx.get("trustDrivers")) if str(v).strip()]
    ctx["customerMotivations"] = [str(v).strip() for v in normalize_list(ctx.get("customerMotivations")) if str(v).strip()]
    ctx["likelyObjections"] = [str(v).strip() for v in normalize_list(ctx.get("likelyObjections")) if str(v).strip()]
    ctx["visualStyleHints"] = [str(v).strip() for v in normalize_list(ctx.get("visualStyleHints")) if str(v).strip()]
    if not ctx["trustDrivers"]:
        ctx["trustDrivers"] = ["Clear service quality", "Low-friction next step"]
    if not ctx["customerMotivations"]:
        ctx["customerMotivations"] = ["Solve the main problem quickly", "Feel confident before contacting"]
    if not ctx["likelyObjections"]:
        ctx["likelyObjections"] = ["Is this right for my situation?", "Will this be worth the cost?"]
    if not ctx["visualStyleHints"]:
        ctx["visualStyleHints"] = ["Clean hierarchy", "Service-first presentation"]
    return ctx


def validate_site_plan(raw: Any) -> dict[str, Any]:
    if not isinstance(raw, dict):
        raise ValueError("Site planner must return a JSON object.")
    pages = raw.get("pages")
    if not isinstance(pages, list) or not pages:
        raise ValueError("Site planner must return a non-empty pages array.")
    normalized_pages: list[dict[str, Any]] = []
    seen_slugs: set[str] = set()
    homepage_count = 0
    has_contact_coverage = False
    for index, page in enumerate(pages[:8]):
        if not isinstance(page, dict):
            continue
        slug = slugify(page.get("slug") or page.get("title") or f"page-{index+1}")
        title = str(page.get("title") or slug.replace("-", " ").title()).strip()
        purpose = str(page.get("purpose") or f"Explain {title.lower()}").strip()
        page_type = str(page.get("pageType") or "service-business").strip()
        if page_type not in PAGE_TYPES:
            page_type = "service-business"
        suggested = [s for s in normalize_list(page.get("suggestedSections")) if str(s) in SECTION_TYPES]
        if not suggested:
            suggested = ["hero", "features", "cta-band", "footer"]
        if suggested[0] != "hero":
            suggested = ["hero"] + [s for s in suggested if s != "hero"]
        if suggested[-1] != "footer":
            suggested = [s for s in suggested if s != "footer"] + ["footer"]
        is_homepage = bool(page.get("isHomepage")) or slug == "home"
        if is_homepage:
            slug = "home"
            homepage_count += 1
        if slug in seen_slugs:
            slug = f"{slug}-{index+1}"
        seen_slugs.add(slug)
        if slug == "contact" or "contact" in suggested:
            has_contact_coverage = True
        normalized_pages.append(
            {
                "slug": slug,
                "title": title,
                "purpose": purpose,
                "pageType": page_type,
                "isHomepage": is_homepage,
                "suggestedSections": suggested,
            }
        )
    if homepage_count == 0:
        normalized_pages.insert(
            0,
            {
                "slug": "home",
                "title": "Home",
                "purpose": "Introduce the business, build trust, and drive the main CTA",
                "pageType": "service-business",
                "isHomepage": True,
                "suggestedSections": ["hero", "services", "testimonials", "contact", "footer"],
            },
        )
    elif homepage_count > 1:
        found = False
        for page in normalized_pages:
            page["isHomepage"] = page["slug"] == "home" and not found
            if page["isHomepage"]:
                found = True
    if not any(page["slug"] == "contact" for page in normalized_pages) and not has_contact_coverage:
        normalized_pages.append(
            {
                "slug": "contact",
                "title": "Contact",
                "purpose": "Turn interest into an inquiry or booking",
                "pageType": normalized_pages[0]["pageType"],
                "isHomepage": False,
                "suggestedSections": ["hero", "contact", "faq", "footer"],
            }
        )
    return {
        "siteGoal": str(raw.get("siteGoal") or "Explain the business clearly and drive the main conversion action.").strip(),
        "targetAudience": str(raw.get("targetAudience") or "General audience").strip(),
        "pages": normalized_pages[:8],
    }


def validate_shared_settings(raw: Any, site_plan: dict[str, Any], ctx: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(raw, dict):
        raise ValueError("Shared settings must return a JSON object.")
    brand = dict(raw.get("brand") or {})
    brand["tone"] = str(brand.get("tone") or ctx.get("tone") or "professional").strip()
    brand["primaryColor"] = ensure_hex(brand.get("primaryColor"), "#0f172a")
    brand["secondaryColor"] = ensure_hex(brand.get("secondaryColor"), "#f5efe6")
    brand["accentColor"] = ensure_hex(brand.get("accentColor"), "#22c55e")
    brand["fontHeading"] = str(brand.get("fontHeading") or "Georgia").strip()
    brand["fontBody"] = str(brand.get("fontBody") or "Arial").strip()
    theme_variant = str(raw.get("themeVariant") or "clean").strip()
    if theme_variant not in THEME_VARIANTS:
        theme_variant = "clean"
    design_mode = str(raw.get("designMode") or "").strip()
    if design_mode not in DESIGN_MODES:
        archetype = infer_homepage_archetype(ctx, next((p for p in site_plan.get("pages", []) if p.get("isHomepage")), site_plan.get("pages", [{}])[0]))
        if archetype == "visual-premium":
            design_mode = "editorial-luxe"
        elif archetype == "local-service":
            design_mode = "warm-service"
        elif archetype == "trust-service":
            design_mode = "clinical-structured"
        else:
            design_mode = "soft-glass"
    actions = []
    for i, action in enumerate(normalize_list(raw.get("actions"))):
        if not isinstance(action, dict):
            continue
        action_id = slugify(action.get("id") or f"action-{i+1}")
        actions.append(
            {
                "id": action_id,
                "label": str(action.get("label") or "Contact Us").strip(),
                "type": str(action.get("type") or "url").strip(),
                "value": str(action.get("value") or "#contact").strip() or "#contact",
                "style": str(action.get("style") or "primary").strip(),
            }
        )
    if not actions:
        actions = [{"id": "action-primary", "label": ctx.get("primaryCta", "Contact Us"), "type": "url", "value": "#contact", "style": "primary"}]
    nav = []
    raw_nav = raw.get("navigation")
    pages = site_plan.get("pages", [])
    nav_source = raw_nav if isinstance(raw_nav, list) and raw_nav else [
        {"label": page["title"], "href": "#home" if page["slug"] == "home" else f"#{page['slug']}"}
        for page in pages
    ]
    for item in nav_source:
        if not isinstance(item, dict):
            continue
        nav.append(
            {
                "label": str(item.get("label") or "Page").strip(),
                "href": str(item.get("href") or "#home").strip(),
            }
        )
    footer = dict(raw.get("footer") or {})
    columns = []
    for col in normalize_list(footer.get("columns")):
        if not isinstance(col, dict):
            continue
        links = []
        for link in normalize_list(col.get("links")):
            if not isinstance(link, dict):
                continue
            links.append(
                {
                    "text": str(link.get("text") or "Link").strip(),
                    "href": str(link.get("href") or "#home").strip(),
                }
            )
        columns.append({"title": str(col.get("title") or "Quick Links").strip(), "links": links})
    footer = {
        "companyName": str(footer.get("companyName") or ctx.get("businessName") or "Business").strip(),
        "tagline": str(footer.get("tagline") or ctx.get("mainOffer") or ctx.get("businessDescription") or "").strip(),
        "columns": columns[:3] or [{"title": "Quick Links", "links": nav[:4]}],
        "copyrightYear": str(footer.get("copyrightYear") or "2026").strip(),
    }
    return {
        "brand": brand,
        "themeVariant": theme_variant,
        "designMode": design_mode,
        "actions": actions,
        "header": {
            "siteName": str((raw.get("header") or {}).get("siteName") or ctx.get("businessName") or "Business").strip(),
            "showNav": bool((raw.get("header") or {}).get("showNav", True)),
        },
        "footer": footer,
        "navigation": nav,
    }


def validate_design_brief(raw: Any, ctx: dict[str, Any], shared_settings: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(raw, dict):
        raise ValueError("Design planner must return a JSON object.")
    hero = dict(raw.get("heroStrategy") or {})
    navbar = dict(raw.get("navigationStrategy") or {})
    typography = dict(raw.get("typographyStrategy") or {})
    visual = dict(raw.get("visualSystem") or {})
    flow = dict(raw.get("sectionFlowStrategy") or {})
    conversion = dict(raw.get("conversionStrategy") or {})
    return {
        "heroStrategy": {
            "layout": str(hero.get("layout") or "Use a content-first hero with immediate CTA visibility.").strip(),
            "goal": str(hero.get("goal") or f"Quickly explain the offer and move visitors toward {ctx.get('primaryCta', 'action')}.").strip(),
            "headlineStyle": str(hero.get("headlineStyle") or "Lead with the offer and outcome").strip(),
            "supportingCopyStyle": str(hero.get("supportingCopyStyle") or "Clarify who it is for and why it matters").strip(),
            "ctaApproach": str(hero.get("ctaApproach") or "Make the primary CTA obvious and low-friction").strip(),
            "trustSupport": str(hero.get("trustSupport") or "Add proof or reassurance early").strip(),
        },
        "navigationStrategy": {
            "style": str(navbar.get("style") or "clean, elegant, and minimal").strip(),
            "links": [str(v).strip() for v in normalize_list(navbar.get("links")) if str(v).strip()] or ["Home", "Services", "Contact"],
            "ctaPlacement": str(navbar.get("ctaPlacement") or "Place the main CTA at the far right of the nav.").strip(),
            "notes": str(navbar.get("notes") or "Keep navigation light and focused on conversion.").strip(),
        },
        "visualSystem": {
            "designIntent": str(visual.get("designIntent") or "Create a homepage that feels intentional, clear, and conversion-focused.").strip(),
            "primaryColorRole": str(visual.get("primaryColorRole") or "Use primary in anchor moments and dominant visual surfaces.").strip(),
            "secondaryColorRole": str(visual.get("secondaryColorRole") or "Use secondary in calmer sections and softer contrast surfaces.").strip(),
            "accentColorRole": str(visual.get("accentColorRole") or "Use accent for CTA emphasis and small attention cues.").strip(),
            "contrastStrategy": str(visual.get("contrastStrategy") or "Balance emphasis sections with calmer sections to make scanning easy.").strip(),
            "surfaceStyle": str(visual.get("surfaceStyle") or "Use layered cards and purposeful surface contrast, not flat filler.").strip(),
        },
        "typographyStrategy": {
            "headingApproach": str(typography.get("headingApproach") or f"Use {shared_settings['brand']['fontHeading']} with strong hierarchy").strip(),
            "bodyApproach": str(typography.get("bodyApproach") or f"Use {shared_settings['brand']['fontBody']} for clarity and easy scanning").strip(),
            "hierarchyNotes": str(typography.get("hierarchyNotes") or "Use strong contrast between headlines, subheads, and supporting text.").strip(),
            "fontPairingDirection": str(typography.get("fontPairingDirection") or "Pick a pairing that feels credible and distinctive for this business.").strip(),
        },
        "sectionFlowStrategy": {
            "openingExperience": str(flow.get("openingExperience") or "Open with clarity, then quickly add trust or proof.").strip(),
            "midPageRhythm": str(flow.get("midPageRhythm") or "Alternate explanation, value, and proof so the page keeps momentum.").strip(),
            "closingExperience": str(flow.get("closingExperience") or "Build toward reassurance and a stronger CTA close.").strip(),
            "densityPattern": str(flow.get("densityPattern") or "Alternate denser informational blocks with lighter breathing space.").strip(),
        },
        "conversionStrategy": {
            "primaryFrictionToReduce": str(conversion.get("primaryFrictionToReduce") or "Uncertainty about fit or trust.").strip(),
            "howDesignSupportsTrust": str(conversion.get("howDesignSupportsTrust") or "Place trust cues early and repeat reassurance before the final CTA.").strip(),
            "howDesignSupportsAction": str(conversion.get("howDesignSupportsAction") or "Keep the CTA prominent at key decision points.").strip(),
            "whatMustNotHappen": [str(v).strip() for v in normalize_list(conversion.get("whatMustNotHappen")) if str(v).strip()] or ["Do not bury the CTA.", "Do not make the hero vague."],
        },
        "implementationNotes": [str(v).strip() for v in normalize_list(raw.get("implementationNotes")) if str(v).strip()] or ["Use the hero to state the offer immediately.", "Carry the accent color mostly in CTAs and emphasis moments."],
    }


def validate_design_review(raw: Any) -> dict[str, Any]:
    return validate_section_review(raw)


def review_and_improve_design_brief(
    api_key: str,
    design_brief: dict[str, Any],
    ctx: dict[str, Any],
    site_plan: dict[str, Any],
    shared_settings: dict[str, Any],
    prompt_log: list[dict[str, Any]],
    rag_guidance: str = "",
) -> dict[str, Any]:
    review = phase_chat_json(
        api_key,
        "design_review",
        DESIGN_REVIEW_SYSTEM,
        design_review_user_prompt(design_brief, ctx, site_plan, rag_guidance),
        validate_design_review,
        temperature=0.2,
        max_tokens=1600,
        retries=1,
        prompt_log=prompt_log,
    )
    if review.get("pass"):
        design_brief["_review"] = review
        return design_brief
    improved = phase_chat_json(
        api_key,
        "design_rewrite",
        DESIGN_PLANNER_SYSTEM,
        (
            design_planner_user_prompt(ctx, site_plan, shared_settings, rag_guidance)
            + "\n\nPrevious design brief:\n"
            + json.dumps(design_brief, indent=2)
            + "\n\nReview feedback:\n"
            + json.dumps(review, indent=2)
            + "\n\nReturn a stronger revised design brief that fixes these issues."
        ),
        lambda raw: validate_design_brief(raw, ctx, shared_settings),
        temperature=0.45,
        max_tokens=2000,
        retries=1,
        prompt_log=prompt_log,
    )
    improved["_review"] = review
    return improved


def infer_homepage_archetype(ctx: dict[str, Any], home_page: dict[str, Any]) -> str:
    text = " ".join(
        str(v)
        for v in [
            ctx.get("businessType", ""),
            ctx.get("businessDescription", ""),
            ctx.get("mainOffer", ""),
            ctx.get("targetAudience", ""),
            home_page.get("pageType", ""),
        ]
    ).lower()
    if any(term in text for term in ["salon", "beauty", "spa", "aesthetic", "bridal", "makeup", "brow", "lash"]):
        return "visual-premium"
    if any(term in text for term in ["pet", "groom", "mobile", "home service", "at home", "cleaning", "repair"]):
        return "local-service"
    if any(term in text for term in ["clinic", "doctor", "therapy", "dental", "physio", "medical", "health"]):
        return "trust-service"
    if any(term in text for term in ["software", "saas", "platform", "app", "dashboard", "workflow"]):
        return "saas"
    return "general-service"


def default_homepage_sections(home_page: dict[str, Any], ctx: dict[str, Any]) -> list[dict[str, Any]]:
    archetype = infer_homepage_archetype(ctx, home_page)
    section_sets = {
        "visual-premium": [
            ("hero", "background-image", "Lead with aspiration, premium positioning, and booking intent"),
            ("gallery", "grid", "Show the visual finish and atmosphere early"),
            ("services", "image-cards", "Present key services with a richer editorial feel"),
            ("about-team", "story", "Build trust through expertise and point of view"),
            ("testimonials", "single-highlight", "Use selective proof that feels premium rather than crowded"),
            ("cta-band", "dual", "Close with a strong booking CTA and softer secondary path"),
            ("footer", "multi-column", "Provide navigation and trust closure"),
        ],
        "local-service": [
            ("hero", "offer-focused", "Lead with convenience, clarity, and a fast booking action"),
            ("trust-bar", "with-icons", "Reassure quickly with proof and operating signals"),
            ("how-it-works", "numbered-steps", "Explain the service process with low-friction clarity"),
            ("services", "cards", "Outline the service menu clearly"),
            ("testimonials", "cards", "Show local proof and reassurance"),
            ("contact", "form-with-info", "Make the next step immediate and practical"),
            ("footer", "simple", "Close cleanly without excess navigation weight"),
        ],
        "trust-service": [
            ("hero", "split-image", "Lead with clarity, credibility, and a confidence-building CTA"),
            ("problem-solution", "two-column", "Frame the pain point and your approach clearly"),
            ("results", "full-section", "Make outcomes and reassurance scannable"),
            ("about-team", "values", "Establish practitioner credibility and care standards"),
            ("faq", "accordion", "Handle anxiety and objections directly"),
            ("contact", "form-with-info", "Support action after confidence is built"),
            ("footer", "legal-heavy", "Close with a more trust-oriented footer"),
        ],
        "saas": [
            ("hero", "split-image", "Lead with product value, workflow clarity, and a direct CTA"),
            ("features", "icon-grid", "Explain core product capabilities"),
            ("benefits", "cards", "Translate features into business value"),
            ("how-it-works", "timeline", "Clarify the product flow"),
            ("results", "stat-bar", "Support value claims with outcome framing"),
            ("faq", "two-column", "Handle evaluation questions efficiently"),
            ("cta-band", "dual", "Close with trial/demo conversion paths"),
            ("footer", "multi-column", "Support deeper product navigation"),
        ],
        "general-service": [
            ("hero", "centered", "Lead with the offer and primary CTA"),
            ("features", "icon-grid", "Clarify the offer quickly"),
            ("services", "cards", "Explain what is included"),
            ("testimonials", "cards", "Reinforce trust with proof"),
            ("faq", "accordion", "Reduce hesitation"),
            ("cta-band", "centered", "Drive the main action"),
            ("footer", "simple", "Close with navigation and trust"),
        ],
    }
    return [
        {"type": stype, "variant": variant, "purpose": purpose}
        for stype, variant, purpose in section_sets[archetype]
    ]


def validate_page_plan(raw: Any, home_page: dict[str, Any], ctx: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(raw, dict):
        raise ValueError("Page planner must return a JSON object.")
    sections = []
    for i, section in enumerate(normalize_list(raw.get("sections"))):
        if not isinstance(section, dict):
            continue
        stype = str(section.get("type") or "").strip()
        if stype not in SECTION_TYPES:
            continue
        variant = str(section.get("variant") or "").strip() or SECTION_VARIANTS.get(stype, ["default"])[0]
        if variant not in SECTION_VARIANTS.get(stype, [variant]):
            variant = SECTION_VARIANTS[stype][0]
        sections.append(
            {
                "type": stype,
                "purpose": str(section.get("purpose") or f"Support the page goal with {stype}").strip(),
                "variant": variant,
            }
        )
    if not sections:
        sections = default_homepage_sections(home_page, ctx)
    if sections[0]["type"] != "hero":
        sections = [{"type": "hero", "purpose": "Lead with the main offer and CTA", "variant": SECTION_VARIANTS["hero"][0]}] + [s for s in sections if s["type"] != "hero"]
    if sections[-1]["type"] != "footer":
        sections = [s for s in sections if s["type"] != "footer"] + [{"type": "footer", "purpose": "Close with navigation and trust", "variant": SECTION_VARIANTS["footer"][0]}]
    if len(sections) < 5:
        fallback = default_homepage_sections(home_page, ctx)
        existing = {s["type"] for s in sections}
        for section in fallback:
            if section["type"] not in existing:
                sections.insert(-1, section)
                existing.add(section["type"])
            if len(sections) >= 6:
                break
    return {
        "slug": str(raw.get("slug") or home_page["slug"]).strip() or home_page["slug"],
        "title": str(raw.get("title") or home_page["title"]).strip() or home_page["title"],
        "pageType": str(raw.get("pageType") or home_page["pageType"]).strip() if str(raw.get("pageType") or home_page["pageType"]).strip() in PAGE_TYPES else home_page["pageType"],
        "sections": sections,
    }


def choose_hero_variant(design_brief: dict[str, Any]) -> str:
    layout = str(((design_brief.get("heroStrategy") or {}).get("layout")) or "").lower()
    if "split" in layout:
        return "split-image"
    if "background" in layout or "full-width" in layout:
        return "background-image"
    if "offer" in layout or "cta" in layout:
        return "offer-focused"
    return "centered"


def enforce_design_on_page_plan(page_plan: dict[str, Any], design_brief: dict[str, Any]) -> dict[str, Any]:
    sections = list(page_plan.get("sections", []))
    if not sections:
        return page_plan

    hero_variant = choose_hero_variant(design_brief)
    for section in sections:
        if section.get("type") == "hero":
            section["variant"] = hero_variant
            break

    trust_support = str(((design_brief.get("heroStrategy") or {}).get("trustSupport")) or "").lower()
    has_early_trust = any(s.get("type") in {"trust-bar", "testimonials", "results"} for s in sections[1:3])
    if ("trust" in trust_support or "badge" in trust_support or "review" in trust_support) and not has_early_trust:
        sections.insert(
            1,
            {
                "type": "trust-bar",
                "purpose": "Reinforce trust immediately after the hero with fast-scanning proof signals",
                "variant": SECTION_VARIANTS["trust-bar"][0],
            },
        )

    deduped: list[dict[str, Any]] = []
    seen_footer = False
    for section in sections:
        if section.get("type") == "footer":
            if seen_footer:
                continue
            seen_footer = True
        deduped.append(section)
    if deduped[-1].get("type") != "footer":
        deduped = [s for s in deduped if s.get("type") != "footer"] + [{"type": "footer", "purpose": "Close with navigation and trust", "variant": "simple"}]
    page_plan["sections"] = deduped
    return page_plan


def normalize_action(button: Any, action_index: dict[str, dict[str, Any]]) -> dict[str, Any]:
    if not isinstance(button, dict):
        return {"text": "Contact Us", "actionId": "action-primary", "style": "primary"}
    action_id = str(button.get("actionId") or button.get("action") or "action-primary").strip()
    action = action_index.get(action_id) or next(iter(action_index.values()), {"id": action_id, "value": "#contact"})
    return {
        "text": str(button.get("text") or action.get("label") or "Learn More").strip(),
        "actionId": action.get("id", action_id),
        "style": str(button.get("style") or action.get("style") or "primary").strip(),
    }


def normalize_section_content(stype: str, content: Any, ctx: dict[str, Any], action_index: dict[str, dict[str, Any]]) -> dict[str, Any]:
    if not isinstance(content, dict):
        content = {"heading": str(content).strip()} if isinstance(content, str) and content.strip() else {}
    normalized = dict(content)
    normalized.setdefault("heading", "")
    normalized.setdefault("subheading", "")
    normalized.setdefault("eyebrow", "")
    normalized.setdefault("badge", "")
    normalized.setdefault("ctaNote", "")
    normalized["supportingPoints"] = [str(v).strip() for v in normalize_list(normalized.get("supportingPoints")) if str(v).strip()]
    normalized["trustChips"] = [str(v).strip() for v in normalize_list(normalized.get("trustChips")) if str(v).strip()]
    if stype == "hero":
        normalized.setdefault("heading", f"{ctx.get('mainOffer', 'Get started')} with {ctx.get('businessName', 'our team')}")
        normalized.setdefault("subheading", ctx.get("businessDescription", ""))
        normalized["buttons"] = [normalize_action(btn, action_index) for btn in normalize_list(normalized.get("buttons"))[:2]] or [normalize_action({}, action_index)]
    elif stype in {"features", "benefits", "services", "gallery", "about-team"}:
        items = []
        for item in normalize_list(normalized.get("items")):
            if isinstance(item, dict):
                items.append(
                    {
                        "title": str(item.get("title") or item.get("name") or "").strip(),
                        "description": str(item.get("description") or item.get("bio") or "").strip(),
                    }
                )
        normalized["items"] = items
    elif stype == "problem-solution":
        normalized["problem"] = str(normalized.get("problem") or "").strip()
        normalized["solution"] = str(normalized.get("solution") or "").strip()
    elif stype == "how-it-works":
        steps = []
        for idx, step in enumerate(normalize_list(normalized.get("steps")), start=1):
            if isinstance(step, dict):
                steps.append(
                    {
                        "step": str(step.get("step") or idx).strip(),
                        "title": str(step.get("title") or "").strip(),
                        "description": str(step.get("description") or "").strip(),
                    }
                )
        normalized["steps"] = steps
    elif stype == "testimonials":
        items = []
        for item in normalize_list(normalized.get("items")):
            if isinstance(item, dict):
                items.append(
                    {
                        "quote": str(item.get("quote") or "").strip(),
                        "author": str(item.get("author") or "").strip(),
                    }
                )
        normalized["items"] = items
    elif stype == "results":
        stats = []
        for stat in normalize_list(normalized.get("stats")):
            if isinstance(stat, dict):
                stats.append({"value": str(stat.get("value") or "").strip(), "label": str(stat.get("label") or "").strip()})
        normalized["stats"] = stats
    elif stype == "pricing":
        plans = []
        for plan in normalize_list(normalized.get("plans")):
            if isinstance(plan, dict):
                plans.append(
                    {
                        "name": str(plan.get("name") or "").strip(),
                        "price": str(plan.get("price") or "").strip(),
                        "description": str(plan.get("description") or "").strip(),
                        "features": [str(v).strip() for v in normalize_list(plan.get("features")) if str(v).strip()],
                    }
                )
        normalized["plans"] = plans
    elif stype == "faq":
        items = []
        for item in normalize_list(normalized.get("items")):
            if isinstance(item, dict):
                items.append({"question": str(item.get("question") or "").strip(), "answer": str(item.get("answer") or "").strip()})
        normalized["items"] = items
    elif stype == "cta-band":
        normalized["buttons"] = [normalize_action(btn, action_index) for btn in normalize_list(normalized.get("buttons"))[:2]] or [normalize_action({}, action_index)]
    elif stype == "contact":
        normalized.setdefault("details", [ctx.get("location", ""), ctx.get("primaryCta", "Contact Us")])
        normalized["details"] = [str(v).strip() for v in normalize_list(normalized.get("details")) if str(v).strip()]
    elif stype == "trust-bar":
        normalized["items"] = [str(v).strip() for v in normalize_list(normalized.get("items")) if str(v).strip()]
    elif stype == "service-area":
        normalized["areas"] = [str(v).strip() for v in normalize_list(normalized.get("areas")) if str(v).strip()]
    elif stype == "footer":
        columns = []
        for col in normalize_list(normalized.get("columns")):
            if isinstance(col, dict):
                links = []
                raw_links = normalize_list(col.get("links") or col.get("items"))
                for link in raw_links:
                    if isinstance(link, dict):
                        links.append(
                            {
                                "text": str(link.get("text") or "").strip(),
                                "href": str(link.get("href") or link.get("url") or link.get("link") or "#home").strip(),
                            }
                        )
                columns.append({"title": str(col.get("title") or "Quick Links").strip(), "links": links})
        normalized["companyName"] = str(normalized.get("companyName") or ctx.get("businessName") or "Business").strip()
        normalized["tagline"] = str(normalized.get("tagline") or ctx.get("mainOffer") or "").strip()
        normalized["columns"] = columns
        normalized["copyrightYear"] = str(normalized.get("copyrightYear") or "2026").strip()
    return normalized


def validate_section_review(raw: Any) -> dict[str, Any]:
    if not isinstance(raw, dict):
        raise ValueError("Section review must return a JSON object.")
    score = raw.get("score", 0)
    try:
        score = int(score)
    except Exception:
        score = 0
    issues = []
    for issue in normalize_list(raw.get("issues")):
        if isinstance(issue, dict):
            issues.append(
                {
                    "severity": str(issue.get("severity") or "medium").strip(),
                    "type": str(issue.get("type") or "content").strip(),
                    "message": str(issue.get("message") or "").strip(),
                    "field": str(issue.get("field") or "").strip(),
                }
            )
    return {
        "pass": bool(raw.get("pass")) and score >= 75,
        "score": score,
        "summary": str(raw.get("summary") or "").strip(),
        "issues": issues,
        "requiredFixes": [str(v).strip() for v in normalize_list(raw.get("requiredFixes")) if str(v).strip()],
        "strengths": [str(v).strip() for v in normalize_list(raw.get("strengths")) if str(v).strip()],
    }


def validate_rewritten_section(
    raw: Any,
    original_section: dict[str, Any],
    shared_settings: dict[str, Any],
    ctx: dict[str, Any],
) -> dict[str, Any]:
    if not isinstance(raw, dict):
        raise ValueError("Rewritten section must return a JSON object.")
    action_index = {a["id"]: a for a in shared_settings.get("actions", [])}
    stype = original_section.get("type", "")
    variant = str(raw.get("variant") or original_section.get("variant") or "").strip()
    if variant not in SECTION_VARIANTS.get(stype, [variant]):
        variant = original_section.get("variant") or SECTION_VARIANTS.get(stype, ["centered"])[0]
    return {
        "id": str(raw.get("id") or original_section.get("id") or f"section-{stype}").strip(),
        "type": stype,
        "variant": variant,
        "visible": bool(raw.get("visible", original_section.get("visible", True))),
        "order": int(raw.get("order", original_section.get("order", 0))),
        "layoutHint": str(raw.get("layoutHint") or original_section.get("layoutHint") or "").strip(),
        "motionHint": str(raw.get("motionHint") or original_section.get("motionHint") or "").strip(),
        "content": normalize_section_content(stype, raw.get("content"), ctx, action_index),
        "style": dict(raw.get("style") or original_section.get("style") or {}),
    }


def validate_keyword_strategy(raw: Any, site_plan: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(raw, dict):
        raise ValueError("Keyword strategy must return a JSON object.")
    pages = []
    by_slug = {str(page.get("slug") or ""): page for page in site_plan.get("pages", [])}
    for item in normalize_list(raw.get("pageKeywordStrategy")):
        if not isinstance(item, dict):
            continue
        slug = slugify(item.get("slug") or "")
        if slug not in by_slug:
            continue
        pages.append(
            {
                "slug": slug,
                "primaryIntent": str(item.get("primaryIntent") or "Capture commercial search intent and guide visitors toward the main CTA.").strip(),
                "coreKeywords": [str(v).strip() for v in normalize_list(item.get("coreKeywords")) if str(v).strip()][:12],
                "trustKeywords": [str(v).strip() for v in normalize_list(item.get("trustKeywords")) if str(v).strip()][:12],
                "supportingKeywords": [str(v).strip() for v in normalize_list(item.get("supportingKeywords")) if str(v).strip()][:12],
            }
        )
    if not pages:
        homepage = next((p for p in site_plan.get("pages", []) if p.get("isHomepage")), site_plan.get("pages", [{}])[0])
        pages = [{
            "slug": homepage.get("slug", "home"),
            "primaryIntent": "Capture high-intent local service searches and drive booking intent.",
            "coreKeywords": ["mobile pet grooming", "dog grooming at home", "cat grooming service"],
            "trustKeywords": ["experienced pet groomers", "gentle pet grooming", "trusted mobile grooming"],
            "supportingKeywords": ["stress-free grooming", "convenient pet grooming", "home grooming appointments"],
        }]
    return {
        "siteIntent": str(raw.get("siteIntent") or "Create commercially useful content that matches real search intent.").strip(),
        "pageKeywordStrategy": pages,
    }


def validate_section_keyword_plan(raw: Any, page_plan: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(raw, dict):
        raise ValueError("Section keyword plan must return a JSON object.")
    planned_sections = [section.get("type") for section in page_plan.get("sections", [])]
    planned_set = set(planned_sections)
    sections = []
    for item in normalize_list(raw.get("sections")):
        if not isinstance(item, dict):
            continue
        stype = str(item.get("type") or "").strip()
        if stype not in planned_set:
            continue
        keywords = [str(v).strip() for v in normalize_list(item.get("keywords")) if str(v).strip()]
        if len(keywords) < 8:
            raise ValueError(f"Section keyword plan for {stype} must contain at least 8 keywords.")
        sections.append({"type": stype, "keywords": keywords[:15]})
    by_type = {item["type"]: item for item in sections}
    normalized = []
    for stype in planned_sections:
        if stype in by_type:
            normalized.append(by_type[stype])
        else:
            fallback = {
                "hero": ["mobile pet grooming", "at-home grooming", "stress-free pet care", "dog grooming", "cat grooming", "book grooming appointment", "pet grooming Bangalore", "trusted groomers", "convenient grooming", "gentle pet care"],
                "features": ["home grooming benefits", "low-stress appointments", "professional pet care", "experienced pet groomers", "clean grooming tools", "comfort-first grooming", "convenient scheduling", "pet-safe products", "friendly groomers", "reliable service"],
                "testimonials": ["pet grooming reviews", "happy pet owners", "gentle grooming feedback", "trusted mobile grooming", "customer experience", "pet comfort", "stress-free grooming review", "recommended groomers", "pet care testimonials", "local pet grooming reviews"],
                "faq": ["pet grooming questions", "mobile grooming cost", "how mobile grooming works", "pet grooming timing", "booking questions", "dog grooming FAQs", "cat grooming FAQs", "service area questions", "appointment preparation", "pet comfort during grooming"],
                "cta-band": ["book pet grooming", "schedule grooming", "contact groomer", "grooming appointment", "home pet grooming", "trusted mobile groomer", "easy booking", "pet grooming Bangalore", "dog and cat grooming", "call to book"],
                "footer": ["contact pet groomer", "pet grooming Bangalore", "mobile grooming contact", "service links", "book grooming", "dog grooming", "cat grooming", "customer reviews", "faq", "contact us"],
            }.get(stype, ["service details", "business trust", "local service", "main offer", "customer benefit", "specific service", "booking action", "commercial intent", "buyer questions", "conversion support"])
            normalized.append({"type": stype, "keywords": fallback})
    return {"sections": normalized}


def section_has_substance(section: dict[str, Any]) -> bool:
    stype = section.get("type", "")
    content = section.get("content", {})
    if stype == "hero":
        return bool(content.get("heading") and content.get("subheading") and normalize_list(content.get("buttons")))
    if stype in {"features", "benefits", "services", "gallery", "about-team"}:
        return len(normalize_list(content.get("items"))) >= 3
    if stype == "how-it-works":
        return len(normalize_list(content.get("steps"))) >= 3
    if stype == "testimonials":
        return len(normalize_list(content.get("items"))) >= 2
    if stype == "results":
        return len(normalize_list(content.get("stats"))) >= 2
    if stype == "pricing":
        return len(normalize_list(content.get("plans"))) >= 2
    if stype == "faq":
        return len(normalize_list(content.get("items"))) >= 4
    if stype == "cta-band":
        return bool(content.get("heading") and normalize_list(content.get("buttons")))
    if stype == "contact":
        return bool(content.get("heading") or normalize_list(content.get("details")))
    if stype == "footer":
        return bool(content.get("companyName") and normalize_list(content.get("columns")))
    if stype == "trust-bar":
        return len(normalize_list(content.get("items"))) >= 3
    if stype == "problem-solution":
        return bool(content.get("problem") and content.get("solution"))
    if stype == "service-area":
        return len(normalize_list(content.get("areas"))) >= 3
    return bool(content)


def review_and_regenerate_sections(
    api_key: str,
    page_doc: dict[str, Any],
    page_plan: dict[str, Any],
    shared_settings: dict[str, Any],
    ctx: dict[str, Any],
    prompt_log: list[dict[str, Any]],
) -> dict[str, Any]:
    reviewed_sections: list[dict[str, Any]] = []
    for section in page_doc.get("sections", []):
        review = phase_chat_json(
            api_key,
            f"section_review:{section.get('type', 'unknown')}",
            SECTION_REVIEW_SYSTEM,
            section_review_user_prompt(section, page_plan, ctx, shared_settings, page_doc.get("sections", [])),
            validate_section_review,
            temperature=0.2,
            max_tokens=1800,
            retries=1,
            prompt_log=prompt_log,
        )
        current = section
        if (not review.get("pass")) or (not section_has_substance(section)):
            rewrite = phase_chat_json(
                api_key,
                f"section_rewrite:{section.get('type', 'unknown')}",
                SECTION_REWRITE_SYSTEM,
                section_rewrite_user_prompt(section, review, page_plan, ctx, shared_settings),
                lambda raw: validate_rewritten_section(raw, section, shared_settings, ctx),
                temperature=0.5,
                max_tokens=2200,
                retries=1,
                prompt_log=prompt_log,
            )
            current = rewrite
        reviewed_sections.append(current)
    page_doc["sections"] = reviewed_sections
    return page_doc


def write_sections_with_keywords(
    api_key: str,
    page_doc: dict[str, Any],
    page_plan: dict[str, Any],
    shared_settings: dict[str, Any],
    ctx: dict[str, Any],
    design_brief: dict[str, Any],
    section_keyword_plan: dict[str, Any],
    prompt_log: list[dict[str, Any]],
    rag_dir: str | None = None,
    business_rag_guidance: str = "",
) -> dict[str, Any]:
    keyword_map = {item["type"]: item["keywords"] for item in section_keyword_plan.get("sections", [])}
    planned_by_type = {item["type"]: item for item in page_plan.get("sections", [])}
    written_sections: list[dict[str, Any]] = []
    for section in page_doc.get("sections", []):
        stype = section.get("type", "")
        keywords = keyword_map.get(stype, [])
        selected_pattern = (planned_by_type.get(stype) or {}).get("selectedPattern")
        rag_guidance = get_variant_guidance(stype, str(section.get("variant") or ""), rag_dir)
        rewritten = phase_chat_json(
            api_key,
            f"section_content:{stype}",
            SECTION_CONTENT_SYSTEM,
            section_content_user_prompt(
                section,
                page_plan,
                ctx,
                shared_settings,
                design_brief,
                keywords,
                rag_guidance,
                business_rag_guidance,
                selected_pattern,
            ),
            lambda raw: validate_rewritten_section(raw, section, shared_settings, ctx),
            temperature=0.55,
            max_tokens=2200,
            retries=1,
            prompt_log=prompt_log,
        )
        written_sections.append(rewritten)
    page_doc["sections"] = written_sections
    return page_doc


def validate_page_document(raw: Any, page_plan: dict[str, Any], shared_settings: dict[str, Any], ctx: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(raw, dict):
        raise ValueError("Page generator must return a JSON object.")
    doc = dict(raw)
    action_index = {a["id"]: a for a in shared_settings.get("actions", [])}
    planned_by_type = {section["type"]: section for section in page_plan["sections"]}
    normalized_sections = []
    for i, section in enumerate(normalize_list(doc.get("sections"))):
        if not isinstance(section, dict):
            continue
        stype = str(section.get("type") or "").strip()
        if stype not in SECTION_TYPES or stype not in planned_by_type:
            continue
        planned = planned_by_type[stype]
        variant = str(section.get("variant") or planned["variant"]).strip()
        if variant not in SECTION_VARIANTS.get(stype, [variant]):
            variant = planned["variant"]
        normalized_sections.append(
            {
                "id": str(section.get("id") or f"section-{stype}-{i+1}").strip(),
                "type": stype,
                "variant": variant,
                "visible": bool(section.get("visible", True)),
                "order": int(section.get("order", i)),
                "layoutHint": str(section.get("layoutHint") or "").strip(),
                "motionHint": str(section.get("motionHint") or "").strip(),
                "content": normalize_section_content(stype, section.get("content"), ctx, action_index),
                "style": dict(section.get("style") or {}),
            }
        )
    existing_types = {section["type"] for section in normalized_sections}
    for planned in page_plan["sections"]:
        if planned["type"] not in existing_types:
            normalized_sections.append(
                {
                    "id": f"section-{planned['type']}-{len(normalized_sections)+1}",
                    "type": planned["type"],
                    "variant": planned["variant"],
                    "visible": True,
                    "order": len(normalized_sections),
                    "layoutHint": "",
                    "motionHint": "",
                    "content": normalize_section_content(planned["type"], {}, ctx, action_index),
                    "style": {},
                }
            )
    normalized_sections.sort(key=lambda section: section["order"])
    if normalized_sections[0]["type"] != "hero":
        raise ValueError("Generated page document must start with hero.")
    if normalized_sections[-1]["type"] != "footer":
        raise ValueError("Generated page document must end with footer.")
    doc["sections"] = normalized_sections
    doc.setdefault("meta", {})
    doc["meta"]["title"] = str(doc["meta"].get("title") or page_plan["title"]).strip()
    doc["meta"]["description"] = str(doc["meta"].get("description") or ctx.get("businessDescription") or "").strip()
    doc["meta"]["pageType"] = page_plan["pageType"]
    doc["meta"]["themeVariant"] = shared_settings.get("themeVariant", "clean")
    doc["meta"]["slug"] = page_plan["slug"]
    doc["brand"] = shared_settings["brand"]
    doc["assets"] = normalize_list(doc.get("assets"))
    doc["actions"] = shared_settings.get("actions", [])
    return doc


@dataclass
class Inputs:
    name: str
    description: str
    location: str
    audience: str
    output: Path


INFER_CONTEXT_SYSTEM = """You are a business context analyst for website generation.

Turn a business name and short description into a compact but commercially useful context object.

Rules:
- Return JSON only
- Be concrete, not generic
- Infer realistic values only when the input strongly suggests them
- pageType must be one of: local-business, service-business, saas, coach, product-sales
- tone must be one of: professional, casual, playful, bold, elegant, friendly, authoritative
- Focus on what helps downstream homepage planning and conversion decisions
"""


def infer_context_user_prompt(inputs: Inputs) -> str:
    return f"""Infer website-generation context for this business.

Business Name: {inputs.name}
Description: {inputs.description}
Location: {inputs.location or "Not provided"}
Audience Hint: {inputs.audience or "Not provided"}

Return JSON with:
{{
  "businessName": "...",
  "businessDescription": "...",
  "businessType": "...",
  "targetAudience": "...",
  "primaryCta": "...",
  "tone": "professional|casual|playful|bold|elegant|friendly|authoritative",
  "pageType": "local-business|service-business|saas|coach|product-sales",
  "mainOffer": "...",
  "location": "...",
  "differentiators": ["...", "..."],
  "trustDrivers": ["...", "..."],
  "customerMotivations": ["...", "..."],
  "likelyObjections": ["...", "..."],
  "visualStyleHints": ["...", "..."]
}}
"""


SITE_PLANNER_SYSTEM = """You are a senior website architecture planner and conversion-focused information architect.

Your job is to decide the optimal page structure for a small business website based on business context, audience, offer, and conversion goal.

You are not trying to maximize page count.
You are trying to create the smallest high-performing website that:
- clearly explains the business
- builds trust fast
- supports the primary CTA
- reduces buyer hesitation
- matches the real needs of this business type

How to think:
- Think like a strategist, not a sitemap generator.
- Every page must earn its existence.
- If a goal can be handled well by a homepage section, do not create a separate page.
- Create separate pages only when they improve clarity, trust, SEO discoverability, or conversion flow.
- Favor simple, conversion-focused site structures for small businesses.
- The homepage should do the heaviest lifting and be the most comprehensive page.
- Use the business type, offer complexity, service area, and trust requirements to decide page count.

Decision rules:
- Always include a homepage with slug "home" and isHomepage: true.
- Include a contact page, unless the site is intentionally kept very small and the homepage already contains a strong contact section and CTA.
- Maximum 8 pages.
- Each page must have a unique lowercase hyphenated slug.
- Suggested sections must only use this list:
  hero, trust-bar, features, benefits, problem-solution, how-it-works, services, testimonials, results, pricing, faq, cta-band, contact, footer, gallery, service-area, about-team
- Every page must end with footer.
- Do not create redundant pages with slightly different wording.
- Do not create unsupported page categories.
- If trust is a major purchase driver, prioritize about, testimonials, results, faq, and service clarity.
- If location matters, include service-area where it helps conversion.
- If pricing clarity matters, include pricing.
- If the offer is unfamiliar or process-heavy, include how-it-works and/or problem-solution.
- If the service is visual, consider gallery.

Return JSON with this exact structure:
{
  "siteGoal": "string",
  "targetAudience": "string",
  "pages": [
    {
      "slug": "home",
      "title": "Page Title",
      "purpose": "What this page achieves",
      "pageType": "local-business|service-business|saas|coach|product-sales",
      "isHomepage": true,
      "suggestedSections": ["hero", "features", "testimonials", "cta-band", "footer"]
    }
  ]
}
"""


def site_planner_user_prompt(ctx: dict[str, Any], rag_guidance: str = "") -> str:
    return f"""Plan a multi-page website for this business:

Business Name: {ctx.get("businessName", "Unknown")}
Business Type: {ctx.get("businessType", "service-business")}
Description: {ctx.get("businessDescription", "")}
Target Audience: {ctx.get("targetAudience", "General audience")}
Primary CTA: {ctx.get("primaryCta", "Contact Us")}
Location: {ctx.get("location", "Not specified")}
Main Offer: {ctx.get("mainOffer", "Not specified")}
Differentiators: {", ".join(ctx.get("differentiators", [])) or "Not specified"}
Trust Drivers: {", ".join(ctx.get("trustDrivers", [])) or "Not specified"}
Customer Motivations: {", ".join(ctx.get("customerMotivations", [])) or "Not specified"}
Likely Objections: {", ".join(ctx.get("likelyObjections", [])) or "Not specified"}

Business Playbook Guidance:
{rag_guidance or "No business playbook RAG guidance available."}
"""


SHARED_SETTINGS_SYSTEM = """You are a brand system designer and visual direction strategist for small business websites.

Create cohesive site-wide settings for a small business website.

Rules:
- Return JSON only
- themeVariant must be one of: clean, bold, premium, playful
- designMode must be one of: soft-glass, editorial-luxe, warm-service, clinical-structured
- primaryColor, secondaryColor, accentColor must be valid hex colors
- footer links must use href
- keep actions lean and practical
- avoid random trendy choices that do not fit the business

Design mode guidance:
- soft-glass = rounded, layered, translucent, modern SaaS-like
- editorial-luxe = sharper typography, restrained surfaces, premium editorial feel
- warm-service = approachable, practical, warmer surfaces, clear utility
- clinical-structured = orderly, calm, minimal decoration, trust-first
"""


DESIGN_PLANNER_SYSTEM = """Design the homepage direction for this business before content planning begins.

Your task:
Define the homepage design direction in a way that will materially improve downstream section planning and rendering.

Focus on:
- above-the-fold strategy
- hero composition
- headline support structure
- CTA prominence
- early trust placement
- navigation behavior
- typography hierarchy
- color role strategy
- section pacing
- density vs whitespace balance
- scanability
- visual rhythm from top to bottom
- how the design should reduce hesitation and improve conversion

Important:
- Be specific and directive.
- Do not describe vague aesthetics.
- Do not just say “clean modern layout” or “use whitespace.”
- Make decisions that a renderer or frontend system could actually use.
- Tie your design direction to the business, audience, offer, and CTA.
- If the business is service-based, make sure the design direction supports trust, clarity, and action.
- If the audience is busy or comparison-shopping, prioritize quick comprehension and friction reduction.
- If objections are likely, reflect how design should handle them visually and structurally.
"""


DESIGN_REVIEW_SYSTEM = """Review this homepage design brief strictly before page planning starts.

Your job:
Decide whether this design brief is genuinely strong enough to guide a high-converting homepage.

Review it for:
- clarity of above-the-fold direction
- hero strength
- CTA support
- trust placement
- navigation usefulness
- typography usefulness
- color role clarity
- visual rhythm
- section pacing
- bounce-risk
- specificity
- practical usefulness for downstream planning and rendering

Strict evaluation rules:
- Fail it if it is generic, vague, or too aesthetic without enough conversion logic.
- Fail it if it sounds good but would still produce a bland homepage.
- Fail it if hero direction is weak or underdeveloped.
- Fail it if color or typography advice is not role-based.
- Fail it if section pacing is shallow or disconnected from the buyer journey.
- Fail it if it does not materially help the next system make better homepage decisions.

When reviewing, ask:
- Would this brief produce a homepage that feels clearer and more effective than a generic template?
- Does it actually reduce buyer hesitation?
- Does it give enough concrete direction for hierarchy, emphasis, and action?
- Is it tied to this business, audience, and offer?
- Is it specific enough to guide a renderer or page planner?
"""


KEYWORD_STRATEGY_SYSTEM = """You are a search-intent strategist for website content.

Your job is to create a practical keyword strategy after site planning and before page content is written.

Focus on:
- natural keyword clusters
- commercial intent
- trust and comparison language
- location relevance when applicable
- service-specific phrasing

Rules:
- Return JSON only
- Avoid spammy keyword stuffing
- Use real phrases a customer might search for
- Prioritize keywords that help sections become more specific and commercially useful
"""


SECTION_KEYWORD_SYSTEM = """You are a homepage section keyword planner.

Given a homepage section plan, assign 10 to 15 keywords or phrase targets per section.

Rules:
- Return JSON only
- Every section must get 10 to 15 keyword phrases
- Keywords should help a writer make the section specific, relevant, and commercially useful
- Keywords must match the section's role on the page
- Avoid repeated generic phrases across every section
"""


SECTION_CONTENT_SYSTEM = """You are a senior website content writer and section composer.

Your job is to write one homepage section with substantial, specific, usable content.

You must use:
- the business context
- the design brief
- the page plan
- the section keyword targets

Requirements:
- Return JSON only for one complete section object
- Keep the same section type and generally keep the same variant
- Make the content specific to the business, audience, offer, and location when relevant
- Write enough content so the section does not feel thin or token
- Use the provided keyword targets naturally, without stuffing
- Make the section commercially useful, readable, and visually fillable
- Respect the section's role in the page sequence
- For service/trust/proof sections, reduce hesitation and improve clarity

Minimum substance:
- hero: meaningful headline, subheading, CTA, supporting points, trust support
- features/services/benefits: enough real items to feel like a legitimate section
- testimonials: believable quotes with useful signal
- faq: real questions that reduce hesitation
- footer: complete and navigable
"""


def shared_settings_user_prompt(
    ctx: dict[str, Any],
    site_plan: dict[str, Any],
    rag_guidance: str = "",
    selected_design_mode: dict[str, Any] | None = None,
) -> str:
    pages = "\n".join(f'- {p["title"]} (/{p["slug"]})' for p in site_plan["pages"])
    selected_mode_text = json.dumps(selected_design_mode or {}, indent=2)
    return f"""Create shared site settings.

Business Name: {ctx.get("businessName", "Unknown")}
Business Type: {ctx.get("businessType", "service-business")}
Description: {ctx.get("businessDescription", "")}
Tone: {ctx.get("tone", "professional")}
Primary CTA: {ctx.get("primaryCta", "Contact Us")}
Location: {ctx.get("location", "")}
Visual Style Hints: {", ".join(ctx.get("visualStyleHints", [])) or "Not specified"}

Site Pages:
{pages}

Business Playbook Guidance:
{rag_guidance or "No business playbook RAG guidance available."}

Rule-Based Selected Design Mode:
{selected_mode_text}

When a selected design mode is provided:
- align your visual direction with it
- use its id exactly for designMode
- do not drift to a different design family without strong reason

Return JSON with:
{{
  "brand": {{
    "tone": "...",
    "primaryColor": "#hex",
    "secondaryColor": "#hex",
    "accentColor": "#hex",
    "fontHeading": "Font Name",
    "fontBody": "Font Name"
  }},
  "themeVariant": "clean|bold|premium|playful",
  "designMode": "soft-glass|editorial-luxe|warm-service|clinical-structured",
  "actions": [{{ "id": "action-primary", "label": "Contact Us", "type": "url", "value": "#contact", "style": "primary" }}],
  "header": {{ "siteName": "Business Name", "showNav": true }},
  "footer": {{
    "companyName": "Business Name",
    "tagline": "Short line",
    "columns": [{{ "title": "Quick Links", "links": [{{ "text": "Home", "href": "#home" }}] }}],
    "copyrightYear": "2026"
  }},
  "navigation": [{{ "label": "Home", "href": "#home" }}]
}}
"""


def design_planner_user_prompt(
    ctx: dict[str, Any],
    site_plan: dict[str, Any],
    shared_settings: dict[str, Any],
    rag_guidance: str = "",
    selected_design_mode: dict[str, Any] | None = None,
) -> str:
    selected_mode_text = json.dumps(selected_design_mode or {}, indent=2)
    return f"""Design the homepage direction for this business before content planning begins.

Business Context:
- Business Name: {ctx.get("businessName", "Unknown")}
- Business Type: {ctx.get("businessType", "service-business")}
- Description: {ctx.get("businessDescription", "")}
- Target Audience: {ctx.get("targetAudience", "General audience")}
- Primary CTA: {ctx.get("primaryCta", "Contact Us")}
- Main Offer: {ctx.get("mainOffer", "")}
- Location: {ctx.get("location", "")}
- Tone: {ctx.get("tone", "professional")}
- Differentiators: {", ".join(ctx.get("differentiators", [])) or "Not specified"}
- Trust Drivers: {", ".join(ctx.get("trustDrivers", [])) or "Not specified"}
- Customer Motivations: {", ".join(ctx.get("customerMotivations", [])) or "Not specified"}
- Likely Objections: {", ".join(ctx.get("likelyObjections", [])) or "Not specified"}
- Visual Style Hints: {", ".join(ctx.get("visualStyleHints", [])) or "Not specified"}

Site Plan:
{json.dumps(site_plan, indent=2)}

Business Playbook Guidance:
{rag_guidance or "No business playbook RAG guidance available."}

Rule-Based Selected Design Mode:
{selected_mode_text}

Use the selected design mode as a constraint for:
- visual character
- section pacing
- hero direction
- CTA behavior
- overall design density

Return JSON only in this exact structure:
{{
  "heroStrategy": {{
    "layout": "specific hero layout direction",
    "goal": "what the hero must achieve",
    "headlineStyle": "how the headline should feel",
    "supportingCopyStyle": "how the supporting copy should behave",
    "ctaStrategy": "how CTA should be positioned and emphasized",
    "trustSupport": "what trust signal should appear near the hero"
  }},
  "navigationStrategy": {{
    "style": "how navigation should feel and behave",
    "links": ["link 1", "link 2"],
    "ctaPlacement": "where the primary CTA should appear in nav",
    "notes": "how nav supports conversion"
  }},
  "visualSystem": {{
    "designIntent": "overall visual direction",
    "primaryColorRole": "how primary color should be used",
    "secondaryColorRole": "how secondary color should be used",
    "accentColorRole": "how accent color should be used",
    "contrastStrategy": "how emphasis and calm areas should be balanced",
    "surfaceStyle": "how cards/backgrounds/surfaces should feel"
  }},
  "typographyStrategy": {{
    "headingApproach": "how headings should feel",
    "bodyApproach": "how body text should feel",
    "hierarchyNotes": "how typography should guide scanning",
    "fontPairingDirection": "what kind of font pairing fits this business"
  }},
  "sectionFlowStrategy": {{
    "openingExperience": "what first two sections should accomplish together",
    "midPageRhythm": "how explanation/proof/benefits should be paced",
    "closingExperience": "how later sections should build confidence and action",
    "densityPattern": "how dense and light sections should alternate"
  }},
  "conversionStrategy": {{
    "primaryFrictionToReduce": "main hesitation to reduce",
    "howDesignSupportsTrust": "how design should visually support trust",
    "howDesignSupportsAction": "how design should support CTA clicks",
    "whatMustNotHappen": ["risk 1", "risk 2"]
  }},
  "implementationNotes": [
    "practical note 1",
    "practical note 2"
  ]
}}
"""


def design_review_user_prompt(design_brief: dict[str, Any], ctx: dict[str, Any], site_plan: dict[str, Any], rag_guidance: str = "") -> str:
    return f"""Review this homepage design brief strictly before page planning starts.

Business Context:
- Business Name: {ctx.get("businessName", "Unknown")}
- Business Type: {ctx.get("businessType", "service-business")}
- Description: {ctx.get("businessDescription", "")}
- Target Audience: {ctx.get("targetAudience", "General audience")}
- Primary CTA: {ctx.get("primaryCta", "Contact Us")}
- Main Offer: {ctx.get("mainOffer", "")}
- Location: {ctx.get("location", "")}
- Tone: {ctx.get("tone", "professional")}
- Differentiators: {", ".join(ctx.get("differentiators", [])) or "Not specified"}
- Trust Drivers: {", ".join(ctx.get("trustDrivers", [])) or "Not specified"}
- Customer Motivations: {", ".join(ctx.get("customerMotivations", [])) or "Not specified"}
- Likely Objections: {", ".join(ctx.get("likelyObjections", [])) or "Not specified"}
- Visual Style Hints: {", ".join(ctx.get("visualStyleHints", [])) or "Not specified"}

Site Plan:
{json.dumps(site_plan, indent=2)}

Business Playbook Guidance:
{rag_guidance or "No business playbook RAG guidance available."}

Proposed Design Brief:
{json.dumps(design_brief, indent=2)}

Return JSON only in this exact structure:
{{
  "pass": true,
  "score": 0,
  "summary": "short verdict",
  "issues": [
    {{
      "severity": "high|medium|low",
      "type": "conversion|hero|navigation|typography|color|layout|ux|specificity",
      "message": "what is wrong"
    }}
  ],
  "requiredFixes": [
    "fix 1",
    "fix 2"
  ],
  "strengths": [
    "real strength only"
  ]
}}
"""


def keyword_strategy_user_prompt(ctx: dict[str, Any], site_plan: dict[str, Any], rag_guidance: str = "") -> str:
    return f"""Create a keyword strategy for this website.

Business Context:
- Business Name: {ctx.get("businessName", "Unknown")}
- Business Type: {ctx.get("businessType", "service-business")}
- Description: {ctx.get("businessDescription", "")}
- Target Audience: {ctx.get("targetAudience", "General audience")}
- Primary CTA: {ctx.get("primaryCta", "Contact Us")}
- Main Offer: {ctx.get("mainOffer", "")}
- Location: {ctx.get("location", "")}
- Differentiators: {", ".join(ctx.get("differentiators", [])) or "Not specified"}
- Trust Drivers: {", ".join(ctx.get("trustDrivers", [])) or "Not specified"}
- Likely Objections: {", ".join(ctx.get("likelyObjections", [])) or "Not specified"}

Site Plan:
{json.dumps(site_plan, indent=2)}

Business Playbook Guidance:
{rag_guidance or "No business playbook RAG guidance available."}

Return JSON with:
{{
  "siteIntent": "...",
  "pageKeywordStrategy": [
    {{
      "slug": "home",
      "primaryIntent": "...",
      "coreKeywords": ["...", "..."],
      "trustKeywords": ["...", "..."],
      "supportingKeywords": ["...", "..."]
    }}
  ]
}}
"""


def section_keyword_user_prompt(
    page_plan: dict[str, Any],
    ctx: dict[str, Any],
    design_brief: dict[str, Any],
    keyword_strategy: dict[str, Any],
    rag_guidance: str = "",
) -> str:
    return f"""Assign section-level keyword targets for this homepage.

Business Context:
- Business Name: {ctx.get("businessName", "Unknown")}
- Business Type: {ctx.get("businessType", page_plan["pageType"])}
- Description: {ctx.get("businessDescription", "")}
- Target Audience: {ctx.get("targetAudience", "General audience")}
- Primary CTA: {ctx.get("primaryCta", "Contact Us")}
- Main Offer: {ctx.get("mainOffer", "")}
- Location: {ctx.get("location", "")}

Design Brief:
{json.dumps(design_brief, indent=2)}

Keyword Strategy:
{json.dumps(keyword_strategy, indent=2)}

Page Plan:
{json.dumps(page_plan, indent=2)}

Business Playbook Guidance:
{rag_guidance or "No business playbook RAG guidance available."}

Return JSON with:
{{
  "sections": [
    {{
      "type": "hero",
      "keywords": ["keyword 1", "keyword 2", "keyword 3"]
    }}
  ]
}}
"""


def section_content_user_prompt(
    section: dict[str, Any],
    page_plan: dict[str, Any],
    ctx: dict[str, Any],
    shared_settings: dict[str, Any],
    design_brief: dict[str, Any],
    section_keywords: list[str],
    rag_guidance: str = "",
    business_rag_guidance: str = "",
    selected_pattern: dict[str, Any] | None = None,
) -> str:
    selected_pattern_text = json.dumps(selected_pattern or {}, indent=2)
    return f"""Write one complete homepage section.

Business Context:
- Business Name: {ctx.get("businessName", "Unknown")}
- Business Type: {ctx.get("businessType", page_plan["pageType"])}
- Description: {ctx.get("businessDescription", "")}
- Target Audience: {ctx.get("targetAudience", "General audience")}
- Primary CTA: {ctx.get("primaryCta", "Contact Us")}
- Main Offer: {ctx.get("mainOffer", "")}
- Location: {ctx.get("location", "")}
- Differentiators: {", ".join(ctx.get("differentiators", [])) or "Not specified"}
- Trust Drivers: {", ".join(ctx.get("trustDrivers", [])) or "Not specified"}
- Likely Objections: {", ".join(ctx.get("likelyObjections", [])) or "Not specified"}

Design Brief:
{json.dumps(design_brief, indent=2)}

Shared Settings:
{json.dumps(shared_settings, indent=2)}

Page Plan:
{json.dumps(page_plan, indent=2)}

Current Section Skeleton:
{json.dumps(section, indent=2)}

Selected Section Pattern:
{selected_pattern_text}

Section Keyword Targets:
{json.dumps(section_keywords, indent=2)}

Variant Implementation Guidance:
{rag_guidance or "No RAG guidance available. Follow the variant and schema carefully using the section skeleton."}

Business Playbook Guidance:
{business_rag_guidance or "No business playbook RAG guidance available."}

Write enough content so the section feels substantial and genuinely useful.
Use the keywords naturally, not mechanically.
Respect the section type and variant exactly. Reuse the structure implied by the guidance, but keep the content specific to this business.
"""


PAGE_PLANNER_SYSTEM = """You are a senior homepage experience architect for modern small-business websites.

Your job is to plan a homepage that feels commercially sharp, visually dynamic, and conversion-oriented.

Rules:
- Return JSON only
- Start with hero and end with footer
- Pick the leanest section set that still feels complete, persuasive, and professionally designed
- Use only allowed section types
- Every section must include a variant
- Prefer 7 to 10 sections when the business benefits from trust-building and conversion support
- Vary the rhythm of the homepage: proof, explanation, objection-handling, CTA
"""


def page_planner_user_prompt(
    home_page: dict[str, Any],
    ctx: dict[str, Any],
    shared_settings: dict[str, Any],
    site_plan: dict[str, Any],
    design_brief: dict[str, Any],
    rag_guidance: str = "",
    selected_design_mode: dict[str, Any] | None = None,
) -> str:
    other_pages = "\n".join(
        f'- {p["title"]} (/{p["slug"]})'
        for p in site_plan["pages"]
        if p["slug"] != home_page["slug"]
    ) or "None"
    archetype = infer_homepage_archetype(ctx, home_page)
    recommended = json.dumps(default_homepage_sections(home_page, ctx), indent=2)
    selected_mode_text = json.dumps(selected_design_mode or {}, indent=2)
    return f"""Plan the homepage sections.

Page: {home_page["title"]} (/{home_page["slug"]})
Purpose: {home_page["purpose"]}
Page Type: {home_page["pageType"]}
Theme Variant: {shared_settings.get("themeVariant", "clean")}
Suggested Sections: {", ".join(home_page.get("suggestedSections", []))}

Business Name: {ctx.get("businessName", "Unknown")}
Business Type: {ctx.get("businessType", home_page["pageType"])}
Description: {ctx.get("businessDescription", "")}
Audience: {ctx.get("targetAudience", "General audience")}
Main Offer: {ctx.get("mainOffer", "")}
Location: {ctx.get("location", "")}
Differentiators: {", ".join(ctx.get("differentiators", [])) or "Not specified"}
Trust Drivers: {", ".join(ctx.get("trustDrivers", [])) or "Not specified"}
Customer Motivations: {", ".join(ctx.get("customerMotivations", [])) or "Not specified"}
Likely Objections: {", ".join(ctx.get("likelyObjections", [])) or "Not specified"}

Design Direction:
{json.dumps(design_brief, indent=2)}

Business Playbook Guidance:
{rag_guidance or "No business playbook RAG guidance available."}

Rule-Based Selected Design Mode:
{selected_mode_text}

Archetype: {archetype}

Planner rules:
- Do not default to `hero -> features/benefits -> testimonials -> cta-band -> footer` unless the business genuinely calls for it.
- Match the section mix to the business archetype, buying journey, and trust needs.
- Visual-first businesses should usually show proof of the output or atmosphere early.
- Local/mobile services should usually explain the process or service-area earlier than generic marketing sites.
- Trust-sensitive services should usually introduce problem/solution, results, or practitioner credibility before the close.
- Use distinct variants intentionally. If you pick `cards`, `image-cards`, `story`, `single-highlight`, `dual`, or `legal-heavy`, assume the renderer will make them look different.

Recommended starting direction:
{recommended}

Other pages:
{other_pages}

Return JSON with:
{{
  "slug": "{home_page["slug"]}",
  "title": "{home_page["title"]}",
  "pageType": "{home_page["pageType"]}",
  "sections": [
    {{ "type": "hero", "purpose": "Lead with offer and CTA", "variant": "centered" }}
  ]
}}
"""


PAGE_GENERATOR_SYSTEM = """You are an elite homepage designer, conversion copywriter, and structured UI content architect.

Role:
- You are proactive.
- You make strong design decisions based on the business context.
- Produce one complete homepage PageDocument.
- Return JSON only.

Rules:
- Use the exact planned section types and variants
- Do not use placeholder copy
- Avoid generic filler such as "we are the best" or "your trusted partner"
- Mention the actual service, audience, and location when possible
- Use schema-safe content keys
- The page should feel complete, premium, and intentionally sequenced
- Add layoutHint and motionHint where useful
- Use richer section content when appropriate: eyebrow, supportingPoints, trustChips, badge, ctaNote
"""


SECTION_REVIEW_SYSTEM = """You are a senior frontend quality reviewer and homepage section guardrail auditor.

Your job is to review a generated homepage section implementation and decide whether it is good enough to ship.

You are not a passive reviewer.
You are a strict quality gate.

Your review must evaluate both:
1. the section code / structure
2. the content quality inside the section

Your mission:
- catch thin, lazy, generic, repetitive, incomplete, or underdesigned sections
- enforce a minimum standard for clarity, completeness, persuasion, and visual usefulness
- prevent weak sections from being accepted just because they technically render

Operating standard:
- Be strict.
- Do not praise mediocre work.
- Treat placeholder-like output, vague copy, weak hierarchy, or skeletal structure as failures.
- A section is not acceptable just because it has a heading and a paragraph.
- A section must feel intentional, useful, and decently produced for a real website.

Review output format:
Return JSON only in this structure:
{
  "pass": true,
  "score": 0,
  "summary": "short verdict",
  "issues": [
    {
      "severity": "high|medium|low",
      "type": "content|structure|ux|schema|cta|redundancy",
      "message": "what is wrong",
      "field": "optional field path"
    }
  ],
  "requiredFixes": [
    "explicit fix 1",
    "explicit fix 2"
  ],
  "strengths": [
    "only include real strengths, not politeness"
  ]
}
"""


SECTION_REWRITE_SYSTEM = """You are an elite homepage section rewriter and structured content repair specialist.

Your job is to rewrite one homepage section so it becomes strong enough to ship.

Rules:
- Return JSON only for the rewritten section object
- Keep the same section type
- Keep the same variant unless a stronger section-specific shape is clearly needed
- Keep schema-safe content for the renderer
- Fix thin, generic, repetitive, weak, or placeholder-like content
- Make the section specific to the business, audience, offer, and page goal
- Ensure the section is commercially useful and visually substantial for its type
- Do not output explanations, only the corrected section JSON
"""


def page_generator_user_prompt(
    page_plan: dict[str, Any],
    ctx: dict[str, Any],
    shared_settings: dict[str, Any],
    design_brief: dict[str, Any],
    rag_guidance: str = "",
    selected_design_mode: dict[str, Any] | None = None,
) -> str:
    actions = "\n".join(
        f'- {a["id"]}: "{a["label"]}" ({a["type"]}: {a["value"]})'
        for a in shared_settings.get("actions", [])
    ) or "- action-primary: Contact Us (url: #contact)"
    selected_mode_text = json.dumps(selected_design_mode or {}, indent=2)
    return f"""Generate a homepage PageDocument.

Business:
- Name: {ctx.get("businessName", "Unknown")}
- Description: {ctx.get("businessDescription", "")}
- Type: {ctx.get("businessType", page_plan["pageType"])}
- Target Audience: {ctx.get("targetAudience", "General audience")}
- Main Offer: {ctx.get("mainOffer", "")}
- Location: {ctx.get("location", "")}
- Tone: {ctx.get("tone", "professional")}
- Differentiators: {", ".join(ctx.get("differentiators", [])) or "Not specified"}
- Trust Drivers: {", ".join(ctx.get("trustDrivers", [])) or "Not specified"}
- Customer Motivations: {", ".join(ctx.get("customerMotivations", [])) or "Not specified"}
- Likely Objections: {", ".join(ctx.get("likelyObjections", [])) or "Not specified"}

Brand:
- Primary: {shared_settings["brand"]["primaryColor"]}
- Secondary: {shared_settings["brand"]["secondaryColor"]}
- Accent: {shared_settings["brand"]["accentColor"]}
- Fonts: {shared_settings["brand"]["fontHeading"]} / {shared_settings["brand"]["fontBody"]}
- Theme Variant: {shared_settings.get("themeVariant", "clean")}

Design Brief:
{json.dumps(design_brief, indent=2)}

Business Playbook Guidance:
{rag_guidance or "No business playbook RAG guidance available."}

Rule-Based Selected Design Mode:
{selected_mode_text}

Available Actions:
{actions}

Page Plan:
{json.dumps(page_plan, indent=2)}

Return JSON with:
{{
  "meta": {{
    "title": "{page_plan["title"]}",
    "description": "SEO description",
    "pageType": "{page_plan["pageType"]}",
    "themeVariant": "{shared_settings.get("themeVariant", "clean")}",
    "slug": "{page_plan["slug"]}"
  }},
  "brand": {json.dumps(shared_settings["brand"])},
  "assets": [],
  "actions": [],
  "sections": [
    {{
      "id": "section-hero-001",
      "type": "hero",
      "variant": "centered",
      "visible": true,
      "order": 0,
      "layoutHint": "container > row > col-lg-7 content / col-lg-5 support",
      "motionHint": "fade-up stagger with soft reveal",
      "content": {{
        "eyebrow": "...",
        "heading": "...",
        "subheading": "...",
        "supportingPoints": ["...", "...", "..."],
        "trustChips": ["...", "...", "..."],
        "buttons": [{{ "text": "Contact Us", "actionId": "action-primary", "style": "primary" }}]
      }},
      "style": {{
        "backgroundColor": "{shared_settings["brand"]["primaryColor"]}",
        "textColor": "#ffffff",
        "padding": "80px 0",
        "surface": "soft-gradient",
        "emphasis": "high"
      }}
    }}
  ]
}}
"""


def section_review_user_prompt(
    section: dict[str, Any],
    page_plan: dict[str, Any],
    ctx: dict[str, Any],
    shared_settings: dict[str, Any],
    all_sections: list[dict[str, Any]],
) -> str:
    return f"""Review this homepage section strictly.

Business:
- Name: {ctx.get("businessName", "Unknown")}
- Description: {ctx.get("businessDescription", "")}
- Type: {ctx.get("businessType", page_plan["pageType"])}
- Audience: {ctx.get("targetAudience", "General audience")}
- Main Offer: {ctx.get("mainOffer", "")}
- Location: {ctx.get("location", "")}
- Differentiators: {", ".join(ctx.get("differentiators", [])) or "Not specified"}
- Trust Drivers: {", ".join(ctx.get("trustDrivers", [])) or "Not specified"}
- Likely Objections: {", ".join(ctx.get("likelyObjections", [])) or "Not specified"}

Theme Variant: {shared_settings.get("themeVariant", "clean")}
Page Title: {page_plan.get("title", "")}
Section Type: {section.get("type", "")}
Section Variant: {section.get("variant", "")}

Nearby section inventory:
{json.dumps([{"type": s.get("type"), "variant": s.get("variant")} for s in all_sections], indent=2)}

Section JSON:
{json.dumps(section, indent=2)}
"""


def section_rewrite_user_prompt(
    section: dict[str, Any],
    review: dict[str, Any],
    page_plan: dict[str, Any],
    ctx: dict[str, Any],
    shared_settings: dict[str, Any],
) -> str:
    return f"""Rewrite this homepage section so it passes a strict quality review.

Business:
- Name: {ctx.get("businessName", "Unknown")}
- Description: {ctx.get("businessDescription", "")}
- Type: {ctx.get("businessType", page_plan["pageType"])}
- Audience: {ctx.get("targetAudience", "General audience")}
- Main Offer: {ctx.get("mainOffer", "")}
- Location: {ctx.get("location", "")}
- Differentiators: {", ".join(ctx.get("differentiators", [])) or "Not specified"}
- Trust Drivers: {", ".join(ctx.get("trustDrivers", [])) or "Not specified"}
- Likely Objections: {", ".join(ctx.get("likelyObjections", [])) or "Not specified"}

Theme Variant: {shared_settings.get("themeVariant", "clean")}
Page Title: {page_plan.get("title", "")}

Original section:
{json.dumps(section, indent=2)}

Review feedback:
{json.dumps(review, indent=2)}
"""


def ensure_defaults(doc: dict[str, Any], page_plan: dict[str, Any], shared_settings: dict[str, Any], ctx: dict[str, Any]) -> dict[str, Any]:
    doc.setdefault("meta", {})
    doc["meta"].setdefault("title", page_plan["title"])
    doc["meta"].setdefault("description", "")
    doc["meta"].setdefault("pageType", page_plan["pageType"])
    doc["meta"].setdefault("themeVariant", shared_settings.get("themeVariant", "clean"))
    doc["meta"].setdefault("slug", page_plan["slug"])
    doc.setdefault("brand", shared_settings["brand"])
    doc.setdefault("assets", [])
    doc.setdefault("actions", [])
    doc.setdefault("sections", [])

    action_index = {a["id"]: a for a in shared_settings.get("actions", [])}
    for i, section in enumerate(doc["sections"]):
        section.setdefault("id", f"section-{section.get('type', 'section')}-{i+1}")
        section.setdefault("visible", True)
        section.setdefault("order", i)
        stype = section.get("type", "")
        section.setdefault("variant", SECTION_VARIANTS.get(stype, ["centered"])[0])
        section["content"] = normalize_section_content(stype, section.get("content"), ctx, action_index)
        section.setdefault("style", {})
        section.setdefault("layoutHint", "")
        section.setdefault("motionHint", "")
        section["style"].setdefault("backgroundColor", "#ffffff")
        section["style"].setdefault("textColor", "#111827")
        section["style"].setdefault("padding", "72px 0")
        section["style"].setdefault("surface", "solid")
        section["style"].setdefault("emphasis", "medium")
    return doc


def esc(value: Any) -> str:
    return (
        str(value or "")
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def resolve_action_href(action_id: str, actions: list[dict[str, Any]]) -> str:
    for action in actions:
        if action.get("id") == action_id:
            return str(action.get("value") or "#contact")
    return "#contact"


def render_buttons(buttons: list[Any], actions: list[dict[str, Any]]) -> str:
    clean = []
    for button in buttons[:2]:
        if not isinstance(button, dict):
            continue
        href = resolve_action_href(str(button.get("actionId") or "action-primary"), actions)
        style = "secondary" if str(button.get("style") or "primary") == "secondary" else "primary"
        clean.append(f'<a class="btn {style}" href="{esc(href)}">{esc(button.get("text", "Learn More"))}</a>')
    return "".join(clean)


def render_intro(content: dict[str, Any]) -> str:
    parts: list[str] = []
    if content.get("badge"):
        parts.append(f"<div class='badge'>{esc(content['badge'])}</div>")
    if content.get("eyebrow"):
        parts.append(f"<div class='eyebrow'>{esc(content['eyebrow'])}</div>")
    if content.get("heading"):
        parts.append(f"<h2>{esc(content['heading'])}</h2>")
    if content.get("subheading"):
        parts.append(f"<p class='lead'>{esc(content['subheading'])}</p>")
    return "".join(parts)


def render_supporting_points(points: list[Any]) -> str:
    clean_points = [p for p in points if p]
    if not clean_points:
        return ""
    return "<ul class='supporting-points'>" + "".join(
        f"<li>{esc(point)}</li>" for point in clean_points
    ) + "</ul>"


def render_trust_chips(chips: list[Any]) -> str:
    clean_chips = [c for c in chips if c]
    if not clean_chips:
        return ""
    return "<div class='chips'>" + "".join(
        f"<span class='chip'>{esc(chip)}</span>" for chip in clean_chips
    ) + "</div>"


def render_section(section: dict[str, Any], actions: list[dict[str, Any]], theme_variant: str) -> str:
    stype = section.get("type", "")
    content = section.get("content", {})
    style = section.get("style", {})
    bg = style.get("backgroundColor", "#ffffff")
    fg = style.get("textColor", "#111827")
    padding = style.get("padding", "72px 0")
    surface = style.get("surface", "solid")
    emphasis = style.get("emphasis", "medium")
    motion_hint = section.get("motionHint", "")
    layout_hint = section.get("layoutHint", "")

    section_open = (
        f'<section id="{section.get("id", "")}" class="section-block" '
        f'data-motion="{esc(motion_hint)}" data-layout="{esc(layout_hint)}" '
        f'data-surface="{esc(surface)}" data-emphasis="{esc(emphasis)}" '
        f'style="background:{bg};color:{fg};padding:{padding};"><div class="container">'
    )
    section_close = "</div></section>"

    if stype == "hero":
        buttons = render_buttons(content.get("buttons", []), actions)
        hero_eyebrow = f"<div class='eyebrow'>{esc(content.get('eyebrow', ''))}</div>" if content.get("eyebrow") else ""
        supporting = render_supporting_points(content.get("supportingPoints", []))
        chips = render_trust_chips(content.get("trustChips", []))
        hero_class = f"hero hero-{esc(section.get('variant', 'centered'))}"
        aside = ""
        if section.get("variant") in {"split-image", "background-image", "offer-focused"}:
            badge_html = f"<div class='badge mb-3'>{esc(content.get('badge'))}</div>" if content.get("badge") else ""
            aside = (
                "<div class='col-lg-5'>"
                "<div class='hero-panel card shadow-sm border-0 h-100'>"
                "<div class='card-body d-flex flex-column justify-content-center'>"
                f"{badge_html}"
                f"{chips}"
                "</div></div></div>"
            )
        return (
            section_open.replace('<div class="container">', f'<div class="container {hero_class}"><div class="row g-4 align-items-center"><div class="col-lg-7">')
            + hero_eyebrow
            + f"<h1>{esc(content.get('heading', ''))}</h1>"
            + f"<p class='lead'>{esc(content.get('subheading', ''))}</p>"
            + supporting
            + chips
            + f"<div class='actions d-flex flex-wrap gap-3'>{buttons}</div>"
            + (f"<p class='cta-note'>{esc(content.get('ctaNote', ''))}</p>" if content.get("ctaNote") else "")
            + "</div>"
            + aside
            + "</div>"
            + section_close
        )
    if stype == "trust-bar":
        items = "".join(f"<span class='trust-pill badge rounded-pill text-bg-light'>{esc(item)}</span>" for item in content.get("items", []))
        return section_open + f"<div class='trust-bar d-flex flex-wrap justify-content-center gap-2'>{items}</div>" + section_close
    if stype in {"features", "benefits", "services"}:
        items = "".join(
            (
                "<div class='col-md-6 col-xl-4'>"
                f"<article class='card h-100 shadow-sm border-0 {('alt-card' if section.get('variant') == 'alternating-rows' and idx % 2 else '')}'>"
                f"<div class='card-body'><h3>{esc(item.get('title', ''))}</h3><p class='mb-0'>{esc(item.get('description', ''))}</p></div>"
                "</article></div>"
            )
            for idx, item in enumerate(content.get("items", []))
        )
        return section_open + render_intro(content) + f"<div class='row g-4'>{items}</div>" + section_close
    if stype == "problem-solution":
        return (
            section_open
            + render_intro(content)
            + "<div class='row g-4'>"
            + f"<div class='col-lg-6'><article class='card h-100 shadow-sm border-0'><div class='card-body'><h3>The Problem</h3><p class='mb-0'>{esc(content.get('problem', ''))}</p></div></article></div>"
            + f"<div class='col-lg-6'><article class='card h-100 shadow-sm border-0'><div class='card-body'><h3>The Solution</h3><p class='mb-0'>{esc(content.get('solution', ''))}</p></div></article></div>"
            + "</div>"
            + section_close
        )
    if stype == "how-it-works":
        steps = "".join(
            (
                "<div class='col-md-6 col-xl-4'>"
                f"<div class='card h-100 shadow-sm border-0'><div class='card-body'><strong>{esc(step.get('step', ''))}. {esc(step.get('title', ''))}</strong><p class='mb-0 mt-2'>{esc(step.get('description', ''))}</p></div></div>"
                "</div>"
            )
            for step in content.get("steps", [])
        )
        return section_open + render_intro(content) + f"<div class='row g-4'>{steps}</div>" + section_close
    if stype == "testimonials":
        items = "".join(
            (
                "<div class='col-md-6 col-xl-4'>"
                f"<blockquote class='card h-100 shadow-sm border-0'><div class='card-body'><p class='mb-3'>“{esc(item.get('quote', ''))}”</p><footer class='fw-semibold'>{esc(item.get('author', ''))}</footer></div></blockquote>"
                "</div>"
            )
            for item in content.get("items", [])
        )
        return section_open + render_intro(content) + f"<div class='row g-4'>{items}</div>" + section_close
    if stype == "results":
        stats = "".join(
            (
                "<div class='col-6 col-lg-3'>"
                f"<div class='stat card shadow-sm border-0'><div class='card-body'><strong>{esc(item.get('value', ''))}</strong><span class='d-block mt-2'>{esc(item.get('label', ''))}</span></div></div>"
                "</div>"
            )
            for item in content.get("stats", [])
        )
        return section_open + render_intro(content) + f"<div class='row g-4'>{stats}</div>" + section_close
    if stype == "pricing":
        plans = "".join(
            (
                "<div class='col-md-6 col-xl-4'>"
                "<article class='card pricing-card h-100 shadow-sm border-0'>"
                f"<div class='card-body'><h3>{esc(plan.get('name', ''))}</h3><p class='price'>{esc(plan.get('price', ''))}</p><p>{esc(plan.get('description', ''))}</p><ul class='mb-0'>{''.join(f'<li>{esc(feature)}</li>' for feature in plan.get('features', []))}</ul></div>"
                "</article></div>"
            )
            for plan in content.get("plans", [])
        )
        return section_open + render_intro(content) + f"<div class='row g-4 pricing-grid'>{plans}</div>" + section_close
    if stype == "faq":
        accordion_id = f"accordion-{esc(section.get('id', 'faq'))}"
        items = "".join(
            (
                f"<div class='accordion-item border-0 mb-3 rounded-4 overflow-hidden shadow-sm'>"
                f"<h2 class='accordion-header'><button class='accordion-button collapsed' type='button' data-bs-toggle='collapse' data-bs-target='#{accordion_id}-{idx}'>{esc(item.get('question', ''))}</button></h2>"
                f"<div id='{accordion_id}-{idx}' class='accordion-collapse collapse' data-bs-parent='#{accordion_id}'><div class='accordion-body'>{esc(item.get('answer', ''))}</div></div>"
                "</div>"
            )
            for idx, item in enumerate(content.get("items", []))
        )
        return section_open + render_intro(content) + f"<div class='accordion' id='{accordion_id}'>{items}</div>" + section_close
    if stype == "contact":
        details = "".join(f"<li class='mb-2'>{esc(item)}</li>" for item in content.get("details", []))
        return section_open + render_intro(content) + f"<div id='contact' class='card shadow-sm border-0'><div class='card-body'><p>Contact us to get started.</p><ul class='mb-0'>{details}</ul></div></div>" + section_close
    if stype == "cta-band":
        buttons = render_buttons(content.get("buttons", []), actions)
        return section_open + render_intro(content) + f"<div class='actions d-flex flex-wrap gap-3'>{buttons}</div>" + section_close
    if stype == "gallery":
        items = "".join(
            (
                "<div class='col-md-6 col-xl-4'>"
                f"<article class='gallery-card card h-100 shadow-sm border-0'><div class='card-body'><div class='media-placeholder rounded-4 mb-3'>{esc(item.get('title', 'Work'))}</div><h3>{esc(item.get('title', ''))}</h3><p class='mb-0'>{esc(item.get('description', ''))}</p></div></article>"
                "</div>"
            )
            for item in content.get("items", [])
        )
        return section_open + render_intro(content) + f"<div class='row g-4 gallery-grid'>{items}</div>" + section_close
    if stype == "service-area":
        areas = "".join(f"<li class='list-group-item border-0 px-0 py-2'>{esc(area)}</li>" for area in content.get("areas", []))
        lead = "<p class='lead'>We serve these areas and nearby neighborhoods.</p>" if theme_variant in {"clean", "premium"} else ""
        return section_open + render_intro(content) + lead + f"<ul class='list-group list-group-flush'>{areas}</ul>" + section_close
    if stype == "about-team":
        items = "".join(
            (
                "<div class='col-md-6 col-xl-4'>"
                f"<article class='card h-100 shadow-sm border-0'><div class='card-body'><h3>{esc(item.get('title', ''))}</h3><p class='mb-0'>{esc(item.get('description', ''))}</p></div></article>"
                "</div>"
            )
            for item in content.get("items", [])
        )
        return section_open + render_intro(content) + f"<div class='row g-4'>{items}</div>" + section_close
    if stype == "footer":
        columns = "".join(
            "<div class='col-md-4'><h4>{}</h4>{}</div>".format(
                esc(col.get("title", "")),
                "".join(
                    f"<a class='d-block mb-2' href='{esc(link.get('href', '#'))}'>{esc(link.get('text', ''))}</a>"
                    for link in col.get("links", [])
                ),
            )
            for col in content.get("columns", [])
        )
        company = esc(content.get("companyName", ""))
        tagline = esc(content.get("tagline", ""))
        year = esc(content.get("copyrightYear", ""))
        return section_open + f"<div class='row footer'><div class='col-md-4'><h3>{company}</h3><p>{tagline}</p></div>{columns}<p class='copyright'>&copy; {year} {company}</p></div>" + section_close

    return section_open + render_intro(content) + render_supporting_points(content.get("supportingPoints", [])) + section_close


def render_page(doc: dict[str, Any], shared_settings: dict[str, Any], site_plan: dict[str, Any]) -> str:
    navigation = shared_settings.get("navigation") or [
        {"label": p["title"], "href": f"#{p['slug']}"} for p in site_plan.get("pages", [])
    ]
    nav_items = "".join(
        f"<a href='{esc(item.get('href', '#'))}'>{esc(item.get('label', ''))}</a>"
        for item in navigation
    )
    theme_variant = shared_settings.get("themeVariant", "clean")
    body = "\n".join(render_section(section, shared_settings.get("actions", []), theme_variant) for section in doc.get("sections", []))
    brand = shared_settings["brand"]
    site_name = shared_settings.get("header", {}).get("siteName", doc["meta"]["title"])
    body_font = "system-ui, sans-serif"
    heading_font = "Georgia, serif"
    if theme_variant == "bold":
        heading_font = "'Arial Black', system-ui, sans-serif"
    elif theme_variant == "playful":
        heading_font = "'Trebuchet MS', system-ui, sans-serif"
        body_font = "'Verdana', system-ui, sans-serif"
    elif theme_variant == "premium":
        heading_font = "Georgia, 'Times New Roman', serif"
        body_font = "'Helvetica Neue', Arial, sans-serif"
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{doc["meta"]["title"]}</title>
  <meta name="description" content="{doc["meta"]["description"]}" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <style>
    :root {{
      --primary: {brand["primaryColor"]};
      --secondary: {brand["secondaryColor"]};
      --accent: {brand["accentColor"]};
      --text: #111827;
      --bg: #ffffff;
    }}
    * {{ box-sizing: border-box; }}
    body {{ margin: 0; font-family: {body_font}; color: var(--text); background: var(--bg); }}
    .container {{ width: min(1120px, calc(100% - 40px)); margin: 0 auto; }}
    header {{ position: sticky; top: 0; background: rgba(255,255,255,0.94); backdrop-filter: blur(10px); border-bottom: 1px solid #e5e7eb; }}
    header .inner {{ display: flex; justify-content: space-between; align-items: center; padding: 18px 0; gap: 24px; }}
    nav {{ display: flex; flex-wrap: wrap; gap: 18px; }}
    nav a, .footer a {{ text-decoration: none; color: inherit; }}
    h1, h2, h3, h4, strong {{ font-family: {heading_font}; }}
    .eyebrow {{ text-transform: uppercase; letter-spacing: 0.14em; font-size: 0.8rem; font-weight: 700; opacity: 0.72; margin-bottom: 14px; }}
    .badge {{ display: inline-block; padding: 8px 12px; border-radius: 999px; background: rgba(17,24,39,0.08); margin-bottom: 14px; font-size: 0.82rem; font-weight: 700; }}
    h1 {{ font-size: clamp(2.7rem, 6vw, 5rem); line-height: 1.02; margin: 0 0 20px; }}
    h2 {{ font-size: clamp(2rem, 4vw, 3rem); margin: 0 0 18px; }}
    h3 {{ margin: 0 0 10px; }}
    .lead {{ font-size: 1.2rem; max-width: 760px; }}
    .card {{ background: rgba(255,255,255,0.72); border-radius: 18px; border: 1px solid rgba(17,24,39,0.08); }}
    .card-body {{ padding: 22px; }}
    .actions {{ margin-top: 22px; }}
    .btn {{ display: inline-block; padding: 14px 20px; border-radius: 999px; font-weight: 700; text-decoration: none; }}
    .btn.primary {{ background: var(--accent); color: #111827; }}
    .btn.secondary {{ background: rgba(17,24,39,0.08); color: inherit; }}
    .stat {{ background: rgba(255,255,255,0.14); border-radius: 16px; }}
    .chips {{ display: flex; flex-wrap: wrap; gap: 10px; margin: 16px 0; }}
    .chip {{ padding: 8px 12px; border-radius: 999px; background: rgba(255,255,255,0.16); font-size: 0.9rem; }}
    .supporting-points {{ display: grid; gap: 10px; margin: 18px 0; padding-left: 18px; }}
    .cta-note {{ opacity: 0.8; margin-top: 14px; }}
    .copyright {{ grid-column: 1 / -1; opacity: 0.72; margin-top: 24px; }}
    .trust-bar {{ display: flex; flex-wrap: wrap; gap: 12px; }}
    .pricing-grid .price {{ font-size: 1.8rem; font-weight: 700; margin: 10px 0; }}
    .gallery-card .media-placeholder {{ aspect-ratio: 4/3; display: grid; place-items: center; border-radius: 16px; margin-bottom: 14px; background: linear-gradient(135deg, var(--secondary), rgba(255,255,255,0.6)); }}
    .hero-panel {{ min-height: 100%; }}
    .hero-offer-focused .badge {{ background: var(--accent); color: #111827; }}
    .hero-background-image {{ border-radius: 28px; background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)); padding: 24px; }}
    .alt-card {{ transform: translateY(22px); }}
    [data-surface="soft-gradient"] {{ background-image: linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.02)); }}
    [data-emphasis="high"] h2, [data-emphasis="high"] h1 {{ letter-spacing: -0.03em; }}
    @media (max-width: 768px) {{
      header .inner {{ flex-direction: column; align-items: flex-start; }}
      .alt-card {{ transform: none; }}
    }}
  </style>
</head>
<body>
  <header>
    <div class="container inner">
      <strong>{site_name}</strong>
      <nav>{nav_items}</nav>
    </div>
  </header>
  <main>{body}</main>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>"""


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate one homepage HTML file from a business description.")
    parser.add_argument("--name", required=True, help="Business name")
    parser.add_argument("--description", required=True, help="Business description")
    parser.add_argument("--location", default="", help="Optional location")
    parser.add_argument("--audience", default="", help="Optional target audience hint")
    parser.add_argument("--output", required=True, help="Output HTML path")
    parser.add_argument("--rag-dir", default=DEFAULT_RAG_DIR, help="Optional ChromaDB directory for Tailwind variant guidance.")
    parser.add_argument("--business-rag-dir", default=DEFAULT_BUSINESS_RAG_DIR, help="Optional ChromaDB directory for business playbook guidance.")
    args = parser.parse_args()

    api_key = load_env_var("OPENAI_API_KEY")
    if not api_key:
      print("OPENAI_API_KEY not found in environment, .env.local, or .env", file=sys.stderr)
      return 1

    inputs = Inputs(
        name=args.name.strip(),
        description=args.description.strip(),
        location=args.location.strip(),
        audience=args.audience.strip(),
        output=Path(args.output),
    )

    inputs.output.parent.mkdir(parents=True, exist_ok=True)
    prompt_log: list[dict[str, Any]] = []
    rag_dir = args.rag_dir.strip() or DEFAULT_RAG_DIR
    business_rag_dir = args.business_rag_dir.strip() or DEFAULT_BUSINESS_RAG_DIR

    print("1/5 Inferring business context...")
    business_context = phase_chat_json(
        api_key,
        "infer_context",
        INFER_CONTEXT_SYSTEM,
        infer_context_user_prompt(inputs),
        validate_inferred_context,
        temperature=0.4,
        max_tokens=1200,
        prompt_log=prompt_log,
    )
    site_planning_guidance = get_business_guidance(
        " | ".join(
            [
                inputs.name,
                business_context.get("businessType", ""),
                business_context.get("mainOffer", ""),
                business_context.get("location", ""),
                business_context.get("businessDescription", ""),
                "architecture homepage design homepage ideation audience objections conversion",
            ]
        ),
        business_rag_dir,
    )

    print("2/5 Planning site...")
    site_plan = phase_chat_json(
        api_key,
        "site_plan",
        SITE_PLANNER_SYSTEM,
        site_planner_user_prompt(business_context, site_planning_guidance),
        validate_site_plan,
        temperature=0.6,
        max_tokens=1800,
        prompt_log=prompt_log,
    )

    print("2.5/5 Building keyword strategy...")
    keyword_strategy = phase_chat_json(
        api_key,
        "keyword_strategy",
        KEYWORD_STRATEGY_SYSTEM,
        keyword_strategy_user_prompt(
            business_context,
            site_plan,
            get_business_guidance(
                " | ".join(
                    [
                        business_context.get("businessType", ""),
                        business_context.get("mainOffer", ""),
                        "keyword strategy audience objections search intent services FAQ trust",
                    ]
                ),
                business_rag_dir,
            ),
        ),
        lambda raw: validate_keyword_strategy(raw, site_plan),
        temperature=0.35,
        max_tokens=1800,
        prompt_log=prompt_log,
    )

    print("3/5 Generating shared settings...")
    shared_settings = phase_chat_json(
        api_key,
        "shared_settings",
        SHARED_SETTINGS_SYSTEM,
        shared_settings_user_prompt(
            business_context,
            site_plan,
            get_business_guidance(
                " | ".join(
                    [
                        business_context.get("businessType", ""),
                        business_context.get("mainOffer", ""),
                        "homepage design color typography navigation visual character",
                    ]
                ),
                business_rag_dir,
            ),
        ),
        lambda raw: validate_shared_settings(raw, site_plan, business_context),
        temperature=0.5,
        max_tokens=1800,
        prompt_log=prompt_log,
    )

    print("3.5/5 Designing homepage direction...")
    design_brief = phase_chat_json(
        api_key,
        "design_brief",
        DESIGN_PLANNER_SYSTEM,
        design_planner_user_prompt(
            business_context,
            site_plan,
            shared_settings,
            get_business_guidance(
                " | ".join(
                    [
                        business_context.get("businessType", ""),
                        business_context.get("mainOffer", ""),
                        business_context.get("targetAudience", ""),
                        "homepage ideation design direction hero CTA trust bounce conversion",
                    ]
                ),
                business_rag_dir,
            ),
        ),
        lambda raw: validate_design_brief(raw, business_context, shared_settings),
        temperature=0.45,
        max_tokens=2000,
        prompt_log=prompt_log,
    )
    design_brief = review_and_improve_design_brief(
        api_key,
        design_brief,
        business_context,
        site_plan,
        shared_settings,
        prompt_log,
        get_business_guidance(
            " | ".join(
                [
                    business_context.get("businessType", ""),
                    business_context.get("mainOffer", ""),
                    "homepage ideation design direction review hero CTA trust",
                ]
            ),
            business_rag_dir,
        ),
    )

    home_page = next((page for page in site_plan.get("pages", []) if page.get("isHomepage")), None)
    if not home_page:
        raise RuntimeError("Site planner did not return a homepage")

    print("4/5 Planning homepage...")
    page_plan = phase_chat_json(
        api_key,
        "page_plan",
        PAGE_PLANNER_SYSTEM,
        page_planner_user_prompt(
            home_page,
            business_context,
            shared_settings,
            site_plan,
            design_brief,
            get_business_guidance(
                " | ".join(
                    [
                        business_context.get("businessType", ""),
                        business_context.get("mainOffer", ""),
                        "site architecture homepage sections section order objections trust conversion",
                    ]
                ),
                business_rag_dir,
            ),
        ),
        lambda raw: validate_page_plan(raw, home_page, business_context),
        temperature=0.6,
        max_tokens=1600,
        prompt_log=prompt_log,
    )
    page_plan = enforce_design_on_page_plan(page_plan, design_brief)

    print("4.5/5 Assigning section keywords...")
    section_keyword_plan = phase_chat_json(
        api_key,
        "section_keyword_plan",
        SECTION_KEYWORD_SYSTEM,
        section_keyword_user_prompt(
            page_plan,
            business_context,
            design_brief,
            keyword_strategy,
            get_business_guidance(
                " | ".join(
                    [
                        business_context.get("businessType", ""),
                        business_context.get("mainOffer", ""),
                        "homepage section keywords audience objections trust proof FAQ CTA",
                    ]
                ),
                business_rag_dir,
            ),
        ),
        lambda raw: validate_section_keyword_plan(raw, page_plan),
        temperature=0.3,
        max_tokens=2200,
        prompt_log=prompt_log,
    )

    print("5/5 Generating homepage document...")
    page_doc = phase_chat_json(
        api_key,
        "page_document",
        PAGE_GENERATOR_SYSTEM,
        page_generator_user_prompt(
            page_plan,
            business_context,
            shared_settings,
            design_brief,
            get_business_guidance(
                " | ".join(
                    [
                        business_context.get("businessType", ""),
                        business_context.get("mainOffer", ""),
                        business_context.get("targetAudience", ""),
                        "homepage copy structure benefits objections proof CTA FAQ service clarity",
                    ]
                ),
                business_rag_dir,
            ),
        ),
        lambda raw: validate_page_document(raw, page_plan, shared_settings, business_context),
        temperature=0.7,
        max_tokens=3200,
        prompt_log=prompt_log,
    )
    page_doc = write_sections_with_keywords(
        api_key,
        page_doc,
        page_plan,
        shared_settings,
        business_context,
        design_brief,
        section_keyword_plan,
        prompt_log,
        rag_dir,
        get_business_guidance(
            " | ".join(
                [
                    business_context.get("businessType", ""),
                    business_context.get("mainOffer", ""),
                    business_context.get("targetAudience", ""),
                    "section content writing homepage conversion trust objections clarity",
                ]
            ),
            business_rag_dir,
        ),
    )
    page_doc = review_and_regenerate_sections(
        api_key,
        page_doc,
        page_plan,
        shared_settings,
        business_context,
        prompt_log,
    )
    page_doc = ensure_defaults(page_doc, page_plan, shared_settings, business_context)

    html = render_page(page_doc, shared_settings, site_plan)
    inputs.output.write_text(html, encoding="utf-8")

    trace_path = inputs.output.with_suffix(".trace.json")
    prompt_log_path = inputs.output.with_suffix(".prompts.json")
    trace_path.write_text(
        json.dumps(
            {
                "model": MODEL,
                "business_context": business_context,
                "site_plan": site_plan,
                "keyword_strategy": keyword_strategy,
                "shared_settings": shared_settings,
                "design_brief": design_brief,
                "page_plan": page_plan,
                "section_keyword_plan": section_keyword_plan,
                "rag_dir": rag_dir,
                "business_rag_dir": business_rag_dir,
                "page_document": page_doc,
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    prompt_log_path.write_text(json.dumps(prompt_log, indent=2), encoding="utf-8")

    print(textwrap.dedent(f"""
    Done.
    HTML:  {inputs.output}
    Trace: {trace_path}
    Prompts: {prompt_log_path}
    """).strip())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
