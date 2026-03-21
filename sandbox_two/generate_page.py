#!/usr/bin/env python3
"""
Full single-page generator with class-based renderers and 10 design combos.

Usage:
    python3 generate_page.py \
        --name "PawPals Mobile Grooming" \
        --description "At-home pet grooming for dogs and cats in South Delhi" \
        --output output/page.html
"""

from __future__ import annotations

import argparse
import json
import mimetypes
import os
import re
import ssl
import time
import urllib.request
from pathlib import Path
from typing import Any

import urllib.parse

from renderers import RENDERER_CLASSES, esc

MODEL = "gpt-4o-mini"
PIXABAY_ENDPOINT = "https://pixabay.com/api/"

# ---------------------------------------------------------------------------
# Utilities
# ---------------------------------------------------------------------------

def load_env_var(key: str) -> str | None:
    if os.environ.get(key):
        return os.environ[key]
    for env_name in (".env.local", ".env"):
        for search_dir in [Path.cwd(), Path(__file__).resolve().parent, Path(__file__).resolve().parent.parent]:
            env_path = search_dir / env_name
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


def build_ssl_context() -> ssl.SSLContext:
    return ssl.create_default_context()


def parse_json(text: str) -> Any:
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r"```(?:json)?\s*([\s\S]*?)```", text)
        if match:
            return json.loads(match.group(1).strip())
        raise


def chat_json(api_key: str, system_prompt: str, user_prompt: str, temperature: float = 0.5, max_tokens: int = 2000) -> Any:
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
    ctx = build_ssl_context()
    try:
        with urllib.request.urlopen(req, timeout=120, context=ctx) as resp:
            payload = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="ignore")
        raise RuntimeError(f"OpenAI API error {exc.code}: {detail}") from exc
    return parse_json(payload["choices"][0]["message"]["content"])


# ---------------------------------------------------------------------------
# Pixabay image search
# ---------------------------------------------------------------------------

def fetch_pixabay_candidates(
    api_key: str,
    query: str,
    orientation: str = "horizontal",
    per_page: int = 10,
    min_width: int = 1280,
) -> list[str]:
    """Search Pixabay and return a list of candidate image URLs."""
    params = urllib.parse.urlencode({
        "key": api_key,
        "q": query[:100],
        "image_type": "photo",
        "orientation": orientation,
        "per_page": per_page,
        "min_width": min_width,
        "safesearch": "true",
    })
    url = f"{PIXABAY_ENDPOINT}?{params}"
    try:
        ctx = build_ssl_context()
        with urllib.request.urlopen(url, timeout=15, context=ctx) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        hits = data.get("hits", [])
        return [
            h.get("largeImageURL") or h.get("webformatURL")
            for h in hits
            if h.get("largeImageURL") or h.get("webformatURL")
        ]
    except Exception as exc:
        print(f"   [pixabay] Warning: {exc}")
    return []


def validate_image_with_vision(
    openai_key: str,
    image_url: str,
    business_name: str,
    business_type: str,
    usage_context: str,
) -> bool:
    """Use GPT-4o-mini vision to check if an image is appropriate for the business."""
    body = {
        "model": "gpt-4o-mini",
        "max_tokens": 80,
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are an image reviewer for a website builder. "
                    "Decide if the image is suitable for the described business and context. "
                    "Reply with ONLY 'yes' or 'no'."
                ),
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": (
                            f"Business: {business_name} ({business_type})\n"
                            f"Image will be used as: {usage_context}\n"
                            "Is this image appropriate and relevant for this business website?"
                        ),
                    },
                    {
                        "type": "image_url",
                        "image_url": {"url": image_url, "detail": "low"},
                    },
                ],
            },
        ],
    }
    req = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=json.dumps(body).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {openai_key}",
        },
        method="POST",
    )
    try:
        ctx = build_ssl_context()
        with urllib.request.urlopen(req, timeout=30, context=ctx) as resp:
            result = json.loads(resp.read().decode("utf-8"))
        answer = result["choices"][0]["message"]["content"].strip().lower()
        return answer.startswith("yes")
    except Exception as exc:
        print(f"   [vision] Warning: validation failed ({exc}), accepting image")
        return True  # Accept on error to avoid blocking


def pick_best_image(
    openai_key: str,
    pixabay_key: str,
    query: str,
    business_name: str,
    business_type: str,
    usage_context: str,
    min_width: int = 1280,
) -> str | None:
    """Search Pixabay, validate candidates with vision, return first approved URL."""
    candidates = fetch_pixabay_candidates(pixabay_key, query, min_width=min_width)
    if not candidates:
        return None
    for i, url in enumerate(candidates[:5]):  # Check up to 5 candidates
        print(f"   [vision] Validating candidate {i + 1} for {usage_context}...")
        if validate_image_with_vision(openai_key, url, business_name, business_type, usage_context):
            print(f"   [vision] ✓ Approved candidate {i + 1}")
            return url
        print(f"   [vision] ✗ Rejected candidate {i + 1}")
    # Fallback to first candidate if none pass
    print(f"   [vision] No candidate approved, using first result as fallback")
    return candidates[0]


def fetch_section_images(
    pixabay_key: str,
    openai_key: str,
    business_name: str,
    business_type: str,
    description: str,
    gallery_queries: list[str] | None = None,
) -> dict[str, str]:
    """Fetch hero + about images from Pixabay, validated by GPT-4o-mini vision.

    Pass *gallery_queries* (list of search terms) to fetch gallery images.
    """
    images: dict[str, str] = {}

    # Hero image — search by business type + core activity
    hero_query = f"{business_type} {description.split(',')[0].strip()}"
    hero_url = pick_best_image(
        openai_key, pixabay_key, hero_query,
        business_name, business_type, "hero banner image",
    )
    if hero_url:
        images["heroImageUrl"] = hero_url
        print(f"   [pixabay] Hero image: {hero_url[:80]}...")
    time.sleep(1)

    # About image — broader search
    about_query = f"{business_type} professional"
    about_url = pick_best_image(
        openai_key, pixabay_key, about_query,
        business_name, business_type, "about section image",
    )
    if about_url:
        images["aboutImageUrl"] = about_url
        print(f"   [pixabay] About image: {about_url[:80]}...")
    time.sleep(1)

    # Fullbleed image — cinematic/atmospheric
    fullbleed_query = f"{business_type} background"
    fullbleed_url = pick_best_image(
        openai_key, pixabay_key, fullbleed_query,
        business_name, business_type, "fullbleed cinematic background",
        min_width=1920,
    )
    if fullbleed_url:
        images["fullbleedImageUrl"] = fullbleed_url
        print(f"   [pixabay] Fullbleed image: {fullbleed_url[:80]}...")

    # Gallery images — diverse set for showcasing facility/space
    if gallery_queries:
        used_urls: set[str] = set(images.values())
        for i, gq in enumerate(gallery_queries[:6]):
            time.sleep(1)
            candidates = fetch_pixabay_candidates(pixabay_key, gq, per_page=10)
            for url in candidates:
                if url in used_urls:
                    continue
                print(f"   [vision] Validating gallery image {i + 1} ({gq})...")
                if validate_image_with_vision(
                    openai_key, url, business_name, business_type,
                    f"gallery photo: {gq}",
                ):
                    images[f"galleryImage{i + 1}"] = url
                    used_urls.add(url)
                    print(f"   [pixabay] Gallery {i + 1}: {url[:80]}...")
                    break
            else:
                # Fallback: use first non-duplicate candidate
                for url in candidates:
                    if url not in used_urls:
                        images[f"galleryImage{i + 1}"] = url
                        used_urls.add(url)
                        print(f"   [pixabay] Gallery {i + 1} (fallback): {url[:80]}...")
                        break

    return images


def _download_image(url: str, dest: Path) -> bool:
    """Download an image from *url* and save it to *dest*. Retries on 429 with backoff."""
    delays = [2, 4, 8, 16]
    for attempt in range(len(delays) + 1):
        try:
            ctx = build_ssl_context()
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=30, context=ctx) as resp:
                content_type = resp.headers.get("Content-Type", "")
                raw = resp.read()
            ext = mimetypes.guess_extension(content_type.split(";")[0].strip()) if content_type else None
            if ext and dest.suffix != ext:
                dest = dest.with_suffix(ext)
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(raw)
            return True
        except urllib.error.HTTPError as exc:
            if exc.code == 429 and attempt < len(delays):
                wait = delays[attempt]
                print(f"   [download] Rate limited, retrying in {wait}s...")
                time.sleep(wait)
                continue
            print(f"   [download] Warning: could not download {url[:80]}: {exc}")
            return False
        except Exception as exc:
            print(f"   [download] Warning: could not download {url[:80]}: {exc}")
            return False


# Map content keys to simple filenames
_IMAGE_FILENAMES = {
    "heroImageUrl": "hero",
    "aboutImageUrl": "about",
    "fullbleedImageUrl": "fullbleed",
    "galleryImage1": "gallery1",
    "galleryImage2": "gallery2",
    "galleryImage3": "gallery3",
    "galleryImage4": "gallery4",
    "galleryImage5": "gallery5",
    "galleryImage6": "gallery6",
}


def download_images(images: dict[str, str], images_dir: Path) -> dict[str, str]:
    """Download remote images into *images_dir* and return dict with local relative paths."""
    local: dict[str, str] = {}
    images_dir.mkdir(parents=True, exist_ok=True)
    items = list(images.items())
    for idx, (key, url) in enumerate(items):
        if idx > 0:
            time.sleep(1)  # Pace downloads to avoid Pixabay 429s
        base_name = _IMAGE_FILENAMES.get(key, key)
        # Guess extension from URL, default to .jpg
        guessed_ext = mimetypes.guess_extension(
            mimetypes.guess_type(url.split("?")[0])[0] or "image/jpeg"
        ) or ".jpg"
        dest = images_dir / f"{base_name}{guessed_ext}"
        print(f"   [download] {key} -> {dest} ...")
        if _download_image(url, dest):
            # Store path relative to the HTML file's parent (images/hero.jpg)
            local[key] = f"images/{dest.name}"
            print(f"   [download] {key}: saved ({dest.stat().st_size // 1024} KB)")
        else:
            # Keep original remote URL as fallback
            local[key] = url
            print(f"   [download] {key}: keeping remote URL (download failed)")
    return local


# ---------------------------------------------------------------------------
# Pattern combos — which sections + which archetype + which style family
# ---------------------------------------------------------------------------

PATTERN_COMBOS = {
    "concierge_split": {
        "id": "concierge_split",
        "label": "Concierge Split",
        "family": "concierge",
        "best_for": ["pet care", "home services", "beauty", "grooming", "cleaning", "plumbing", "electrician", "handyman", "mobile service", "at-home"],
        "sections": [
            {"archetype": "split_two_col", "variant": "hero", "id": "home"},
            {"archetype": "stat_row", "id": "results"},
            {"archetype": "card_grid", "variant": "services", "id": "services"},
            {"archetype": "step_sequence", "id": "how-it-works"},
            {"archetype": "quote_block", "id": "testimonial"},
            {"archetype": "quote_grid", "id": "reviews"},
            {"archetype": "accordion", "id": "faq"},
            {"archetype": "list_strip", "id": "areas"},
            {"archetype": "centered_stack", "variant": "cta_band", "id": "cta"},
            {"archetype": "form_panel", "id": "contact"},
            {"archetype": "footer_columns"},
        ],
    },
    "direct_conversion": {
        "id": "direct_conversion",
        "label": "Direct Conversion",
        "family": "direct",
        "best_for": ["visa", "immigration", "travel agent", "repair", "admissions", "consultant", "lead gen", "insurance", "loan", "real estate"],
        "sections": [
            {"archetype": "centered_stack", "variant": "hero", "id": "home"},
            {"archetype": "card_grid", "variant": "services", "id": "services"},
            {"archetype": "step_sequence", "id": "how-it-works"},
            {"archetype": "stat_row", "id": "results"},
            {"archetype": "quote_grid", "id": "reviews"},
            {"archetype": "accordion", "id": "faq"},
            {"archetype": "centered_stack", "variant": "cta_band", "id": "cta"},
            {"archetype": "form_panel", "id": "contact"},
            {"archetype": "footer_columns"},
        ],
    },
    "product_led_b2b": {
        "id": "product_led_b2b",
        "label": "Product-Led B2B",
        "family": "saas",
        "best_for": ["saas", "software", "ai tool", "dashboard", "workflow", "automation", "crm", "b2b", "platform", "app"],
        "sections": [
            {"archetype": "split_two_col", "variant": "hero", "id": "home"},
            {"archetype": "stat_row", "id": "results"},
            {"archetype": "card_grid", "variant": "features", "id": "features"},
            {"archetype": "step_sequence", "id": "how-it-works"},
            {"archetype": "card_grid", "variant": "pricing", "id": "pricing"},
            {"archetype": "quote_block", "id": "testimonial"},
            {"archetype": "accordion", "id": "faq"},
            {"archetype": "centered_stack", "variant": "cta_band", "id": "cta"},
            {"archetype": "form_panel", "id": "contact"},
            {"archetype": "footer_columns"},
        ],
    },
    "editorial_luxury": {
        "id": "editorial_luxury",
        "label": "Editorial Luxury",
        "family": "editorial",
        "best_for": ["interior design", "luxury", "architect", "boutique", "high-end beauty", "luxury travel", "fashion", "premium", "bespoke"],
        "sections": [
            {"archetype": "fullbleed_media", "id": "home"},
            {"archetype": "split_two_col", "variant": "about", "id": "about"},
            {"archetype": "card_grid", "variant": "services", "id": "services"},
            {"archetype": "quote_block", "id": "testimonial"},
            {"archetype": "card_grid", "variant": "team", "id": "team"},
            {"archetype": "accordion", "id": "faq"},
            {"archetype": "form_panel", "id": "contact"},
            {"archetype": "footer_columns"},
        ],
    },
    "trust_panel_clinic": {
        "id": "trust_panel_clinic",
        "label": "Trust Panel Clinic",
        "family": "clinic",
        "best_for": ["clinic", "physiotherapy", "dentist", "therapist", "psychologist", "ivf", "hospital", "doctor", "healthcare", "medical"],
        "sections": [
            {"archetype": "split_two_col", "variant": "hero", "id": "home"},
            {"archetype": "card_grid", "variant": "services", "id": "treatments"},
            {"archetype": "step_sequence", "id": "how-it-works"},
            {"archetype": "stat_row", "id": "results"},
            {"archetype": "quote_grid", "id": "reviews"},
            {"archetype": "split_two_col", "variant": "about", "id": "about"},
            {"archetype": "accordion", "id": "faq"},
            {"archetype": "centered_stack", "variant": "cta_band", "id": "cta"},
            {"archetype": "form_panel", "id": "contact"},
            {"archetype": "footer_columns"},
        ],
    },
    "sports_energy": {
        "id": "sports_energy",
        "label": "Sports Energy",
        "family": "sports",
        "best_for": ["gym", "fitness", "sports", "athletic", "training", "crossfit", "yoga studio", "martial arts", "personal trainer", "boxing"],
        "sections": [
            {"archetype": "fullbleed_media", "id": "home"},
            {"archetype": "stat_row", "id": "results"},
            {"archetype": "card_grid", "variant": "services", "id": "programs"},
            {"archetype": "step_sequence", "id": "how-it-works"},
            {"archetype": "quote_block", "id": "testimonial"},
            {"archetype": "centered_stack", "variant": "cta_band", "id": "cta"},
            {"archetype": "accordion", "id": "faq"},
            {"archetype": "form_panel", "id": "contact"},
            {"archetype": "footer_columns"},
        ],
    },
    "cafe_warmth": {
        "id": "cafe_warmth",
        "label": "Cafe Warmth",
        "family": "cafe",
        "best_for": ["restaurant", "cafe", "bakery", "coffee", "food truck", "pizzeria", "bar", "bistro", "catering", "diner"],
        "sections": [
            {"archetype": "split_two_col", "variant": "hero", "id": "home"},
            {"archetype": "card_grid", "variant": "services", "id": "menu"},
            {"archetype": "quote_grid", "id": "reviews"},
            {"archetype": "fullbleed_media", "id": "ambiance"},
            {"archetype": "step_sequence", "id": "how-it-works"},
            {"archetype": "accordion", "id": "faq"},
            {"archetype": "form_panel", "id": "reservations"},
            {"archetype": "footer_columns"},
        ],
    },
    "therapist_calm": {
        "id": "therapist_calm",
        "label": "Therapist Calm",
        "family": "therapist",
        "best_for": ["therapist", "counselor", "psychologist", "psychiatrist", "wellness", "meditation", "life coach", "mental health", "mindfulness", "holistic"],
        "sections": [
            {"archetype": "centered_stack", "variant": "hero", "id": "home"},
            {"archetype": "card_grid", "variant": "services", "id": "services"},
            {"archetype": "split_two_col", "variant": "about", "id": "about"},
            {"archetype": "quote_block", "id": "testimonial"},
            {"archetype": "step_sequence", "id": "how-it-works"},
            {"archetype": "accordion", "id": "faq"},
            {"archetype": "form_panel", "id": "contact"},
            {"archetype": "footer_columns"},
        ],
    },
    "education_academy": {
        "id": "education_academy",
        "label": "Education Academy",
        "family": "education",
        "best_for": ["school", "academy", "course", "tutor", "university", "bootcamp", "certification", "online learning", "workshop", "training center"],
        "sections": [
            {"archetype": "centered_stack", "variant": "hero", "id": "home"},
            {"archetype": "stat_row", "id": "results"},
            {"archetype": "card_grid", "variant": "services", "id": "programs"},
            {"archetype": "card_grid", "variant": "pricing", "id": "pricing"},
            {"archetype": "quote_grid", "id": "reviews"},
            {"archetype": "step_sequence", "id": "how-it-works"},
            {"archetype": "accordion", "id": "faq"},
            {"archetype": "form_panel", "id": "enroll"},
            {"archetype": "footer_columns"},
        ],
    },
    "creative_portfolio": {
        "id": "creative_portfolio",
        "label": "Creative Portfolio",
        "family": "creative",
        "best_for": ["designer", "photographer", "agency", "creative", "portfolio", "artist", "illustrator", "videographer", "studio", "freelancer"],
        "sections": [
            {"archetype": "fullbleed_media", "id": "home"},
            {"archetype": "card_grid", "variant": "services", "id": "services"},
            {"archetype": "split_two_col", "variant": "about", "id": "about"},
            {"archetype": "quote_block", "id": "testimonial"},
            {"archetype": "form_panel", "id": "contact"},
            {"archetype": "footer_columns"},
        ],
    },
    "telemed_care": {
        "id": "telemed_care",
        "label": "Telemedicine Care",
        "family": "telemed",
        "best_for": ["telemedicine", "telehealth", "virtual care", "online doctor", "remote health", "video consultation", "opioid", "suboxone", "MAT", "medication-assisted"],
        "sections": [
            {"archetype": "split_two_col", "variant": "hero", "id": "home"},
            {"archetype": "stat_row", "id": "results"},
            {"archetype": "card_grid", "variant": "services", "id": "services"},
            {"archetype": "step_sequence", "id": "how-it-works"},
            {"archetype": "quote_block", "id": "testimonial"},
            {"archetype": "quote_grid", "id": "reviews"},
            {"archetype": "split_two_col", "variant": "about", "id": "about"},
            {"archetype": "accordion", "id": "faq"},
            {"archetype": "centered_stack", "variant": "cta_band", "id": "cta"},
            {"archetype": "form_panel", "id": "contact"},
            {"archetype": "footer_columns"},
        ],
    },
    "rehab_sanctuary": {
        "id": "rehab_sanctuary",
        "label": "Rehab Sanctuary",
        "family": "rehab",
        "best_for": ["rehab", "rehabilitation", "addiction", "recovery", "sober", "detox", "substance abuse", "drug", "alcohol", "12 step"],
        "sections": [
            {"archetype": "fullbleed_media", "id": "home"},
            {"archetype": "stat_row", "id": "results"},
            {"archetype": "card_grid", "variant": "services", "id": "programs"},
            {"archetype": "step_sequence", "id": "how-it-works"},
            {"archetype": "split_two_col", "variant": "about", "id": "about"},
            {"archetype": "gallery", "id": "gallery"},
            {"archetype": "quote_block", "id": "testimonial"},
            {"archetype": "quote_grid", "id": "reviews"},
            {"archetype": "card_grid", "variant": "team", "id": "team"},
            {"archetype": "accordion", "id": "faq"},
            {"archetype": "centered_stack", "variant": "cta_band", "id": "cta"},
            {"archetype": "form_panel", "id": "contact"},
            {"archetype": "footer_columns"},
        ],
    },
}


def pick_pattern(business_type: str, description: str) -> dict:
    text = f"{business_type} {description}".lower()
    best_match = None
    best_score = 0
    for pat in PATTERN_COMBOS.values():
        score = sum(2 if kw in text else 0 for kw in pat["best_for"])
        if score > best_score:
            best_score = score
            best_match = pat
    return best_match or PATTERN_COMBOS["concierge_split"]


# ---------------------------------------------------------------------------
# AI content generation
# ---------------------------------------------------------------------------

CONTENT_SYSTEM = """You are a homepage copywriter. Given a business, generate ALL content for a full single-page website.
Return JSON with this exact structure:
{
  "businessType": "short type label",
  "siteName": "business name",
  "navLinks": ["Services", "How It Works", "Reviews", "FAQ", "Contact"],
  "navCta": "primary nav CTA text",
  "heroEyebrow": "short eyebrow text",
  "heroHeading": "compelling headline",
  "heroSubheading": "1-2 sentence supporting text",
  "heroBullets": ["benefit 1", "benefit 2", "benefit 3"],
  "heroTrustChips": ["chip 1", "chip 2", "chip 3", "chip 4"],
  "heroCtaPrimary": "primary button text",
  "heroCtaSecondary": "secondary button text",
  "heroCtaNote": "optional reassurance note or empty string",
  "heroStatCards": [{"value": "stat", "label": "label"}, {"value": "stat", "label": "label"}],
  "heroTrustPanelItems": ["trust item 1", "trust item 2", "trust item 3"],
  "services": [
    {"title": "service name", "description": "1-2 sentence description"},
    {"title": "service name", "description": "1-2 sentence description"},
    {"title": "service name", "description": "1-2 sentence description"}
  ],
  "features": [
    {"title": "feature name", "description": "1-2 sentence description"},
    {"title": "feature name", "description": "1-2 sentence description"},
    {"title": "feature name", "description": "1-2 sentence description"}
  ],
  "steps": [
    {"step": "1", "title": "step title", "description": "how this step works"},
    {"step": "2", "title": "step title", "description": "how this step works"},
    {"step": "3", "title": "step title", "description": "how this step works"}
  ],
  "testimonials": [
    {"quote": "testimonial text", "author": "person name", "role": "role/company"},
    {"quote": "testimonial text", "author": "person name", "role": "role/company"},
    {"quote": "testimonial text", "author": "person name", "role": "role/company"}
  ],
  "stats": [
    {"value": "100+", "label": "metric label"},
    {"value": "98%", "label": "metric label"},
    {"value": "24/7", "label": "metric label"},
    {"value": "5★", "label": "metric label"}
  ],
  "faqItems": [
    {"question": "common question?", "answer": "clear answer"},
    {"question": "common question?", "answer": "clear answer"},
    {"question": "common question?", "answer": "clear answer"},
    {"question": "common question?", "answer": "clear answer"}
  ],
  "teamMembers": [
    {"name": "person name", "role": "role title", "bio": "short bio"},
    {"name": "person name", "role": "role title", "bio": "short bio"}
  ],
  "aboutHeading": "about section heading",
  "aboutText": "2-3 sentence about paragraph",
  "aboutBullets": ["about point 1", "about point 2", "about point 3"],
  "contactHeading": "contact section heading",
  "contactSubheading": "brief contact description",
  "contactDetails": ["email@example.com", "+1 234 567 8900", "123 Street, City"],
  "serviceAreas": ["Area 1", "Area 2", "Area 3", "Area 4", "Area 5", "Area 6"],
  "ctaBandHeading": "compelling CTA heading",
  "ctaBandSubheading": "brief CTA supporting text",
  "ctaBandButtonText": "CTA button text",
  "galleryHeading": "heading for photo gallery section (if applicable)",
  "gallerySubheading": "brief gallery description (if applicable)",
  "galleryCaptions": ["caption for gallery photo 1", "caption for gallery photo 2", "caption 3", "caption 4", "caption 5", "caption 6"],
  "pricingPlans": [
    {"name": "Basic", "price": "$29/mo", "description": "For small teams", "features": ["feature 1", "feature 2", "feature 3"]},
    {"name": "Pro", "price": "$79/mo", "description": "For growing teams", "features": ["feature 1", "feature 2", "feature 3", "feature 4"]}
  ],
  "footerTagline": "short tagline",
  "footerColumns": [
    {"title": "Company", "links": [{"text": "About", "href": "#about"}, {"text": "Contact", "href": "#contact"}]},
    {"title": "Services", "links": [{"text": "link text", "href": "#services"}]},
    {"title": "Legal", "links": [{"text": "Privacy", "href": "#"}, {"text": "Terms", "href": "#"}]}
  ],
  "copyrightYear": "2025",
  "primaryColor": "hex color suited to this business",
  "accentColor": "hex accent color for CTAs"
}
Write SPECIFIC, REALISTIC copy for this exact business. Not generic placeholder text."""


def generate_content(api_key: str, name: str, description: str, pattern_id: str) -> dict:
    prompt = f"""Business name: {name}
Description: {description}
Design pattern: {pattern_id}

Generate all website content for this business. Make every piece of copy specific and realistic."""
    result = chat_json(api_key, CONTENT_SYSTEM, prompt, temperature=0.6, max_tokens=3000)
    result["siteName"] = result.get("siteName", name)
    return result


# ---------------------------------------------------------------------------
# Page assembler
# ---------------------------------------------------------------------------




def build_nav_links_from_sections(sections: list[dict]) -> list[dict[str, str]]:
    """Build nav anchor links from section list."""
    nav = []
    skip = {"home", "cta", "results", "testimonial", "areas"}
    for sec in sections:
        sid = sec.get("id", "")
        if not sid or sid in skip:
            continue
        if sec["archetype"] == "footer_columns":
            continue
        label = sid.replace("-", " ").replace("_", " ").title()
        nav.append({"label": label, "href": f"#{sid}"})
    return nav


def assemble_page(name: str, content: dict, pattern: dict, style: dict) -> str:
    """Assemble full HTML using class-based renderer."""
    family = pattern["family"]
    renderer_cls = RENDERER_CLASSES.get(family)
    if not renderer_cls:
        renderer_cls = RENDERER_CLASSES["saas"]

    renderer = renderer_cls(content, style)

    sections_html_parts = []
    for sec_def in pattern["sections"]:
        archetype = sec_def["archetype"]
        sid = sec_def.get("id", "")
        variant = sec_def.get("variant", "")
        html = renderer.render_section(archetype, section_id=sid, variant=variant)
        if html:
            sections_html_parts.append(html)

    body = "\n".join(sections_html_parts)
    nav_html = renderer.render_navbar()
    font = renderer.FONT
    body_bg = renderer.BODY_BG

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>{esc(name)}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family={font.replace(' ', '+')}:wght@400;500;600;700&display=swap" rel="stylesheet"/>
  <style>
    html {{ scroll-behavior: smooth; }}
    body {{ font-family: '{font}', system-ui, sans-serif; background: {body_bg}; color: #0f172a; }}
    h1, h2, h3, h4, strong {{ font-family: '{font}', system-ui, sans-serif; }}
    details summary {{ cursor: pointer; list-style: none; }}
    details summary::-webkit-details-marker {{ display: none; }}
  </style>
</head>
<body class="antialiased">
{nav_html}
<main>
{body}
</main>
</body>
</html>"""


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main() -> int:
    parser = argparse.ArgumentParser(description="Generate a full single-page website.")
    parser.add_argument("--name", required=True, help="Business name")
    parser.add_argument("--description", required=True, help="Business description")
    parser.add_argument("--output", required=True, help="Output HTML path")
    parser.add_argument("--pattern", default="", help="Force pattern: concierge_split, direct_conversion, product_led_b2b, editorial_luxury, trust_panel_clinic, sports_energy, cafe_warmth, therapist_calm, education_academy, creative_portfolio, telemed_care, rehab_sanctuary")
    parser.add_argument("--no-images", action="store_true", help="Skip Pixabay image fetching (use placeholders)")
    args = parser.parse_args()

    api_key = load_env_var("OPENAI_API_KEY")
    if not api_key:
        print("OPENAI_API_KEY not found in environment, .env.local, or .env")
        return 1

    pixabay_key = load_env_var("PIXABAY_API_KEY")

    if args.pattern and args.pattern in PATTERN_COMBOS:
        pattern = PATTERN_COMBOS[args.pattern]
        print(f"Pattern (forced): {pattern['label']}")
    else:
        print("1/4 Detecting business type...")
        ctx = chat_json(
            api_key,
            "Classify this business. Return JSON: {\"businessType\": \"short label\", \"keywords\": [\"kw1\",\"kw2\",...]}",
            f"Business: {args.name}\nDescription: {args.description}",
            temperature=0.3, max_tokens=300,
        )
        btype = ctx.get("businessType", "")
        kws = " ".join(ctx.get("keywords", []))
        pattern = pick_pattern(btype, f"{args.description} {kws}")
        print(f"   Detected: {btype} -> Pattern: {pattern['label']}")

    print("2/4 Generating content...")
    content = generate_content(api_key, args.name, args.description, pattern["id"])

    # Fetch Pixabay images if key available
    out = Path(args.output)
    if pixabay_key and not args.no_images:
        print("3/4 Fetching images from Pixabay...")
        btype = content.get("businessType", args.description)

        # Build gallery queries if pattern includes a gallery section
        gallery_queries = None
        has_gallery = any(s.get("archetype") == "gallery" for s in pattern.get("sections", []))
        if has_gallery:
            gallery_queries = content.get("galleryCaptions", [])
            if not gallery_queries:
                gallery_queries = [
                    f"{btype} facility exterior",
                    f"{btype} interior lounge",
                    f"{btype} room",
                    f"{btype} therapy session",
                    f"{btype} outdoor garden",
                    f"{btype} dining area",
                ]

        images = fetch_section_images(pixabay_key, api_key, args.name, btype, args.description, gallery_queries=gallery_queries)
        if images:
            images_dir = out.parent / "images"
            print(f"   Downloading images to {images_dir}/ ...")
            images = download_images(images, images_dir)
        content.update(images)
    else:
        if not pixabay_key:
            print("3/4 Skipping images (PIXABAY_API_KEY not set)")
        else:
            print("3/4 Skipping images (--no-images)")

    renderer_cls = RENDERER_CLASSES.get(pattern["family"], RENDERER_CLASSES["saas"])
    style = renderer_cls.get_style(content.get("primaryColor", "#2563eb"), content.get("accentColor", "#f97316"))

    print("4/4 Rendering page...")
    html = assemble_page(args.name, content, pattern, style)

    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html, encoding="utf-8")

    print(f"Done: {out} ({len(html)} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
