#!/usr/bin/env python3
"""
Full single-page generator with 12 archetype renderers and 5 design combos.

Usage:
    python3 generate_page.py \
        --name "PawPals Mobile Grooming" \
        --description "At-home pet grooming for dogs and cats in South Delhi" \
        --output output/page.html
"""

from __future__ import annotations

import argparse
import json
import os
import re
import ssl
import urllib.request
from pathlib import Path
from typing import Any

MODEL = "gpt-4o-mini"

# ---------------------------------------------------------------------------
# Utilities
# ---------------------------------------------------------------------------

def esc(value: Any) -> str:
    if value is None:
        return ""
    return str(value).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


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
# Style token system — 5 design families
# ---------------------------------------------------------------------------

def get_style(family: str, primary_color: str = "#2563eb", accent_color: str = "#f97316") -> dict[str, str]:
    base = {
        "family": family,
        "primary_color": primary_color,
        "accent_color": accent_color,
    }

    if family == "concierge":
        return {**base,
            "card_border": "border border-rose-100/60",
            "card_bg": "bg-white",
            "card_radius": "rounded-2xl",
            "card_shadow": "shadow-[0_20px_50px_rgba(190,24,93,0.06)]",
            "card_padding": "p-7",
            "heading_size": "text-3xl lg:text-4xl",
            "heading_weight": "font-semibold",
            "heading_tracking": "tracking-[-0.04em]",
            "heading_color": "text-stone-950",
            "body_text": "text-stone-600",
            "body_size": "text-base",
            "body_leading": "leading-8",
            "muted_text": "text-stone-400",
            "eyebrow_style": "mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-rose-600",
            "badge_style": "rounded-full bg-white/70 px-3.5 py-1.5 text-xs font-medium text-stone-700 shadow-sm backdrop-blur",
            "section_py": "py-20",
            "section_py_sm": "py-14",
            "container": "mx-auto w-full max-w-7xl px-6 lg:px-8",
            "container_narrow": "mx-auto w-full max-w-3xl px-6 lg:px-8",
            "gap": "gap-7",
            "gap_sm": "gap-4",
            "bullet_marker": "<span class='mt-1 h-2 w-2 shrink-0 rounded-full bg-rose-300'></span>",
            "check_marker": "<span class='text-rose-400'>&#10003;</span>",
            "primary_btn": f"rounded-full bg-[{accent_color}] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(0,0,0,0.1)] transition hover:opacity-90",
            "secondary_btn": "rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-50",
            "dark_block": "rounded-[2rem] bg-gradient-to-br from-[#201419] to-[#4b2b34] text-[#fff7f6]",
            "section_border": "",
        }

    if family == "direct":
        return {**base,
            "card_border": "border border-slate-200",
            "card_bg": "bg-white",
            "card_radius": "rounded-lg",
            "card_shadow": "shadow-[0_4px_12px_rgba(15,23,42,0.04)]",
            "card_padding": "p-4",
            "heading_size": "text-2xl lg:text-3xl",
            "heading_weight": "font-bold",
            "heading_tracking": "tracking-tight",
            "heading_color": "text-slate-950",
            "body_text": "text-slate-600",
            "body_size": "text-sm",
            "body_leading": "leading-6",
            "muted_text": "text-slate-500",
            "eyebrow_style": "mb-1 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-slate-500",
            "badge_style": "rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700",
            "section_py": "py-12",
            "section_py_sm": "py-8",
            "container": "mx-auto w-full max-w-7xl px-6 lg:px-8",
            "container_narrow": "mx-auto w-full max-w-3xl px-6 lg:px-8",
            "gap": "gap-3",
            "gap_sm": "gap-2",
            "bullet_marker": "<span class='text-emerald-500 font-bold'>&#10003;</span>",
            "check_marker": "<span class='text-emerald-500 font-bold'>&#10003;</span>",
            "primary_btn": f"rounded-lg bg-[{primary_color}] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-90",
            "secondary_btn": "rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50",
            "dark_block": "rounded-lg bg-slate-900 text-white",
            "section_border": "",
        }

    if family == "saas":
        return {**base,
            "card_border": "border border-slate-200",
            "card_bg": "bg-white",
            "card_radius": "rounded-xl",
            "card_shadow": "shadow-[0_8px_24px_rgba(15,23,42,0.05)]",
            "card_padding": "p-5",
            "heading_size": "text-3xl lg:text-4xl",
            "heading_weight": "font-bold",
            "heading_tracking": "tracking-tight",
            "heading_color": "text-slate-950",
            "body_text": "text-slate-500",
            "body_size": "text-base",
            "body_leading": "leading-7",
            "muted_text": "text-slate-400",
            "eyebrow_style": "mb-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-400",
            "badge_style": "rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm",
            "section_py": "py-16",
            "section_py_sm": "py-10",
            "container": "mx-auto w-full max-w-7xl px-6 lg:px-8",
            "container_narrow": "mx-auto w-full max-w-3xl px-6 lg:px-8",
            "gap": "gap-5",
            "gap_sm": "gap-3",
            "bullet_marker": "<span class='mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md bg-slate-100 text-[0.6rem] font-bold text-slate-500'>&#8226;</span>",
            "check_marker": "<span class='text-emerald-500'>&#10003;</span>",
            "primary_btn": "rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800",
            "secondary_btn": "rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50",
            "dark_block": "rounded-2xl bg-slate-950 text-white",
            "section_border": "",
        }

    if family == "editorial":
        return {**base,
            "card_border": "border border-stone-200/50",
            "card_bg": "bg-[#fffaf2]",
            "card_radius": "rounded-xl",
            "card_shadow": "shadow-[0_18px_50px_rgba(71,55,32,0.05)]",
            "card_padding": "p-7",
            "heading_size": "text-3xl lg:text-4xl",
            "heading_weight": "font-semibold",
            "heading_tracking": "tracking-[-0.035em]",
            "heading_color": "text-stone-900",
            "body_text": "text-stone-600",
            "body_size": "text-base",
            "body_leading": "leading-[1.85]",
            "muted_text": "text-stone-400",
            "eyebrow_style": "mb-5 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-stone-400",
            "badge_style": "border-b border-stone-300/40 pb-0.5 text-xs font-medium tracking-wide text-stone-500",
            "section_py": "py-24",
            "section_py_sm": "py-16",
            "container": "mx-auto w-full max-w-6xl px-8 lg:px-10",
            "container_narrow": "mx-auto w-full max-w-3xl px-8 lg:px-10",
            "gap": "gap-8",
            "gap_sm": "gap-5",
            "bullet_marker": "<span class='h-px w-4 shrink-0 bg-stone-400 mt-3'></span>",
            "check_marker": "<span class='h-px w-4 bg-stone-400'></span>",
            "primary_btn": "border-b border-stone-800 pb-1 text-sm font-medium tracking-wide text-stone-800 transition hover:border-stone-500 hover:text-stone-600",
            "secondary_btn": "text-sm font-medium text-stone-500 transition hover:text-stone-800",
            "dark_block": "rounded-xl bg-[#1f1812] text-[#f9f4ea]",
            "section_border": "border-t border-stone-200/40",
        }

    if family == "clinic":
        return {**base,
            "card_border": "border border-slate-200",
            "card_bg": "bg-white",
            "card_radius": "rounded-xl",
            "card_shadow": "shadow-[0_8px_24px_rgba(15,23,42,0.04)]",
            "card_padding": "p-5",
            "heading_size": "text-3xl lg:text-4xl",
            "heading_weight": "font-semibold",
            "heading_tracking": "tracking-tight",
            "heading_color": "text-slate-950",
            "body_text": "text-slate-600",
            "body_size": "text-base",
            "body_leading": "leading-7",
            "muted_text": "text-slate-500",
            "eyebrow_style": "mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500",
            "badge_style": "rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm",
            "section_py": "py-16",
            "section_py_sm": "py-10",
            "container": "mx-auto w-full max-w-7xl px-6 lg:px-8",
            "container_narrow": "mx-auto w-full max-w-3xl px-6 lg:px-8",
            "gap": "gap-5",
            "gap_sm": "gap-3",
            "bullet_marker": f"<span class='text-[{primary_color}]'>&#10003;</span>",
            "check_marker": f"<span class='text-[{primary_color}]'>&#10003;</span>",
            "primary_btn": f"rounded-xl bg-[{primary_color}] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90",
            "secondary_btn": "rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50",
            "dark_block": "rounded-xl bg-slate-900 text-white",
            "section_border": "",
        }

    # Fallback
    return get_style("saas", primary_color, accent_color)




# ---------------------------------------------------------------------------
# Archetype renderers (generated by parallel agents)
# ---------------------------------------------------------------------------

def render_navbar(content: dict, style: dict) -> str:
    family = style.get("family", "concierge")
    site_name = esc(content.get("siteName", ""))
    nav_links = content.get("navLinks", [])[:5]
    nav_cta = esc(content.get("navCta", "Get Started"))
    primary_color = style.get("primary_color", "#1e3a5f")
    accent_color = style.get("accent_color", "#f97316")

    def link_href(text):
        return "#" + text.lower().strip().replace(" ", "-")

    # --- CONCIERGE ---
    if family == "concierge":
        links_html = ""
        for link in nav_links:
            links_html += (
                f'<a href="{esc(link_href(link))}" '
                f'class="text-stone-600 hover:text-rose-600 transition-colors duration-200 text-sm font-medium">'
                f'{esc(link)}</a>'
            )

        return (
            f'<nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-rose-100/60">'
            f'<div class="mx-auto w-full max-w-7xl px-6 lg:px-8 flex items-center justify-between py-5">'
            f'<a href="#" class="text-lg font-medium text-stone-800 tracking-tight">{site_name}</a>'
            f'<div class="hidden md:flex items-center gap-8">{links_html}</div>'
            f'<a href="#contact" class="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:opacity-90" '
            f'style="background-color:{esc(primary_color)}">{nav_cta}</a>'
            f'</div>'
            f'</nav>'
        )

    # --- DIRECT ---
    if family == "direct":
        links_html = ""
        for link in nav_links:
            links_html += (
                f'<a href="{esc(link_href(link))}" '
                f'class="text-slate-700 hover:text-slate-950 transition-colors duration-150 text-sm font-bold">'
                f'{esc(link)}</a>'
            )

        return (
            f'<nav class="sticky top-0 z-50 bg-white border-b border-slate-200">'
            f'<div class="mx-auto w-full max-w-7xl px-6 lg:px-8 flex items-center justify-between py-3.5">'
            f'<a href="#" class="text-lg font-bold text-slate-950 tracking-tight">{site_name}</a>'
            f'<div class="hidden md:flex items-center gap-7">{links_html}</div>'
            f'<a href="#contact" class="inline-flex items-center justify-center rounded-lg px-5 py-2 text-sm font-bold text-white shadow-sm transition-all duration-150 hover:opacity-90" '
            f'style="background-color:{esc(primary_color)}">{nav_cta}</a>'
            f'</div>'
            f'</nav>'
        )

    # --- SAAS ---
    if family == "saas":
        links_html = ""
        for link in nav_links:
            links_html += (
                f'<a href="{esc(link_href(link))}" '
                f'class="text-slate-600 hover:text-slate-900 transition-colors duration-200 text-sm font-medium">'
                f'{esc(link)}</a>'
            )

        return (
            f'<nav class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/70">'
            f'<div class="mx-auto w-full max-w-7xl px-6 lg:px-8 flex items-center justify-between py-4">'
            f'<a href="#" class="text-lg font-semibold text-slate-900 tracking-tight">{site_name}</a>'
            f'<div class="hidden md:flex items-center gap-7">{links_html}</div>'
            f'<div class="flex items-center gap-5">'
            f'<a href="#contact" class="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200">Sign In</a>'
            f'<a href="#contact" class="inline-flex items-center justify-center rounded-lg px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-90" '
            f'style="background-color:{esc(primary_color)}">{nav_cta}</a>'
            f'</div>'
            f'</div>'
            f'</nav>'
        )

    # --- EDITORIAL ---
    if family == "editorial":
        links_html = ""
        for link in nav_links:
            links_html += (
                f'<a href="{esc(link_href(link))}" '
                f'class="text-stone-500 hover:text-stone-900 transition-colors duration-200 text-xs font-normal uppercase tracking-[0.18em]">'
                f'{esc(link)}</a>'
            )

        return (
            f'<nav class="sticky top-0 z-50 border-b border-stone-200/50" style="background-color:#faf6f0">'
            f'<div class="mx-auto w-full max-w-6xl px-6 lg:px-8 flex items-center justify-between py-6">'
            f'<a href="#" class="text-lg font-normal text-stone-800 tracking-tight">{site_name}</a>'
            f'<div class="hidden md:flex items-center gap-10">{links_html}</div>'
            f'<a href="#contact" class="text-xs font-normal uppercase tracking-[0.18em] text-stone-500 hover:text-stone-900 transition-colors duration-200">{nav_cta}</a>'
            f'</div>'
            f'</nav>'
        )

    # --- CLINIC ---
    if family == "clinic":
        links_html = ""
        for link in nav_links:
            links_html += (
                f'<a href="{esc(link_href(link))}" '
                f'class="text-slate-500 hover:text-slate-800 transition-colors duration-200 text-sm font-medium">'
                f'{esc(link)}</a>'
            )

        return (
            f'<nav class="sticky top-0 z-50 bg-white/[0.96] backdrop-blur-md border-b border-slate-100">'
            f'<div class="mx-auto w-full max-w-7xl px-6 lg:px-8 flex items-center justify-between py-4">'
            f'<a href="#" class="text-lg font-semibold text-slate-800 tracking-tight">{site_name}</a>'
            f'<div class="hidden md:flex items-center gap-8">{links_html}</div>'
            f'<a href="#contact" class="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:opacity-90" '
            f'style="background-color:{esc(primary_color)}">{nav_cta}</a>'
            f'</div>'
            f'</nav>'
        )

    # Fallback: concierge-like default
    links_html = ""
    for link in nav_links:
        links_html += (
            f'<a href="{esc(link_href(link))}" '
            f'class="text-stone-600 hover:text-stone-900 transition-colors text-sm font-medium">'
            f'{esc(link)}</a>'
        )

    return (
        f'<nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-stone-200">'
        f'<div class="mx-auto w-full max-w-7xl px-6 lg:px-8 flex items-center justify-between py-4">'
        f'<a href="#" class="text-lg font-medium text-stone-800">{site_name}</a>'
        f'<div class="hidden md:flex items-center gap-8">{links_html}</div>'
        f'<a href="#contact" class="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90" '
        f'style="background-color:{esc(primary_color)}">{nav_cta}</a>'
        f'</div>'
        f'</nav>'
    )


def render_split_two_col(content: dict, style: dict, section_id: str = "", variant: str = "hero") -> str:
    """Renders a two-column split section for hero, about, or contact variants.

    Each style family produces a visually distinct layout.
    """
    fam = style.get("family", "concierge")
    sid = f' id="{esc(section_id)}"' if section_id else ""
    container = style.get("container", "mx-auto w-full max-w-7xl px-6 lg:px-8")
    heading_cls = f"{style.get('heading_size','text-4xl')} {style.get('heading_weight','font-semibold')} {style.get('heading_tracking','tracking-tight')} {style.get('heading_color','text-stone-950')}"
    body_cls = f"{style.get('body_size','text-base')} {style.get('body_leading','leading-8')} {style.get('body_text','text-stone-600')}"
    muted = style.get("muted_text", "text-stone-400")
    bullet_marker = style.get("bullet_marker", '<span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-stone-400"></span>')
    primary_btn = style.get("primary_btn", "rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90")
    secondary_btn = style.get("secondary_btn", "rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-50")
    section_py = style.get("section_py", "py-20")
    eyebrow_style = style.get("eyebrow_style", "text-xs font-semibold uppercase tracking-[0.16em] text-rose-600")

    # --- Override container for editorial ---
    if fam == "editorial":
        container = style.get("container", "mx-auto w-full max-w-6xl px-8 lg:px-10")

    # ===== Build variant-specific left and right columns =====

    if variant == "hero":
        left_html = _build_hero_left(content, style, fam, heading_cls, body_cls, eyebrow_style, bullet_marker, primary_btn, secondary_btn, muted)
        right_html = _build_hero_right(content, style, fam)
    elif variant == "about":
        left_html = _build_about_left(content, style, fam, heading_cls, body_cls, bullet_marker)
        right_html = _build_about_right(content, style, fam)
    elif variant == "contact":
        left_html = _build_contact_left(content, style, fam, heading_cls, body_cls, muted)
        right_html = _build_contact_right(content, style, fam)
    else:
        left_html = ""
        right_html = ""

    # ===== Family-specific grid and section styling =====
    grid_gap = _family_gap(fam)
    section_bg = _family_section_bg(fam, variant)
    grid_cols = "lg:grid-cols-[1.1fr_0.9fr]" if variant != "contact" else "lg:grid-cols-2"

    return (
        f'<section{sid} class="{esc(section_py)} {section_bg}">\n'
        f'  <div class="{esc(container)}">\n'
        f'    <div class="grid {grid_gap} {grid_cols} items-start">\n'
        f'      <div>{left_html}</div>\n'
        f'      <div>{right_html}</div>\n'
        f'    </div>\n'
        f'  </div>\n'
        f'</section>'
    )


# ---------------------------------------------------------------------------
# Family helpers
# ---------------------------------------------------------------------------

def _family_gap(fam):
    return {
        "concierge": "gap-10",
        "direct": "gap-4",
        "saas": "gap-8",
        "editorial": "gap-12",
        "clinic": "gap-10",
    }.get(fam, "gap-8")


def _family_section_bg(fam, variant):
    if variant == "hero":
        return {
            "concierge": "bg-gradient-to-br from-[#fffdf8] via-white to-[#fff5ee]",
            "direct": "bg-white",
            "saas": "bg-gradient-to-br from-slate-50 via-white to-blue-50/40",
            "editorial": "bg-[#faf6f0]",
            "clinic": "bg-gradient-to-br from-[#f0fafb] via-white to-slate-50",
        }.get(fam, "bg-white")
    elif variant == "about":
        return {
            "concierge": "bg-gradient-to-br from-white to-rose-50/30",
            "direct": "bg-slate-50",
            "saas": "bg-white",
            "editorial": "bg-[#faf6f0]",
            "clinic": "bg-gradient-to-br from-teal-50/30 via-white to-white",
        }.get(fam, "bg-white")
    else:  # contact
        return {
            "concierge": "bg-gradient-to-br from-[#fffdf8] to-white",
            "direct": "bg-white",
            "saas": "bg-slate-50",
            "editorial": "bg-[#faf6f0]",
            "clinic": "bg-gradient-to-br from-[#f0fafb] to-white",
        }.get(fam, "bg-white")


# ---------------------------------------------------------------------------
# HERO variant builders
# ---------------------------------------------------------------------------

def _build_hero_left(content, style, fam, heading_cls, body_cls, eyebrow_style, bullet_marker, primary_btn, secondary_btn, muted):
    eyebrow = content.get("heroEyebrow", "")
    heading = content.get("heroHeading", "")
    subheading = content.get("heroSubheading", "")
    bullets = content.get("heroBullets", [])
    cta_primary = content.get("heroCtaPrimary", "")
    cta_secondary = content.get("heroCtaSecondary", "")
    trust_chips = content.get("heroTrustChips", [])
    cta_note = content.get("heroCtaNote", "")

    # Eyebrow
    eyebrow_html = f'<div class="mb-3 {esc(eyebrow_style)}">{esc(eyebrow)}</div>' if eyebrow else ""

    # Heading
    heading_html = f'<h1 class="max-w-xl text-balance {esc(heading_cls)} sm:text-5xl">{esc(heading)}</h1>'

    # Subheading
    sub_html = f'<p class="mt-5 max-w-lg {esc(body_cls)}">{esc(subheading)}</p>' if subheading else ""

    # Bullets
    bullet_items = ""
    for b in bullets[:4]:
        bullet_items += f'<li class="flex items-start gap-3">{bullet_marker}<span>{esc(b)}</span></li>'
    bullets_html = f'<ul class="mt-6 grid gap-2.5 text-sm {style.get("body_text","text-stone-700")}">{bullet_items}</ul>' if bullet_items else ""

    # CTAs
    ctas_html = '<div class="mt-8 flex flex-wrap gap-3">'
    if cta_primary:
        ctas_html += f'<a class="{esc(primary_btn)}" href="#contact">{esc(cta_primary)}</a>'
    if cta_secondary:
        ctas_html += f'<a class="{esc(secondary_btn)}" href="#services">{esc(cta_secondary)}</a>'
    ctas_html += '</div>'

    # CTA note
    note_html = f'<p class="mt-3 text-xs font-medium {esc(muted)}">{esc(cta_note)}</p>' if cta_note else ""

    # Trust chips
    chips_html = ""
    if trust_chips:
        chip_cls = _chip_classes(fam)
        chips = "".join(f'<span class="{chip_cls}">{esc(c)}</span>' for c in trust_chips[:4])
        chips_html = f'<div class="mt-5 flex flex-wrap gap-2">{chips}</div>'

    return f'{eyebrow_html}{heading_html}{sub_html}{bullets_html}{ctas_html}{note_html}{chips_html}'


def _chip_classes(fam):
    return {
        "concierge": "rounded-full bg-white/70 px-3.5 py-1.5 text-xs font-medium text-stone-700 shadow-sm backdrop-blur",
        "direct": "rounded-md bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700",
        "saas": "rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600",
        "editorial": "border-b border-stone-300 pb-0.5 text-xs font-medium tracking-wide text-stone-500",
        "clinic": "rounded-full bg-teal-50 px-3.5 py-1.5 text-xs font-medium text-teal-700",
    }.get(fam, "rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600")


def _build_hero_right(content, style, fam):
    stat_cards = content.get("heroStatCards", [])

    if fam == "concierge":
        # Rounded-[2rem] visual panel with warm gradient + floating benefit cards with backdrop-blur
        bullets = content.get("heroBullets", [])
        floating_cards = ""
        for b in bullets[:3]:
            floating_cards += (
                f'<div class="rounded-2xl border border-rose-100/60 bg-white/80 px-4 py-3 '
                f'text-sm font-medium text-stone-800 shadow-sm backdrop-blur">{esc(b)}</div>'
            )
        return (
            f'<div class="relative">'
            f'<div class="aspect-[4/5] overflow-hidden rounded-[2rem] bg-gradient-to-br from-rose-50 to-orange-50 '
            f'ring-1 ring-stone-200/40 shadow-[0_20px_50px_rgba(190,24,93,0.06)]">'
            f'<div class="flex h-full items-center justify-center text-stone-300">'
            f'{_placeholder_image_svg()}'
            f'</div></div>'
            f'<div class="absolute -left-4 bottom-8 grid gap-2 lg:-left-6">{floating_cards}</div>'
            f'</div>'
        )

    elif fam == "direct":
        # Tight, no floating cards, slate-50 bg, rounded-lg, compact
        return (
            f'<div class="aspect-[4/3] overflow-hidden rounded-lg bg-slate-50 ring-1 ring-slate-200">'
            f'<div class="flex h-full items-center justify-center text-slate-300">'
            f'{_placeholder_image_svg("h-14 w-14")}'
            f'</div></div>'
        )

    elif fam == "saas":
        # Dashboard mockup panel with stat cards at bottom
        cards_html = ""
        for s in stat_cards[:3]:
            cards_html += (
                f'<div class="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">'
                f'<div class="text-lg font-bold tracking-tight text-slate-900">{esc(s.get("value",""))}</div>'
                f'<div class="text-xs text-slate-500">{esc(s.get("label",""))}</div></div>'
            )
        return (
            f'<div class="relative">'
            f'<div class="aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 '
            f'bg-gradient-to-br from-slate-100 to-white shadow-lg ring-1 ring-slate-900/5">'
            f'<div class="flex h-full items-center justify-center text-slate-300">'
            f'{_placeholder_dashboard_svg()}'
            f'</div></div>'
            f'<div class="absolute -bottom-4 left-4 right-4 flex gap-2">{cards_html}</div>'
            f'</div>'
        )

    elif fam == "editorial":
        # No rounded panels, clean, typography-first, subtle border
        return (
            f'<div class="aspect-[4/5] border border-stone-200 bg-gradient-to-br from-stone-100 via-[#ebe4d8] to-stone-50">'
            f'<div class="flex h-full items-center justify-center text-stone-300">'
            f'{_placeholder_image_svg("h-20 w-20")}'
            f'</div></div>'
        )

    elif fam == "clinic":
        # Rounded-2xl, soft teal-50 gradient, trust-oriented
        trust_chips = content.get("heroTrustChips", [])
        trust_items = ""
        for t in trust_chips[:3]:
            trust_items += (
                f'<div class="rounded-xl border border-teal-100 bg-white px-4 py-3.5 '
                f'text-sm font-medium text-slate-800">{esc(t)}</div>'
            )
        return (
            f'<div class="rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50/40 p-5 ring-1 ring-teal-100/60">'
            f'<div class="aspect-[4/3] overflow-hidden rounded-xl bg-white/70 ring-1 ring-teal-100/40">'
            f'<div class="flex h-full items-center justify-center text-teal-200">'
            f'{_placeholder_image_svg("h-16 w-16")}'
            f'</div></div>'
            f'<div class="mt-4 grid gap-2">{trust_items}</div>'
            f'</div>'
        )

    return ""


# ---------------------------------------------------------------------------
# ABOUT variant builders
# ---------------------------------------------------------------------------

def _build_about_left(content, style, fam, heading_cls, body_cls, bullet_marker):
    heading = content.get("aboutHeading", "")
    text = content.get("aboutText", "")
    bullets = content.get("aboutBullets", [])

    heading_html = f'<h2 class="{esc(heading_cls)}">{esc(heading)}</h2>'
    text_html = f'<p class="mt-5 max-w-xl {esc(body_cls)}">{esc(text)}</p>' if text else ""

    bullet_items = ""
    for b in bullets[:6]:
        bullet_items += f'<li class="flex items-start gap-3">{bullet_marker}<span>{esc(b)}</span></li>'
    bullets_html = f'<ul class="mt-6 grid gap-2.5 text-sm {style.get("body_text","text-stone-700")}">{bullet_items}</ul>' if bullet_items else ""

    return f'{heading_html}{text_html}{bullets_html}'


def _build_about_right(content, style, fam):
    if fam == "concierge":
        return (
            f'<div class="aspect-[4/5] overflow-hidden rounded-[2rem] bg-gradient-to-br from-rose-50 to-orange-50/60 '
            f'ring-1 ring-stone-200/40 shadow-[0_16px_40px_rgba(190,24,93,0.05)]">'
            f'<div class="flex h-full items-center justify-center text-stone-300">'
            f'{_placeholder_image_svg()}'
            f'</div></div>'
        )
    elif fam == "direct":
        return (
            f'<div class="aspect-[4/3] overflow-hidden rounded-lg bg-slate-50 ring-1 ring-slate-200">'
            f'<div class="flex h-full items-center justify-center text-slate-300">'
            f'{_placeholder_image_svg("h-14 w-14")}'
            f'</div></div>'
        )
    elif fam == "saas":
        return (
            f'<div class="aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 '
            f'bg-gradient-to-br from-slate-100 to-white shadow-md ring-1 ring-slate-900/5">'
            f'<div class="flex h-full items-center justify-center text-slate-300">'
            f'{_placeholder_image_svg("h-16 w-16")}'
            f'</div></div>'
        )
    elif fam == "editorial":
        return (
            f'<div class="aspect-[3/4] border border-stone-200 bg-gradient-to-br from-stone-100 to-[#ebe4d8]">'
            f'<div class="flex h-full items-center justify-center text-stone-300">'
            f'{_placeholder_image_svg("h-20 w-20")}'
            f'</div></div>'
        )
    elif fam == "clinic":
        return (
            f'<div class="aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50/30 '
            f'ring-1 ring-teal-100/60">'
            f'<div class="flex h-full items-center justify-center text-teal-200">'
            f'{_placeholder_image_svg("h-16 w-16")}'
            f'</div></div>'
        )
    return ""


# ---------------------------------------------------------------------------
# CONTACT variant builders
# ---------------------------------------------------------------------------

def _build_contact_left(content, style, fam, heading_cls, body_cls, muted):
    heading = content.get("contactHeading", "")
    subheading = content.get("contactSubheading", "")
    details = content.get("contactDetails", [])

    heading_html = f'<h2 class="{esc(heading_cls)}">{esc(heading)}</h2>'
    sub_html = f'<p class="mt-4 max-w-lg {esc(body_cls)}">{esc(subheading)}</p>' if subheading else ""

    detail_items = ""
    for d in details[:6]:
        detail_items += f'<li class="flex items-start gap-3">{_contact_icon(fam)}<span>{esc(d)}</span></li>'
    details_html = f'<ul class="mt-6 grid gap-3 text-sm {style.get("body_text","text-stone-700")}">{detail_items}</ul>' if detail_items else ""

    return f'{heading_html}{sub_html}{details_html}'


def _contact_icon(fam):
    color = {
        "concierge": "text-rose-400",
        "direct": "text-slate-400",
        "saas": "text-slate-400",
        "editorial": "text-stone-400",
        "clinic": "text-teal-500",
    }.get(fam, "text-stone-400")
    return (
        f'<svg class="mt-0.5 h-4 w-4 shrink-0 {color}" fill="none" stroke="currentColor" viewBox="0 0 24 24">'
        f'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" '
        f'd="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>'
        f'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>'
        f'</svg>'
    )


def _build_contact_right(content, style, fam):
    # Form placeholder styled per family
    if fam == "concierge":
        return (
            f'<div class="rounded-[2rem] bg-gradient-to-br from-rose-50 to-orange-50/60 p-8 '
            f'shadow-[0_16px_40px_rgba(190,24,93,0.05)] ring-1 ring-stone-200/40">'
            f'{_form_placeholder_fields(style, fam)}'
            f'</div>'
        )
    elif fam == "direct":
        return (
            f'<div class="rounded-lg bg-slate-50 p-6 ring-1 ring-slate-200">'
            f'{_form_placeholder_fields(style, fam)}'
            f'</div>'
        )
    elif fam == "saas":
        return (
            f'<div class="rounded-2xl border border-slate-200 bg-white p-7 shadow-md ring-1 ring-slate-900/5">'
            f'{_form_placeholder_fields(style, fam)}'
            f'</div>'
        )
    elif fam == "editorial":
        return (
            f'<div class="border border-stone-200 bg-white p-8">'
            f'{_form_placeholder_fields(style, fam)}'
            f'</div>'
        )
    elif fam == "clinic":
        return (
            f'<div class="rounded-2xl bg-gradient-to-br from-teal-50 to-white p-7 ring-1 ring-teal-100/60">'
            f'{_form_placeholder_fields(style, fam)}'
            f'</div>'
        )
    return ""


def _form_placeholder_fields(style, fam):
    """Returns styled placeholder form fields (non-functional, visual only)."""
    primary_btn = style.get("primary_btn", "rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white")

    input_cls = {
        "concierge": "w-full rounded-xl border border-rose-100/60 bg-white px-4 py-3 text-sm text-stone-500",
        "direct": "w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-500",
        "saas": "w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500",
        "editorial": "w-full border-b border-stone-200 bg-transparent px-0 py-3 text-sm text-stone-500",
        "clinic": "w-full rounded-xl border border-teal-100 bg-white px-4 py-3 text-sm text-slate-500",
    }.get(fam, "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500")

    muted = style.get("muted_text", "text-stone-400")

    return (
        f'<div class="grid gap-4">'
        f'<div class="{input_cls}">Your name</div>'
        f'<div class="{input_cls}">Email address</div>'
        f'<div class="{input_cls}">Phone number</div>'
        f'<div class="{input_cls} min-h-[80px]">Your message</div>'
        f'<div><a class="{esc(primary_btn)} inline-block w-full text-center" href="#">Send Message</a></div>'
        f'<p class="text-center text-xs {esc(muted)}">We typically respond within 24 hours.</p>'
        f'</div>'
    )


# ---------------------------------------------------------------------------
# SVG placeholders
# ---------------------------------------------------------------------------

def _placeholder_image_svg(size="h-20 w-20"):
    return (
        f'<svg class="{size}" fill="none" stroke="currentColor" viewBox="0 0 24 24">'
        f'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" '
        f'd="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01'
        f'M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>'
    )


def _placeholder_dashboard_svg():
    return (
        '<svg class="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">'
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" '
        'd="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>'
    )


def render_centered_stack(content: dict, style: dict, section_id: str = "", variant: str = "hero") -> str:
    """Renders a centered vertically-stacked section (hero or CTA band)."""

    family = style.get("family", "saas")
    sid = f' id="{esc(section_id)}"' if section_id else ""

    # ── Family-specific config ──────────────────────────────────────────
    cfg = {
        "concierge": {
            "max_w": "max-w-2xl",
            "section_py": "py-20",
            "section_py_cta": "py-16",
            "heading_size": "text-5xl sm:text-6xl",
            "sub_size": "text-lg",
            "stack_gap": "gap-6",
            "chip_wrap": "flex flex-wrap items-center justify-center gap-3",
            "chip_cls": "rounded-full bg-white/70 backdrop-blur px-4 py-1.5 text-sm text-stone-600 shadow-sm",
            "cta_extra": "shadow-lg shadow-stone-300/40",
            "show_chips": True,
            "cta_style": "button",
            "eyebrow_mb": "mb-4",
            "heading_mb": "mb-5",
            "sub_mb": "mb-8",
            "chips_mb": "mb-8",
            "note_mt": "mt-4",
        },
        "direct": {
            "max_w": "max-w-3xl",
            "section_py": "py-12",
            "section_py_cta": "py-10",
            "heading_size": "text-4xl sm:text-5xl",
            "sub_size": "text-base",
            "stack_gap": "gap-4",
            "chip_wrap": "flex flex-wrap items-center justify-center gap-2",
            "chip_cls": "rounded-md bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700",
            "cta_extra": "font-bold",
            "show_chips": True,
            "cta_style": "button",
            "eyebrow_mb": "mb-3",
            "heading_mb": "mb-3",
            "sub_mb": "mb-6",
            "chips_mb": "mb-6",
            "note_mt": "mt-3",
        },
        "saas": {
            "max_w": "max-w-3xl",
            "section_py": "py-20",
            "section_py_cta": "py-14",
            "heading_size": "text-5xl sm:text-6xl",
            "sub_size": "text-lg",
            "stack_gap": "gap-5",
            "chip_wrap": "flex flex-wrap items-center justify-center gap-3",
            "chip_cls": "rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm text-slate-600",
            "cta_extra": "",
            "show_chips": True,
            "cta_style": "button",
            "eyebrow_mb": "mb-4",
            "heading_mb": "mb-4",
            "sub_mb": "mb-8",
            "chips_mb": "mb-8",
            "note_mt": "mt-4",
        },
        "editorial": {
            "max_w": "max-w-2xl",
            "section_py": "py-24",
            "section_py_cta": "py-20",
            "heading_size": "text-5xl sm:text-6xl",
            "sub_size": "text-lg",
            "stack_gap": "gap-6",
            "chip_wrap": "",
            "chip_cls": "",
            "cta_extra": "",
            "show_chips": False,
            "cta_style": "link",
            "eyebrow_mb": "mb-5",
            "heading_mb": "mb-5",
            "sub_mb": "mb-8",
            "chips_mb": "mb-8",
            "note_mt": "mt-5",
        },
        "clinic": {
            "max_w": "max-w-3xl",
            "section_py": "py-16",
            "section_py_cta": "py-12",
            "heading_size": "text-4xl sm:text-5xl",
            "sub_size": "text-base",
            "stack_gap": "gap-5",
            "chip_wrap": "flex flex-wrap items-center justify-center gap-3",
            "chip_cls": "rounded-xl bg-teal-50 px-4 py-1.5 text-sm text-teal-800 border border-teal-100",
            "cta_extra": "",
            "show_chips": True,
            "cta_style": "button",
            "eyebrow_mb": "mb-4",
            "heading_mb": "mb-4",
            "sub_mb": "mb-7",
            "chips_mb": "mb-7",
            "note_mt": "mt-3",
        },
    }
    c = cfg.get(family, cfg["saas"])

    # ── CTA Band variant ────────────────────────────────────────────────
    if variant == "cta_band":
        heading = content.get("ctaBandHeading", "")
        subheading = content.get("ctaBandSubheading", "")
        btn_text = content.get("ctaBandButtonText", "")
        dark_block = style.get("dark_block", "bg-slate-900 rounded-2xl")

        # saas uses slate-900 bg specifically
        if family == "saas":
            dark_block = "bg-slate-900 rounded-2xl"

        cta_py = c["section_py_cta"]

        # Build button / link for CTA band
        if family == "editorial":
            cta_html = (
                f'<a href="#" class="inline-block text-white underline underline-offset-4 '
                f'decoration-white/60 hover:decoration-white text-lg font-medium">'
                f'{esc(btn_text)}</a>'
            )
        else:
            cta_html = (
                f'<a href="#" class="{esc(style.get("primary_btn", ""))} {esc(c["cta_extra"])}">'
                f'{esc(btn_text)}</a>'
            )

        inner_gap = "gap-4" if family == "direct" else "gap-6"

        return (
            f'<section{sid}>\n'
            f'  <div class="{esc(dark_block)} {esc(cta_py)}">\n'
            f'    <div class="mx-auto {esc(c["max_w"])} px-6 lg:px-8 text-center">\n'
            f'      <div class="flex flex-col items-center {inner_gap}">\n'
            f'        <h2 class="text-3xl sm:text-4xl {esc(style.get("heading_weight", "font-bold"))} '
            f'{esc(style.get("heading_tracking", "tracking-tight"))} text-white">'
            f'{esc(heading)}</h2>\n'
            f'        <p class="text-white/80 {esc(c["sub_size"])} max-w-xl">'
            f'{esc(subheading)}</p>\n'
            f'        {cta_html}\n'
            f'      </div>\n'
            f'    </div>\n'
            f'  </div>\n'
            f'</section>'
        )

    # ── Hero variant ────────────────────────────────────────────────────
    eyebrow = content.get("heroEyebrow", "")
    heading = content.get("heroHeading", "")
    subheading = content.get("heroSubheading", "")
    trust_chips = content.get("heroTrustChips", [])
    cta_primary = content.get("heroCtaPrimary", "")
    cta_note = content.get("heroCtaNote", "")

    parts = []

    # Eyebrow
    if eyebrow:
        eyebrow_cls = style.get("eyebrow_style", "text-sm font-semibold uppercase tracking-widest text-slate-500")
        parts.append(
            f'      <div class="{esc(eyebrow_cls)} {c["eyebrow_mb"]}">{esc(eyebrow)}</div>'
        )

    # Heading
    if heading:
        parts.append(
            f'      <h1 class="{c["heading_size"]} {esc(style.get("heading_weight", "font-bold"))} '
            f'{esc(style.get("heading_tracking", "tracking-tight"))} '
            f'{esc(style.get("heading_color", "text-slate-950"))} {c["heading_mb"]}">'
            f'{esc(heading)}</h1>'
        )

    # Subheading
    if subheading:
        parts.append(
            f'      <p class="{c["sub_size"]} {esc(style.get("body_leading", "leading-7"))} '
            f'{esc(style.get("body_text", "text-slate-600"))} max-w-xl {c["sub_mb"]}">'
            f'{esc(subheading)}</p>'
        )

    # Trust chips
    if trust_chips:
        if family == "editorial":
            # Editorial: comma-separated text, no chips
            chip_text = ", ".join(esc(chip) for chip in trust_chips)
            parts.append(
                f'      <p class="{esc(style.get("muted_text", "text-stone-400"))} text-sm italic {c["chips_mb"]}">'
                f'{chip_text}</p>'
            )
        elif c["show_chips"]:
            chip_items = "\n".join(
                f'        <span class="{c["chip_cls"]}">{esc(chip)}</span>'
                for chip in trust_chips
            )
            parts.append(
                f'      <div class="{c["chip_wrap"]} {c["chips_mb"]}">\n'
                f'{chip_items}\n'
                f'      </div>'
            )

    # CTA button / link
    if cta_primary:
        if family == "editorial":
            parts.append(
                f'      <a href="#" class="inline-block text-base font-medium '
                f'{esc(style.get("heading_color", "text-slate-950"))} underline underline-offset-4 '
                f'decoration-current/40 hover:decoration-current">'
                f'{esc(cta_primary)}</a>'
            )
        else:
            btn_cls = style.get("primary_btn", "")
            parts.append(
                f'      <a href="#" class="{esc(btn_cls)} {c["cta_extra"]}">'
                f'{esc(cta_primary)}</a>'
            )

    # CTA note
    if cta_note:
        parts.append(
            f'      <p class="{esc(style.get("muted_text", "text-stone-400"))} text-sm {c["note_mt"]}">'
            f'{esc(cta_note)}</p>'
        )

    inner = "\n".join(parts)
    section_py = c["section_py"]

    return (
        f'<section{sid} class="{section_py}">\n'
        f'  <div class="mx-auto {c["max_w"]} px-6 lg:px-8 text-center">\n'
        f'    <div class="flex flex-col items-center {c["stack_gap"]}">\n'
        f'{inner}\n'
        f'    </div>\n'
        f'  </div>\n'
        f'</section>'
    )


def render_card_grid(content: dict, style: dict, section_id: str = "", variant: str = "services") -> str:
    family = style.get("family", "concierge")
    container = style.get("container", "mx-auto w-full max-w-7xl px-6 lg:px-8")
    section_py = style.get("section_py", "py-20")
    heading_size = style.get("heading_size", "text-4xl")
    heading_weight = style.get("heading_weight", "font-semibold")
    heading_tracking = style.get("heading_tracking", "tracking-tight")
    heading_color = style.get("heading_color", "text-stone-950")
    body_text = style.get("body_text", "text-stone-600")
    body_size = style.get("body_size", "text-base")
    body_leading = style.get("body_leading", "leading-8")
    muted_text = style.get("muted_text", "text-stone-400")
    eyebrow_style = style.get("eyebrow_style", "text-xs font-medium uppercase tracking-widest text-stone-400")
    card_border = style.get("card_border", "border border-stone-200")
    card_bg = style.get("card_bg", "bg-white")
    card_radius = style.get("card_radius", "rounded-2xl")
    card_shadow = style.get("card_shadow", "shadow-sm")
    card_padding = style.get("card_padding", "p-7")
    badge_style = style.get("badge_style", "")
    primary_color = style.get("primary_color", "#1e3a5f")
    accent_color = style.get("accent_color", "#f97316")
    gap = style.get("gap", "gap-8")
    gap_sm = style.get("gap_sm", "gap-4")
    check_marker = style.get("check_marker", '<svg class="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>')

    # --- Determine heading defaults per variant ---
    fallback_headings = {
        "services": "Our Services",
        "features": "Key Features",
        "team": "Meet Our Team",
        "pricing": "Pricing",
    }
    fallback_eyebrows = {
        "services": "Services",
        "features": "Features",
        "team": "Our Team",
        "pricing": "Plans",
    }

    heading_text = esc(content.get("sectionHeading", "") or content.get(f"{variant}Heading", "") or fallback_headings.get(variant, ""))
    subheading_text = esc(content.get("sectionSubheading", "") or content.get(f"{variant}Subheading", ""))
    eyebrow_text = esc(content.get("sectionEyebrow", "") or content.get(f"{variant}Eyebrow", "") or fallback_eyebrows.get(variant, ""))

    # --- Get items per variant ---
    if variant == "services":
        items = content.get("services", [])
    elif variant == "features":
        items = content.get("features", [])
    elif variant == "team":
        items = content.get("teamMembers", [])
    elif variant == "pricing":
        items = content.get("pricingPlans", [])
    else:
        items = []

    if not items:
        return ""

    # --- Section intro builder ---
    def build_intro(align="text-center", max_w="max-w-2xl mx-auto", mb="mb-14"):
        html = f'<div class="{align} {max_w} {mb}">'
        if eyebrow_text:
            html += f'<div class="{eyebrow_style} mb-3">{eyebrow_text}</div>'
        html += f'<h2 class="{heading_size} {heading_weight} {heading_tracking} {heading_color}">{heading_text}</h2>'
        if subheading_text:
            html += f'<p class="{body_size} {body_text} {body_leading} mt-4">{subheading_text}</p>'
        html += '</div>'
        return html

    # --- Badge builder for numbered cards ---
    def number_badge(idx, fam):
        num = str(idx + 1).zfill(2)
        if fam == "concierge":
            return (
                f'<span class="inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold text-rose-600 bg-rose-50 border border-rose-100">'
                f'{num}</span>'
            )
        if fam == "direct":
            return (
                f'<span class="inline-flex items-center justify-center w-8 h-8 rounded-md text-xs font-bold text-white bg-slate-800">'
                f'{num}</span>'
            )
        if fam == "saas":
            return (
                f'<span class="inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-semibold text-white bg-slate-900">'
                f'{num}</span>'
            )
        if fam == "editorial":
            return (
                f'<span class="inline-block text-xs font-normal uppercase tracking-widest {muted_text}">'
                f'{num}</span>'
            )
        if fam == "clinic":
            return (
                f'<span class="inline-flex items-center justify-center w-9 h-9 rounded-xl text-sm font-semibold text-teal-700 bg-teal-50 border border-teal-100">'
                f'{num}</span>'
            )
        return f'<span class="font-semibold text-sm {muted_text}">{num}</span>'

    # --- Build cards per family × variant ---
    id_attr = f' id="{esc(section_id)}"' if section_id else ""

    # =========================================================================
    #  CONCIERGE
    # =========================================================================
    if family == "concierge":
        intro = build_intro(mb="mb-12")

        if variant in ("services", "features"):
            grid = f'<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">'
            for i, item in enumerate(items):
                grid += (
                    f'<div class="{card_bg} {card_border} {card_radius} {card_shadow} {card_padding}">'
                    f'<div class="mb-4">{number_badge(i, family)}</div>'
                    f'<h3 class="text-lg font-semibold {heading_color} mb-2">{esc(item.get("title", ""))}</h3>'
                    f'<p class="{body_size} {body_text} {body_leading}">{esc(item.get("description", ""))}</p>'
                    f'</div>'
                )
            grid += '</div>'

        elif variant == "team":
            grid = f'<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">'
            for i, member in enumerate(items):
                grid += (
                    f'<div class="{card_bg} {card_border} {card_radius} {card_shadow} {card_padding} text-center">'
                    f'<div class="w-20 h-20 rounded-full bg-rose-50 border border-rose-100 mx-auto mb-5"></div>'
                    f'<h3 class="text-lg font-semibold {heading_color}">{esc(member.get("name", ""))}</h3>'
                    f'<p class="text-sm text-rose-500 font-medium mt-1">{esc(member.get("role", ""))}</p>'
                    f'<p class="{body_size} {body_text} mt-3">{esc(member.get("bio", ""))}</p>'
                    f'</div>'
                )
            grid += '</div>'

        elif variant == "pricing":
            cols = "lg:grid-cols-3" if len(items) >= 3 else "lg:grid-cols-2"
            grid = f'<div class="grid grid-cols-1 md:grid-cols-2 {cols} gap-7">'
            for i, plan in enumerate(items):
                features_html = ""
                for feat in plan.get("features", []):
                    features_html += f'<li class="flex items-start gap-2 {body_size} {body_text}">{check_marker}<span>{esc(feat)}</span></li>'
                grid += (
                    f'<div class="{card_bg} {card_border} {card_radius} {card_shadow} {card_padding}">'
                    f'<h3 class="text-lg font-semibold {heading_color}">{esc(plan.get("name", ""))}</h3>'
                    f'<div class="mt-3 mb-4"><span class="text-3xl font-bold {heading_color}">{esc(plan.get("price", ""))}</span></div>'
                    f'<p class="{body_size} {body_text} mb-5">{esc(plan.get("description", ""))}</p>'
                    f'<ul class="space-y-2.5">{features_html}</ul>'
                    f'</div>'
                )
            grid += '</div>'
        else:
            grid = ""

        return (
            f'<section{id_attr} class="{section_py}">'
            f'<div class="{container}">'
            f'{intro}{grid}'
            f'</div>'
            f'</section>'
        )

    # =========================================================================
    #  DIRECT
    # =========================================================================
    if family == "direct":
        intro = build_intro(mb="mb-10")

        if variant in ("services", "features"):
            grid = f'<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">'
            for i, item in enumerate(items):
                grid += (
                    f'<div class="{card_bg} {card_border} {card_radius} {card_shadow} {card_padding}">'
                    f'<div class="mb-3">{number_badge(i, family)}</div>'
                    f'<h3 class="text-sm font-bold {heading_color} mb-1.5">{esc(item.get("title", ""))}</h3>'
                    f'<p class="text-sm {body_text} leading-relaxed">{esc(item.get("description", ""))}</p>'
                    f'</div>'
                )
            grid += '</div>'

        elif variant == "team":
            grid = f'<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">'
            for i, member in enumerate(items):
                grid += (
                    f'<div class="{card_bg} {card_border} {card_radius} {card_shadow} {card_padding}">'
                    f'<div class="w-14 h-14 rounded-lg bg-slate-100 border border-slate-200 mb-3"></div>'
                    f'<h3 class="text-sm font-bold {heading_color}">{esc(member.get("name", ""))}</h3>'
                    f'<p class="text-xs font-bold text-slate-500 mt-0.5">{esc(member.get("role", ""))}</p>'
                    f'<p class="text-sm {body_text} mt-2 leading-relaxed">{esc(member.get("bio", ""))}</p>'
                    f'</div>'
                )
            grid += '</div>'

        elif variant == "pricing":
            cols = "lg:grid-cols-3" if len(items) >= 3 else "lg:grid-cols-2"
            grid = f'<div class="grid grid-cols-1 md:grid-cols-2 {cols} gap-3">'
            for i, plan in enumerate(items):
                features_html = ""
                for feat in plan.get("features", []):
                    features_html += f'<li class="flex items-start gap-2 text-sm {body_text}">{check_marker}<span>{esc(feat)}</span></li>'
                grid += (
                    f'<div class="{card_bg} {card_border} {card_radius} {card_shadow} {card_padding}">'
                    f'<h3 class="text-sm font-bold {heading_color}">{esc(plan.get("name", ""))}</h3>'
                    f'<div class="mt-2 mb-3"><span class="text-2xl font-bold {heading_color}">{esc(plan.get("price", ""))}</span></div>'
                    f'<p class="text-sm {body_text} mb-4">{esc(plan.get("description", ""))}</p>'
                    f'<ul class="space-y-2">{features_html}</ul>'
                    f'</div>'
                )
            grid += '</div>'
        else:
            grid = ""

        return (
            f'<section{id_attr} class="{section_py}">'
            f'<div class="{container}">'
            f'{intro}{grid}'
            f'</div>'
            f'</section>'
        )

    # =========================================================================
    #  SAAS
    # =========================================================================
    if family == "saas":
        intro = build_intro(mb="mb-12")

        if variant in ("services", "features"):
            grid = f'<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">'
            for i, item in enumerate(items):
                grid += (
                    f'<div class="{card_bg} {card_border} {card_radius} {card_shadow} {card_padding}">'
                    f'<div class="mb-4">{number_badge(i, family)}</div>'
                    f'<h3 class="text-base font-semibold {heading_color} mb-2">{esc(item.get("title", ""))}</h3>'
                    f'<p class="{body_size} {body_text} {body_leading}">{esc(item.get("description", ""))}</p>'
                    f'</div>'
                )
            grid += '</div>'

        elif variant == "team":
            grid = f'<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">'
            for i, member in enumerate(items):
                grid += (
                    f'<div class="{card_bg} {card_border} {card_radius} {card_shadow} {card_padding} text-center">'
                    f'<div class="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 mx-auto mb-4"></div>'
                    f'<h3 class="text-base font-semibold {heading_color}">{esc(member.get("name", ""))}</h3>'
                    f'<p class="text-sm text-slate-500 font-medium mt-1">{esc(member.get("role", ""))}</p>'
                    f'<p class="{body_size} {body_text} mt-3">{esc(member.get("bio", ""))}</p>'
                    f'</div>'
                )
            grid += '</div>'

        elif variant == "pricing":
            cols = "lg:grid-cols-3" if len(items) >= 3 else "lg:grid-cols-2"
            grid = f'<div class="grid grid-cols-1 md:grid-cols-2 {cols} gap-5">'
            for i, plan in enumerate(items):
                features_html = ""
                for feat in plan.get("features", []):
                    features_html += f'<li class="flex items-start gap-2 {body_size} {body_text}">{check_marker}<span>{esc(feat)}</span></li>'
                grid += (
                    f'<div class="{card_bg} {card_border} {card_radius} {card_shadow} {card_padding}">'
                    f'<h3 class="text-base font-semibold {heading_color}">{esc(plan.get("name", ""))}</h3>'
                    f'<div class="mt-3 mb-4"><span class="text-3xl font-bold {heading_color}">{esc(plan.get("price", ""))}</span></div>'
                    f'<p class="{body_size} {body_text} mb-5">{esc(plan.get("description", ""))}</p>'
                    f'<ul class="space-y-2">{features_html}</ul>'
                    f'</div>'
                )
            grid += '</div>'
        else:
            grid = ""

        return (
            f'<section{id_attr} class="{section_py}">'
            f'<div class="{container}">'
            f'{intro}{grid}'
            f'</div>'
            f'</section>'
        )

    # =========================================================================
    #  EDITORIAL — list layout with border-b separators for services/features
    # =========================================================================
    if family == "editorial":
        intro = build_intro(align="text-left", max_w="max-w-3xl", mb="mb-12")

        if variant in ("services", "features"):
            # List layout with border-b separators instead of card grid
            grid = '<div class="max-w-4xl">'
            for i, item in enumerate(items):
                border_class = "border-b border-stone-200" if i < len(items) - 1 else ""
                grid += (
                    f'<div class="py-8 {border_class}">'
                    f'<div class="flex items-start gap-6">'
                    f'<div class="flex-shrink-0 pt-1">{number_badge(i, family)}</div>'
                    f'<div>'
                    f'<h3 class="text-lg font-normal {heading_color} mb-2">{esc(item.get("title", ""))}</h3>'
                    f'<p class="{body_size} {body_text} {body_leading}">{esc(item.get("description", ""))}</p>'
                    f'</div>'
                    f'</div>'
                    f'</div>'
                )
            grid += '</div>'

        elif variant == "team":
            # Minimal cards for team
            grid = f'<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">'
            for i, member in enumerate(items):
                grid += (
                    f'<div class="text-left">'
                    f'<div class="w-full aspect-[4/3] bg-stone-100 mb-5"></div>'
                    f'<h3 class="text-base font-normal {heading_color}">{esc(member.get("name", ""))}</h3>'
                    f'<p class="text-sm {muted_text} mt-1">{esc(member.get("role", ""))}</p>'
                    f'<p class="{body_size} {body_text} mt-3">{esc(member.get("bio", ""))}</p>'
                    f'</div>'
                )
            grid += '</div>'

        elif variant == "pricing":
            # List layout for pricing too
            grid = '<div class="max-w-4xl">'
            for i, plan in enumerate(items):
                features_html = ""
                for feat in plan.get("features", []):
                    features_html += f'<li class="flex items-start gap-2 {body_size} {body_text}">{check_marker}<span>{esc(feat)}</span></li>'
                border_class = "border-b border-stone-200" if i < len(items) - 1 else ""
                grid += (
                    f'<div class="py-8 {border_class}">'
                    f'<div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">'
                    f'<div class="flex-1">'
                    f'<h3 class="text-lg font-normal {heading_color}">{esc(plan.get("name", ""))}</h3>'
                    f'<p class="{body_size} {body_text} mt-2">{esc(plan.get("description", ""))}</p>'
                    f'<ul class="space-y-2 mt-4">{features_html}</ul>'
                    f'</div>'
                    f'<div class="flex-shrink-0 md:text-right">'
                    f'<span class="text-2xl font-normal {heading_color}">{esc(plan.get("price", ""))}</span>'
                    f'</div>'
                    f'</div>'
                    f'</div>'
                )
            grid += '</div>'
        else:
            grid = ""

        return (
            f'<section{id_attr} class="{section_py}">'
            f'<div class="{container}">'
            f'{intro}{grid}'
            f'</div>'
            f'</section>'
        )

    # =========================================================================
    #  CLINIC
    # =========================================================================
    if family == "clinic":
        intro = build_intro(mb="mb-12")

        if variant in ("services", "features"):
            grid = f'<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">'
            for i, item in enumerate(items):
                grid += (
                    f'<div class="{card_bg} {card_border} {card_radius} {card_shadow} {card_padding}">'
                    f'<div class="mb-4">{number_badge(i, family)}</div>'
                    f'<h3 class="text-base font-semibold {heading_color} mb-2">{esc(item.get("title", ""))}</h3>'
                    f'<p class="{body_size} {body_text} {body_leading}">{esc(item.get("description", ""))}</p>'
                    f'</div>'
                )
            grid += '</div>'

        elif variant == "team":
            grid = f'<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">'
            for i, member in enumerate(items):
                grid += (
                    f'<div class="{card_bg} {card_border} {card_radius} {card_shadow} {card_padding} text-center">'
                    f'<div class="w-18 h-18 rounded-full bg-teal-50 border border-teal-100 mx-auto mb-4"></div>'
                    f'<h3 class="text-base font-semibold {heading_color}">{esc(member.get("name", ""))}</h3>'
                    f'<p class="text-sm text-teal-600 font-medium mt-1">{esc(member.get("role", ""))}</p>'
                    f'<p class="{body_size} {body_text} mt-3">{esc(member.get("bio", ""))}</p>'
                    f'</div>'
                )
            grid += '</div>'

        elif variant == "pricing":
            cols = "lg:grid-cols-3" if len(items) >= 3 else "lg:grid-cols-2"
            grid = f'<div class="grid grid-cols-1 md:grid-cols-2 {cols} gap-5">'
            for i, plan in enumerate(items):
                features_html = ""
                for feat in plan.get("features", []):
                    features_html += f'<li class="flex items-start gap-2 {body_size} {body_text}">{check_marker}<span>{esc(feat)}</span></li>'
                grid += (
                    f'<div class="{card_bg} {card_border} {card_radius} {card_shadow} {card_padding}">'
                    f'<h3 class="text-base font-semibold {heading_color}">{esc(plan.get("name", ""))}</h3>'
                    f'<div class="mt-3 mb-4"><span class="text-3xl font-bold {heading_color}">{esc(plan.get("price", ""))}</span></div>'
                    f'<p class="{body_size} {body_text} mb-5">{esc(plan.get("description", ""))}</p>'
                    f'<ul class="space-y-2.5">{features_html}</ul>'
                    f'</div>'
                )
            grid += '</div>'
        else:
            grid = ""

        return (
            f'<section{id_attr} class="{section_py}">'
            f'<div class="{container}">'
            f'{intro}{grid}'
            f'</div>'
            f'</section>'
        )

    # =========================================================================
    #  FALLBACK — uses style tokens directly
    # =========================================================================
    intro = build_intro(mb="mb-12")

    if variant in ("services", "features"):
        grid = f'<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 {gap}">'
        for i, item in enumerate(items):
            grid += (
                f'<div class="{card_bg} {card_border} {card_radius} {card_shadow} {card_padding}">'
                f'<div class="mb-4">{number_badge(i, family)}</div>'
                f'<h3 class="text-base font-semibold {heading_color} mb-2">{esc(item.get("title", ""))}</h3>'
                f'<p class="{body_size} {body_text} {body_leading}">{esc(item.get("description", ""))}</p>'
                f'</div>'
            )
        grid += '</div>'

    elif variant == "team":
        grid = f'<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 {gap}">'
        for i, member in enumerate(items):
            grid += (
                f'<div class="{card_bg} {card_border} {card_radius} {card_shadow} {card_padding} text-center">'
                f'<div class="w-16 h-16 rounded-full bg-stone-100 mx-auto mb-4"></div>'
                f'<h3 class="text-base font-semibold {heading_color}">{esc(member.get("name", ""))}</h3>'
                f'<p class="text-sm {muted_text} mt-1">{esc(member.get("role", ""))}</p>'
                f'<p class="{body_size} {body_text} mt-3">{esc(member.get("bio", ""))}</p>'
                f'</div>'
            )
        grid += '</div>'

    elif variant == "pricing":
        cols = "lg:grid-cols-3" if len(items) >= 3 else "lg:grid-cols-2"
        grid = f'<div class="grid grid-cols-1 md:grid-cols-2 {cols} {gap}">'
        for i, plan in enumerate(items):
            features_html = ""
            for feat in plan.get("features", []):
                features_html += f'<li class="flex items-start gap-2 {body_size} {body_text}">{check_marker}<span>{esc(feat)}</span></li>'
            grid += (
                f'<div class="{card_bg} {card_border} {card_radius} {card_shadow} {card_padding}">'
                f'<h3 class="text-base font-semibold {heading_color}">{esc(plan.get("name", ""))}</h3>'
                f'<div class="mt-3 mb-4"><span class="text-3xl font-bold {heading_color}">{esc(plan.get("price", ""))}</span></div>'
                f'<p class="{body_size} {body_text} mb-5">{esc(plan.get("description", ""))}</p>'
                f'<ul class="space-y-2">{features_html}</ul>'
                f'</div>'
            )
        grid += '</div>'
    else:
        grid = ""

    return (
        f'<section{id_attr} class="{section_py}">'
        f'<div class="{container}">'
        f'{intro}{grid}'
        f'</div>'
        f'</section>'
    )


def render_quote_block(content: dict, style: dict, section_id: str = "") -> str:
    """Renders a single featured testimonial / social-proof quote block."""

    testimonials = content.get("testimonials") or []
    if not testimonials:
        return ""

    t = testimonials[0]
    quote = esc(t.get("quote", ""))
    author = esc(t.get("author", ""))
    role = esc(t.get("role", ""))
    family = style.get("family", "concierge")
    container = style.get("container", "mx-auto w-full max-w-7xl px-6 lg:px-8")
    section_py_sm = style.get("section_py_sm", "py-14")
    sid = f' id="{esc(section_id)}"' if section_id else ""

    # ── concierge ─────────────────────────────────────────────
    if family == "concierge":
        inner = (
            f'<div class="bg-gradient-to-br from-rose-900 to-stone-900 rounded-[2rem] p-10 lg:p-14 text-center">'
            f'<blockquote class="mx-auto max-w-3xl">'
            f'<p class="text-2xl lg:text-3xl italic leading-relaxed text-white">'
            f'&ldquo;{quote}&rdquo;</p>'
            f'</blockquote>'
            f'<div class="mt-8">'
            f'<p class="text-white font-semibold text-lg">{author}</p>'
            f'<p class="text-white/60 text-sm mt-1">{role}</p>'
            f'</div>'
            f'</div>'
        )

    # ── direct ────────────────────────────────────────────────
    elif family == "direct":
        inner = (
            f'<div class="bg-slate-900 rounded-lg p-6 text-left">'
            f'<blockquote>'
            f'<p class="text-lg lg:text-xl font-bold leading-snug text-white">'
            f'&ldquo;{quote}&rdquo;</p>'
            f'</blockquote>'
            f'<div class="mt-5">'
            f'<p class="text-white font-semibold">{author}</p>'
            f'<p class="text-slate-400 text-sm mt-0.5">{role}</p>'
            f'</div>'
            f'</div>'
        )

    # ── saas ──────────────────────────────────────────────────
    elif family == "saas":
        stat_cards_html = ""
        hero_stats = content.get("heroStatCards") or []
        if hero_stats:
            cards = hero_stats[:2]
            stat_items = ""
            for sc in cards:
                sv = esc(sc.get("value", ""))
                sl = esc(sc.get("label", ""))
                stat_items += (
                    f'<div class="bg-white/5 rounded-xl px-6 py-4 text-center">'
                    f'<p class="text-2xl font-bold text-white">{sv}</p>'
                    f'<p class="text-slate-400 text-xs mt-1">{sl}</p>'
                    f'</div>'
                )
            stat_cards_html = (
                f'<div class="mt-8 flex flex-wrap justify-center gap-4">'
                f'{stat_items}'
                f'</div>'
            )

        inner = (
            f'<div class="bg-slate-950 rounded-2xl p-8 text-center">'
            f'<blockquote class="mx-auto max-w-3xl">'
            f'<p class="text-2xl lg:text-3xl leading-relaxed text-white">'
            f'&ldquo;{quote}&rdquo;</p>'
            f'</blockquote>'
            f'<div class="mt-6">'
            f'<p class="text-white font-semibold">{author}</p>'
            f'<p class="text-slate-500 text-sm mt-1">{role}</p>'
            f'</div>'
            f'{stat_cards_html}'
            f'</div>'
        )

    # ── editorial ─────────────────────────────────────────────
    elif family == "editorial":
        inner = (
            f'<div class="border-l-2 border-stone-300 pl-8 lg:pl-12 py-6">'
            f'<blockquote class="max-w-2xl">'
            f'<p class="text-2xl lg:text-3xl italic leading-relaxed text-stone-800">'
            f'&ldquo;{quote}&rdquo;</p>'
            f'</blockquote>'
            f'<div class="mt-8">'
            f'<p class="text-stone-900 font-medium">&mdash; {author}'
            f'<span class="text-stone-500 font-normal">, {role}</span></p>'
            f'</div>'
            f'</div>'
        )

    # ── clinic ────────────────────────────────────────────────
    elif family == "clinic":
        inner = (
            f'<div class="bg-teal-900 rounded-xl p-8 text-center">'
            f'<blockquote class="mx-auto max-w-3xl">'
            f'<p class="text-xl lg:text-2xl leading-relaxed text-white">'
            f'&ldquo;{quote}&rdquo;</p>'
            f'</blockquote>'
            f'<div class="mt-6">'
            f'<p class="text-white font-semibold">{author}</p>'
            f'<p class="text-teal-200/60 text-sm mt-1">{role}</p>'
            f'</div>'
            f'</div>'
        )

    # ── fallback ──────────────────────────────────────────────
    else:
        inner = (
            f'<div class="bg-stone-900 rounded-2xl p-8 text-center">'
            f'<blockquote class="mx-auto max-w-3xl">'
            f'<p class="text-2xl leading-relaxed text-white">'
            f'&ldquo;{quote}&rdquo;</p>'
            f'</blockquote>'
            f'<div class="mt-6">'
            f'<p class="text-white font-semibold">{author}</p>'
            f'<p class="text-white/60 text-sm mt-1">{role}</p>'
            f'</div>'
            f'</div>'
        )

    return (
        f'<section{sid} class="{esc(section_py_sm)}">'
        f'<div class="{esc(container)}">'
        f'{inner}'
        f'</div>'
        f'</section>'
    )


def render_quote_grid(content: dict, style: dict, section_id: str = "") -> str:
    """Renders a grid of testimonial cards, styled per family archetype."""

    testimonials = content.get("testimonials") or []
    if not testimonials:
        return ""

    family = style.get("family", "saas")
    sid = f' id="{esc(section_id)}"' if section_id else ""

    # Section heading
    heading_classes = f'{style["heading_size"]} {style["heading_weight"]} {style["heading_color"]} {style.get("heading_tracking", "")}'
    heading_html = f'<h2 class="{heading_classes.strip()}">What Our Clients Say</h2>'

    # ---------- editorial: stacked blockquotes, no card grid ----------
    if family == "editorial":
        items_html = []
        for i, t in enumerate(testimonials):
            border = 'border-b border-stone-200 pb-10 mb-10' if i < len(testimonials) - 1 else ''
            items_html.append(
                f'<div class="{border}">'
                f'<blockquote class="text-xl md:text-2xl italic {style["body_text"]} leading-relaxed mb-6">'
                f'\u201c{esc(t["quote"])}\u201d'
                f'</blockquote>'
                f'<p class="{style["heading_color"]} font-medium">'
                f'\u2014&nbsp;{esc(t["author"])}'
                f'<span class="{style["muted_text"]} font-normal ml-2">{esc(t["role"])}</span>'
                f'</p>'
                f'</div>'
            )
        return (
            f'<section{sid} class="{style["section_py"]}">'
            f'<div class="{style["container_narrow"]}">'
            f'<div class="mb-12 text-center">{heading_html}</div>'
            f'{"".join(items_html)}'
            f'</div>'
            f'</section>'
        )

    # ---------- card-based families ----------
    count = len(testimonials)
    # 2 cols on md; 3 cols on lg if 3+ items
    if count >= 3:
        grid_cols = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    else:
        grid_cols = "grid-cols-1 md:grid-cols-2"

    cards_html = []
    for t in testimonials:
        quote_text = esc(t["quote"])
        author = esc(t["author"])
        role = esc(t["role"])

        if family == "concierge":
            card_cls = "rounded-2xl border border-rose-100/60 bg-white shadow-[0_20px_50px_rgba(190,24,93,0.06)] p-6"
            quote_mark = '<span class="text-4xl leading-none text-rose-300 font-serif">\u201c</span>'
            quote_block = (
                f'{quote_mark}'
                f'<p class="{style["body_text"]} {style["body_size"]} {style["body_leading"]} mt-2">{quote_text}</p>'
            )
            author_block = (
                f'<div class="mt-5 pt-4 border-t border-rose-50">'
                f'<p class="{style["heading_color"]} font-medium">{author}</p>'
                f'<p class="{style["muted_text"]} text-sm">{role}</p>'
                f'</div>'
            )

        elif family == "direct":
            card_cls = "rounded-lg border border-slate-200 bg-white shadow-sm p-4"
            quote_block = (
                f'<p class="{style["body_text"]} {style["body_size"]} {style["body_leading"]}">{quote_text}</p>'
            )
            author_block = (
                f'<div class="mt-4 pt-3 border-t border-slate-100">'
                f'<p class="{style["heading_color"]} font-bold text-sm">{author}</p>'
                f'<p class="{style["muted_text"]} text-xs">{role}</p>'
                f'</div>'
            )

        elif family == "saas":
            card_cls = "rounded-xl border border-slate-200 bg-white shadow-sm p-5"
            quote_mark = '<span class="text-3xl leading-none text-slate-300 font-serif">\u201c</span>'
            quote_block = (
                f'{quote_mark}'
                f'<p class="{style["body_text"]} {style["body_size"]} {style["body_leading"]} mt-2">{quote_text}</p>'
            )
            author_block = (
                f'<div class="mt-5 pt-4 border-t border-slate-100">'
                f'<p class="{style["heading_color"]} font-medium text-sm">{author}</p>'
                f'<p class="{style["muted_text"]} text-sm">{role}</p>'
                f'</div>'
            )

        elif family == "clinic":
            card_cls = "rounded-xl border border-slate-200 bg-white shadow-sm p-5"
            quote_mark = '<span class="text-3xl leading-none text-teal-400 font-serif">\u201c</span>'
            quote_block = (
                f'{quote_mark}'
                f'<p class="{style["body_text"]} {style["body_size"]} {style["body_leading"]} mt-2">{quote_text}</p>'
            )
            author_block = (
                f'<div class="mt-5 pt-4 border-t border-slate-100">'
                f'<p class="{style["heading_color"]} font-medium text-sm">{author}</p>'
                f'<p class="{style["muted_text"]} text-sm">{role}</p>'
                f'</div>'
            )

        else:
            # fallback — same as saas
            card_cls = "rounded-xl border border-slate-200 bg-white shadow-sm p-5"
            quote_block = (
                f'<p class="{style["body_text"]} {style["body_size"]} {style["body_leading"]}">{quote_text}</p>'
            )
            author_block = (
                f'<div class="mt-5 pt-4 border-t border-slate-100">'
                f'<p class="{style["heading_color"]} font-medium text-sm">{author}</p>'
                f'<p class="{style["muted_text"]} text-sm">{role}</p>'
                f'</div>'
            )

        cards_html.append(
            f'<div class="{card_cls}">'
            f'{quote_block}'
            f'{author_block}'
            f'</div>'
        )

    return (
        f'<section{sid} class="{style["section_py"]}">'
        f'<div class="{style["container"]}">'
        f'<div class="text-center mb-12">{heading_html}</div>'
        f'<div class="grid {grid_cols} {style["gap"]}">'
        f'{"".join(cards_html)}'
        f'</div>'
        f'</div>'
        f'</section>'
    )


def render_stat_row(content: dict, style: dict, section_id: str = "") -> str:
    """Renders a row of statistics / trust indicators as a <section>."""

    stats = content.get("stats") or []
    if not stats:
        return ""

    family = style.get("family", "direct")
    container = style.get("container", "mx-auto w-full max-w-7xl px-6 lg:px-8")
    section_py_sm = style.get("section_py_sm", "py-14")
    heading_size = style.get("heading_size", "text-3xl")
    heading_weight = style.get("heading_weight", "font-bold")
    heading_tracking = style.get("heading_tracking", "tracking-tight")
    heading_color = style.get("heading_color", "text-stone-950")

    # Optional section heading
    section_heading = content.get("statsHeading") or content.get("sectionHeading") or ""
    heading_html = ""
    if section_heading:
        heading_html = (
            f'<h2 class="{esc(heading_size)} {esc(heading_weight)} '
            f'{esc(heading_tracking)} {esc(heading_color)} text-center mb-12">'
            f'{esc(section_heading)}</h2>\n'
        )

    # Build stat items per family
    items_html = []

    for stat in stats:
        value = esc(stat.get("value", ""))
        label = esc(stat.get("label", ""))

        if family == "concierge":
            item = (
                f'<div class="rounded-2xl bg-rose-50/60 p-6 shadow-sm text-center">'
                f'<div class="text-3xl font-semibold text-stone-900 mb-1">{value}</div>'
                f'<div class="text-sm text-stone-500">{label}</div>'
                f'</div>'
            )

        elif family == "direct":
            item = (
                f'<div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm text-center">'
                f'<div class="text-2xl font-bold text-slate-950 mb-1">{value}</div>'
                f'<div class="text-xs text-slate-500">{label}</div>'
                f'</div>'
            )

        elif family == "saas":
            item = (
                f'<div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm text-center">'
                f'<div class="text-3xl font-bold text-slate-900 mb-1">{value}</div>'
                f'<div class="text-sm text-slate-500">{label}</div>'
                f'</div>'
            )

        elif family == "editorial":
            item = (
                f'<div class="border-l-2 border-stone-300 pl-4">'
                f'<div class="text-3xl font-light text-stone-900 mb-1">{value}</div>'
                f'<div class="text-xs text-stone-400 uppercase tracking-wide">{label}</div>'
                f'</div>'
            )

        elif family == "clinic":
            item = (
                f'<div class="rounded-xl border border-teal-100 bg-white p-5 shadow-md text-center">'
                f'<div class="text-3xl font-semibold text-slate-800 mb-1">{value}</div>'
                f'<div class="text-sm text-slate-600">{label}</div>'
                f'</div>'
            )

        else:
            # Fallback to direct style
            item = (
                f'<div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm text-center">'
                f'<div class="text-2xl font-bold text-slate-950 mb-1">{value}</div>'
                f'<div class="text-xs text-slate-500">{label}</div>'
                f'</div>'
            )

        items_html.append(item)

    grid_classes = "grid grid-cols-2 lg:grid-cols-4 gap-4"
    if family == "editorial":
        grid_classes = "grid grid-cols-2 lg:grid-cols-4 gap-8"

    sid = f' id="{esc(section_id)}"' if section_id else ""

    return (
        f'<section{sid} class="{esc(section_py_sm)}">'
        f'<div class="{esc(container)}">'
        f'{heading_html}'
        f'<div class="{grid_classes}">'
        + "\n".join(items_html)
        + '</div>'
        f'</div>'
        f'</section>'
    )


def render_step_sequence(content: dict, style: dict, section_id: str = "") -> str:
    """Renders a numbered step/process sequence as a <section>."""

    steps = content.get("steps") or []
    if not steps:
        return ""

    family = style.get("family", "direct")
    container = style.get("container", "mx-auto w-full max-w-7xl px-6 lg:px-8")
    section_py = style.get("section_py", "py-20")
    heading_size = style.get("heading_size", "text-3xl")
    heading_weight = style.get("heading_weight", "font-bold")
    heading_tracking = style.get("heading_tracking", "tracking-tight")
    heading_color = style.get("heading_color", "text-stone-950")
    body_text = style.get("body_text", "text-stone-600")
    body_size = style.get("body_size", "text-base")

    # Section intro
    section_heading = content.get("stepsHeading") or content.get("sectionHeading") or "How It Works"
    section_sub = content.get("stepsSubheading") or content.get("sectionSubheading") or ""

    intro_html = (
        f'<div class="text-center mb-14">'
        f'<h2 class="{esc(heading_size)} {esc(heading_weight)} '
        f'{esc(heading_tracking)} {esc(heading_color)}">'
        f'{esc(section_heading)}</h2>'
    )
    if section_sub:
        intro_html += (
            f'<p class="{esc(body_text)} {esc(body_size)} mt-4 max-w-2xl mx-auto">'
            f'{esc(section_sub)}</p>'
        )
    intro_html += '</div>'

    # Build step items per family
    items_html = []

    for i, step in enumerate(steps):
        num = esc(step.get("step", str(i + 1)))
        title = esc(step.get("title", ""))
        desc = esc(step.get("description", ""))

        if family == "concierge":
            item = (
                f'<div class="rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(190,24,93,0.06)] text-center">'
                f'<div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 text-lg font-semibold">{num}</div>'
                f'<h3 class="text-lg font-semibold text-stone-900 mb-2">{title}</h3>'
                f'<p class="text-sm text-stone-500 leading-relaxed">{desc}</p>'
                f'</div>'
            )

        elif family == "direct":
            item = (
                f'<div class="flex items-start gap-3">'
                f'<div class="flex-none flex h-8 w-8 items-center justify-center rounded-md bg-slate-800 text-white text-sm font-bold">{num}</div>'
                f'<div>'
                f'<h3 class="text-base font-semibold text-slate-950">{title}</h3>'
                f'<p class="text-sm text-slate-500 mt-0.5 leading-snug">{desc}</p>'
                f'</div>'
                f'</div>'
            )

        elif family == "saas":
            item = (
                f'<div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">'
                f'<div class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white text-sm font-bold">{num}</div>'
                f'<h3 class="text-base font-semibold text-slate-900 mb-2">{title}</h3>'
                f'<p class="text-sm text-slate-500 leading-relaxed">{desc}</p>'
                f'</div>'
            )

        elif family == "editorial":
            item = (
                f'<div class="grid grid-cols-[0.3fr_1fr] gap-6 border-t border-stone-200 py-8">'
                f'<div class="text-xs font-medium uppercase tracking-widest text-stone-400">Step {num}</div>'
                f'<div>'
                f'<h3 class="text-lg font-medium text-stone-900 mb-1">{title}</h3>'
                f'<p class="text-base text-stone-500 leading-relaxed">{desc}</p>'
                f'</div>'
                f'</div>'
            )

        elif family == "clinic":
            item = (
                f'<div class="rounded-xl bg-white p-5 shadow-md">'
                f'<div class="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-700 text-sm font-bold">{num}</div>'
                f'<h3 class="text-base font-semibold text-slate-800 mb-2">{title}</h3>'
                f'<p class="text-sm text-slate-600 leading-relaxed">{desc}</p>'
                f'</div>'
            )

        else:
            # Fallback to direct style
            item = (
                f'<div class="flex items-start gap-3">'
                f'<div class="flex-none flex h-8 w-8 items-center justify-center rounded-md bg-slate-800 text-white text-sm font-bold">{num}</div>'
                f'<div>'
                f'<h3 class="text-base font-semibold text-slate-950">{title}</h3>'
                f'<p class="text-sm text-slate-500 mt-0.5 leading-snug">{desc}</p>'
                f'</div>'
                f'</div>'
            )

        items_html.append(item)

    # Layout wrapper depends on family
    if family in ("concierge", "saas", "clinic"):
        # Horizontal card grid
        grid_html = (
            f'<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">'
            + "\n".join(items_html)
            + '</div>'
        )
    elif family == "direct":
        # Vertical stacked list with tight spacing
        grid_html = (
            f'<div class="flex flex-col gap-4 max-w-2xl mx-auto">'
            + "\n".join(items_html)
            + '</div>'
        )
    elif family == "editorial":
        # Vertical stacked rows (borders built into items)
        grid_html = (
            f'<div class="max-w-3xl mx-auto">'
            + "\n".join(items_html)
            + '</div>'
        )
    else:
        grid_html = (
            f'<div class="flex flex-col gap-4 max-w-2xl mx-auto">'
            + "\n".join(items_html)
            + '</div>'
        )

    sid = f' id="{esc(section_id)}"' if section_id else ""

    return (
        f'<section{sid} class="{esc(section_py)}">'
        f'<div class="{esc(container)}">'
        f'{intro_html}'
        f'{grid_html}'
        f'</div>'
        f'</section>'
    )


def render_accordion(content: dict, style: dict, section_id: str = "") -> str:
    """Renders a FAQ accordion section with <details>/<summary> elements."""

    items = content.get("faqItems", [])
    if not items:
        return ""

    family = style.get("family", "saas")

    # --- Section heading tokens ---
    heading_size = style.get("heading_size", "text-4xl")
    heading_weight = style.get("heading_weight", "font-semibold")
    heading_tracking = style.get("heading_tracking", "tracking-tight")
    heading_color = style.get("heading_color", "text-stone-950")
    body_text = style.get("body_text", "text-stone-600")
    section_py = style.get("section_py", "py-20")
    container = style.get("container_narrow", style.get("container", "mx-auto w-full max-w-3xl px-6 lg:px-8"))

    # --- Per-family detail styling ---
    if family == "concierge":
        detail_cls = "rounded-2xl border border-rose-100/60 bg-white shadow-[0_2px_12px_rgba(190,24,93,0.05)] p-5"
        summary_cls = "cursor-pointer list-none font-semibold text-stone-900"
        answer_cls = f"mt-3 {body_text} text-base leading-7"
        stack_gap = "gap-4"
    elif family == "direct":
        detail_cls = "rounded-lg border border-slate-200 bg-white shadow-sm p-3.5"
        summary_cls = "cursor-pointer list-none font-bold text-sm text-slate-900"
        answer_cls = f"mt-3 {body_text} text-sm leading-6"
        stack_gap = "gap-2"
    elif family == "editorial":
        detail_cls = "border-b border-stone-200 py-5"
        summary_cls = "cursor-pointer list-none text-base font-semibold tracking-tight text-stone-900"
        answer_cls = f"mt-4 max-w-2xl text-sm leading-[1.85] {body_text}"
        stack_gap = "gap-0"
    elif family == "clinic":
        detail_cls = "rounded-xl border border-slate-200 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5"
        summary_cls = "cursor-pointer list-none font-semibold text-slate-900"
        answer_cls = f"mt-3 {body_text} text-base leading-7"
        stack_gap = "gap-3"
    else:  # saas (default)
        detail_cls = "rounded-xl border border-slate-200 bg-white shadow-[0_1px_6px_rgba(0,0,0,0.04)] p-5"
        summary_cls = "cursor-pointer list-none font-semibold text-slate-900"
        answer_cls = f"mt-3 {body_text} text-base leading-7"
        stack_gap = "gap-3"

    # --- Build items HTML ---
    items_html = []
    for item in items:
        q = esc(item.get("question", ""))
        a = esc(item.get("answer", ""))
        items_html.append(
            f'<details class="{detail_cls}">\n'
            f'  <summary class="{summary_cls}">{q}</summary>\n'
            f'  <p class="{answer_cls}">{a}</p>\n'
            f'</details>'
        )

    details_block = "\n".join(items_html)

    sid = f' id="{esc(section_id)}"' if section_id else ""

    return (
        f'<section{sid} class="{section_py}">\n'
        f'  <div class="{container}">\n'
        f'    <div class="mx-auto max-w-3xl">\n'
        f'      <h2 class="{heading_size} {heading_weight} {heading_tracking} {heading_color} text-center mb-10">Frequently Asked Questions</h2>\n'
        f'      <div class="flex flex-col {stack_gap}">\n'
        f'        {details_block}\n'
        f'      </div>\n'
        f'    </div>\n'
        f'  </div>\n'
        f'</section>'
    )


def render_form_panel(content: dict, style: dict, section_id: str = "") -> str:
    """Renders a two-column contact form section with heading/details on left, form on right."""

    family = style.get("family", "direct")
    heading = esc(content.get("contactHeading", "Get in Touch"))
    subheading = esc(content.get("contactSubheading", ""))
    details = content.get("contactDetails", [])
    marker = style.get("check_marker", style.get("bullet_marker", "&#x2022;"))

    # --- Left column: heading + subheading + contact details ---
    details_html = ""
    if details:
        items = "".join(
            f'<li class="flex items-start gap-3">'
            f'<span class="shrink-0 mt-0.5">{marker}</span>'
            f'<span class="{esc(style.get("body_text", "text-stone-600"))} {esc(style.get("body_size", "text-base"))}">{esc(d)}</span>'
            f'</li>'
            for d in details
        )
        details_html = f'<ul class="mt-8 space-y-4">{items}</ul>'

    left_col = (
        f'<div class="flex flex-col justify-center">'
        f'<h2 class="{esc(style.get("heading_size", "text-4xl"))} {esc(style.get("heading_weight", "font-semibold"))} '
        f'{esc(style.get("heading_tracking", "tracking-tight"))} {esc(style.get("heading_color", "text-stone-950"))}">'
        f'{heading}</h2>'
    )
    if subheading:
        left_col += (
            f'<p class="mt-4 {esc(style.get("body_text", "text-stone-600"))} '
            f'{esc(style.get("body_size", "text-base"))} {esc(style.get("body_leading", "leading-7"))}">'
            f'{subheading}</p>'
        )
    left_col += details_html + '</div>'

    # --- Right column: form panel per family ---
    accent = esc(style.get("accent_color", "#f97316"))
    primary = esc(style.get("primary_color", "#1e3a5f"))

    if family == "concierge":
        panel_cls = "rounded-2xl border border-rose-100/60 bg-white shadow-[0_20px_50px_rgba(190,24,93,0.06)] p-7"
        input_cls = "w-full px-4 py-2.5 text-sm outline-none rounded-xl border border-rose-100 focus:border-rose-300 transition"
        textarea_cls = input_cls
        field_gap = "gap-4"
        submit = (
            f'<button type="submit" class="w-full py-2.5 px-6 text-sm font-medium text-white rounded-xl transition hover:opacity-90" '
            f'style="background-color:{accent}">Send Message</button>'
        )

    elif family == "direct":
        panel_cls = "rounded-lg border border-slate-200 bg-white shadow-sm p-4"
        input_cls = "w-full px-4 py-2 text-sm outline-none rounded-md border border-slate-300 focus:border-slate-500 transition"
        textarea_cls = input_cls
        field_gap = "gap-3"
        submit = (
            f'<button type="submit" class="w-full py-2 px-6 text-sm font-semibold text-white rounded-md transition hover:opacity-90" '
            f'style="background-color:{primary}">Send Message</button>'
        )

    elif family == "saas":
        panel_cls = "rounded-xl border border-slate-200 bg-slate-50 shadow-sm p-6"
        input_cls = "w-full px-4 py-2.5 text-sm outline-none rounded-lg border border-slate-200 bg-white focus:border-slate-400 transition"
        textarea_cls = input_cls
        field_gap = "gap-4"
        submit = (
            '<button type="submit" class="w-full py-2.5 px-6 text-sm font-medium text-white bg-slate-900 rounded-lg transition hover:bg-slate-800">'
            'Send Message</button>'
        )

    elif family == "editorial":
        panel_cls = "p-0"
        input_cls = "w-full px-0 py-2.5 text-sm outline-none border-0 border-b border-stone-200 bg-transparent focus:border-stone-400 transition"
        textarea_cls = input_cls
        field_gap = "gap-6"
        submit = (
            '<button type="submit" class="inline-block text-sm font-medium text-stone-900 underline underline-offset-4 '
            'decoration-stone-400 hover:decoration-stone-900 transition mt-2">Send Message</button>'
        )

    else:  # clinic
        panel_cls = "rounded-xl border border-slate-200 bg-white shadow-sm p-6"
        input_cls = "w-full px-4 py-2.5 text-sm outline-none rounded-lg border border-slate-200 focus:border-teal-400 transition"
        textarea_cls = input_cls
        field_gap = "gap-4"
        submit = (
            '<button type="submit" class="w-full py-2.5 px-6 text-sm font-medium text-white bg-teal-600 rounded-lg transition hover:bg-teal-700">'
            'Send Message</button>'
        )

    # Build form fields
    form_html = (
        f'<div class="{esc(panel_cls)}">'
        f'<form onsubmit="return false;" class="flex flex-col {esc(field_gap)}">'
        f'<div>'
        f'<label class="block text-xs font-medium {esc(style.get("muted_text", "text-stone-400"))} mb-1">Name</label>'
        f'<input type="text" placeholder="Your name" class="{esc(input_cls)}" />'
        f'</div>'
        f'<div>'
        f'<label class="block text-xs font-medium {esc(style.get("muted_text", "text-stone-400"))} mb-1">Email</label>'
        f'<input type="email" placeholder="you@example.com" class="{esc(input_cls)}" />'
        f'</div>'
        f'<div>'
        f'<label class="block text-xs font-medium {esc(style.get("muted_text", "text-stone-400"))} mb-1">Phone</label>'
        f'<input type="tel" placeholder="(555) 123-4567" class="{esc(input_cls)}" />'
        f'</div>'
        f'<div>'
        f'<label class="block text-xs font-medium {esc(style.get("muted_text", "text-stone-400"))} mb-1">Message</label>'
        f'<textarea rows="4" placeholder="How can we help?" class="{esc(textarea_cls)}"></textarea>'
        f'</div>'
        f'<div>{submit}</div>'
        f'</form>'
        f'</div>'
    )

    # --- Assemble section ---
    sid = f' id="{esc(section_id)}"' if section_id else ""
    section_py = esc(style.get("section_py", "py-20"))
    container = esc(style.get("container", "mx-auto w-full max-w-7xl px-6 lg:px-8"))

    return (
        f'<section{sid} class="{section_py}">'
        f'<div class="{container}">'
        f'<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">'
        f'{left_col}'
        f'{form_html}'
        f'</div>'
        f'</div>'
        f'</section>'
    )


def render_list_strip(content: dict, style: dict, section_id: str = "") -> str:
    """Renders a compact list/chip strip section for service areas, tags, coverage zones, etc."""

    items = content.get("serviceAreas", [])
    if not items:
        return ""

    heading = esc(content.get("serviceAreaHeading", "Areas We Serve"))
    family = style.get("family", "direct")
    section_py = style.get("section_py_sm", "py-10")
    container = style.get("container", "mx-auto w-full max-w-7xl px-6 lg:px-8")
    sid = f' id="{esc(section_id)}"' if section_id else ""

    # Heading classes per family
    if family == "concierge":
        heading_cls = "text-lg font-semibold text-stone-800 tracking-tight"
    elif family == "editorial":
        heading_cls = "text-sm font-medium uppercase tracking-widest text-stone-400"
    elif family == "clinic":
        heading_cls = "text-base font-semibold text-slate-800"
    elif family == "saas":
        heading_cls = "text-sm font-semibold uppercase tracking-wide text-slate-500"
    else:  # direct
        heading_cls = "text-xs font-bold uppercase tracking-wider text-slate-500"

    # Build the items markup per family
    if family == "editorial":
        # No chips — comma-separated inline text or minimal grid
        escaped = [esc(item) for item in items]
        items_html = (
            f'<p class="text-sm text-stone-500 leading-relaxed">'
            f'{", ".join(escaped)}'
            f'</p>'
        )
    else:
        # Chip styling per family
        if family == "concierge":
            chip_cls = (
                "inline-flex items-center rounded-full bg-white/70 backdrop-blur "
                "border border-rose-100/60 text-sm font-medium text-stone-700 "
                "shadow-sm px-4 py-1.5"
            )
            flex_cls = "flex flex-wrap gap-3"
        elif family == "saas":
            chip_cls = (
                "inline-flex items-center rounded-full border border-slate-200 "
                "bg-white text-sm font-medium text-slate-600 shadow-sm px-4 py-2"
            )
            flex_cls = "flex flex-wrap gap-2.5"
        elif family == "clinic":
            chip_cls = (
                "inline-flex items-center rounded-xl border border-slate-200 "
                "bg-white text-sm font-medium text-slate-700 shadow-sm px-4 py-2"
            )
            flex_cls = "flex flex-wrap gap-2.5"
        else:  # direct
            chip_cls = (
                "inline-flex items-center rounded-md bg-slate-100 border "
                "border-slate-200 text-xs font-bold text-slate-700 px-3 py-1.5"
            )
            flex_cls = "flex flex-wrap gap-2"

        chips = "\n".join(
            f'        <span class="{chip_cls}">{esc(item)}</span>'
            for item in items
        )
        items_html = f'<div class="{flex_cls}">\n{chips}\n      </div>'

    return (
        f'<section{sid} class="{section_py}">\n'
        f'  <div class="{container}">\n'
        f'    <h2 class="{heading_cls} mb-4">{heading}</h2>\n'
        f'    {items_html}\n'
        f'  </div>\n'
        f'</section>'
    )


def render_fullbleed_media(content: dict, style: dict, section_id: str = "") -> str:
    """Renders a full-width visual-first hero with background placeholder and text overlay at bottom-left."""

    family = style.get("family", "saas")
    sid = f' id="{esc(section_id)}"' if section_id else ""

    # ── Family-specific configuration ────────────────────────────────────
    cfg = {
        "concierge": {
            "aspect": "aspect-[16/8]",
            "bg_gradient": "bg-gradient-to-br from-rose-50 to-orange-50",
            "overlay": "bg-gradient-to-t from-rose-50/95 via-rose-50/60 to-transparent",
            "icon_color": "text-rose-300/50",
            "text_max_w": "max-w-lg",
            "text_padding": "p-8 pb-10",
            "heading_size": "text-3xl sm:text-4xl",
            "sub_size": "text-base",
            "eyebrow_cls": "text-sm font-medium uppercase tracking-widest text-rose-400",
            "heading_color": "text-stone-900",
            "sub_color": "text-stone-600",
            "cta_style": "button",
            "cta_cls": "inline-block rounded-full bg-rose-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-300/40 hover:bg-rose-700 transition-colors",
            "extra_el": "",
        },
        "direct": {
            "aspect": "aspect-[16/6]",
            "bg_gradient": "bg-gradient-to-br from-slate-100 to-slate-200",
            "overlay": "bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent",
            "icon_color": "text-slate-400/40",
            "text_max_w": "max-w-md",
            "text_padding": "p-6 pb-8",
            "heading_size": "text-2xl sm:text-3xl",
            "sub_size": "text-sm",
            "eyebrow_cls": "text-xs font-bold uppercase tracking-widest text-slate-300",
            "heading_color": "text-white",
            "sub_color": "text-slate-200",
            "cta_style": "button",
            "cta_cls": "inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition-colors",
            "extra_el": "",
        },
        "saas": {
            "aspect": "aspect-[16/7]",
            "bg_gradient": "bg-gradient-to-br from-slate-200 via-slate-100 to-blue-50",
            "overlay": "bg-gradient-to-t from-slate-900/75 via-slate-900/35 to-transparent",
            "icon_color": "text-slate-400/40",
            "text_max_w": "max-w-lg",
            "text_padding": "p-8 pb-10",
            "heading_size": "text-3xl sm:text-4xl",
            "sub_size": "text-base",
            "eyebrow_cls": "text-xs font-semibold uppercase tracking-widest text-blue-300",
            "heading_color": "text-white",
            "sub_color": "text-slate-200",
            "cta_style": "button",
            "cta_cls": "inline-block rounded-lg bg-blue-600 px-7 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors",
            "extra_el": (
                '<div class="absolute top-6 right-6 w-48 h-28 rounded-xl border border-white/10 '
                'bg-white/5 backdrop-blur-sm flex items-center justify-center">'
                '<div class="w-20 h-3 rounded-full bg-blue-400/30"></div></div>'
            ),
        },
        "editorial": {
            "aspect": "aspect-[16/7]",
            "bg_gradient": "bg-gradient-to-br from-stone-200 to-stone-100",
            "overlay": "bg-gradient-to-t from-stone-100/90 via-stone-100/40 to-transparent",
            "icon_color": "text-stone-400/40",
            "text_max_w": "max-w-xl",
            "text_padding": "p-8 pb-12",
            "heading_size": "text-3xl sm:text-4xl",
            "sub_size": "text-lg",
            "eyebrow_cls": "text-sm font-medium uppercase tracking-widest text-stone-400",
            "heading_color": "text-stone-900",
            "sub_color": "text-stone-600",
            "cta_style": "link",
            "cta_cls": "inline-block text-base font-medium text-stone-900 underline underline-offset-4 decoration-stone-400/60 hover:decoration-stone-900 transition-colors",
            "extra_el": "",
        },
        "clinic": {
            "aspect": "aspect-[16/7]",
            "bg_gradient": "bg-gradient-to-br from-teal-50 to-white",
            "overlay": "bg-gradient-to-t from-white/90 via-white/40 to-transparent",
            "icon_color": "text-teal-300/40",
            "text_max_w": "max-w-lg",
            "text_padding": "p-8 pb-10",
            "heading_size": "text-3xl sm:text-4xl",
            "sub_size": "text-base",
            "eyebrow_cls": "text-xs font-semibold uppercase tracking-widest text-teal-500",
            "heading_color": "text-teal-950",
            "sub_color": "text-teal-700",
            "cta_style": "button",
            "cta_cls": "inline-block rounded-xl bg-teal-600 px-7 py-3 text-sm font-semibold text-white hover:bg-teal-700 transition-colors",
            "extra_el": "",
        },
    }
    c = cfg.get(family, cfg["saas"])

    # ── Content fields ───────────────────────────────────────────────────
    eyebrow = content.get("heroEyebrow", "")
    heading = content.get("heroHeading", "")
    subheading = content.get("heroSubheading", "")
    cta_primary = content.get("heroCtaPrimary", "")

    # ── SVG camera/image placeholder icon ────────────────────────────────
    svg_icon = (
        f'<svg class="{c["icon_color"]} w-20 h-20" xmlns="http://www.w3.org/2000/svg" '
        f'fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor">'
        f'<path stroke-linecap="round" stroke-linejoin="round" '
        f'd="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 '
        f'7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 '
        f'21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 '
        f'2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 '
        f'48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />'
        f'<path stroke-linecap="round" stroke-linejoin="round" '
        f'd="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />'
        f'</svg>'
    )

    # ── Build text overlay parts ─────────────────────────────────────────
    text_parts = []

    if eyebrow:
        text_parts.append(
            f'        <div class="{c["eyebrow_cls"]} mb-3">{esc(eyebrow)}</div>'
        )

    if heading:
        text_parts.append(
            f'        <h1 class="{c["heading_size"]} {esc(style.get("heading_weight", "font-bold"))} '
            f'{esc(style.get("heading_tracking", "tracking-tight"))} '
            f'{c["heading_color"]} mb-3">{esc(heading)}</h1>'
        )

    if subheading:
        text_parts.append(
            f'        <p class="{c["sub_size"]} {c["sub_color"]} leading-relaxed mb-5">'
            f'{esc(subheading)}</p>'
        )

    if cta_primary:
        text_parts.append(
            f'        <a href="#" class="{c["cta_cls"]}">{esc(cta_primary)}</a>'
        )

    text_inner = "\n".join(text_parts)

    # ── Optional extra floating element (saas) ───────────────────────────
    extra_html = f'\n      {c["extra_el"]}' if c["extra_el"] else ""

    # ── Assemble ─────────────────────────────────────────────────────────
    return (
        f'<section{sid} class="relative overflow-hidden">\n'
        f'  <!-- Full-bleed background area -->\n'
        f'  <div class="relative {c["aspect"]} w-full {c["bg_gradient"]}">\n'
        f'    <!-- Centered image placeholder icon -->\n'
        f'    <div class="absolute inset-0 flex items-center justify-center">\n'
        f'      {svg_icon}\n'
        f'    </div>\n'
        f'    <!-- Gradient overlay from bottom -->\n'
        f'    <div class="absolute inset-0 {c["overlay"]}"></div>{extra_html}\n'
        f'    <!-- Text overlay at bottom-left -->\n'
        f'    <div class="absolute inset-x-0 bottom-0">\n'
        f'      <div class="{c["text_max_w"]} {c["text_padding"]}">\n'
        f'{text_inner}\n'
        f'      </div>\n'
        f'    </div>\n'
        f'  </div>\n'
        f'</section>'
    )


def render_footer_columns(content: dict, style: dict) -> str:
    family = style.get("family", "saas")
    section_py_sm = style.get("section_py_sm", "py-10")
    container = style.get("container", "mx-auto w-full max-w-7xl px-6 lg:px-8")

    site_name = esc(content.get("siteName", ""))
    tagline = esc(content.get("footerTagline", ""))
    year = esc(content.get("copyrightYear", "2026"))
    columns = content.get("footerColumns", [])

    # --- Per-family styles ---
    if family == "concierge":
        wrapper_cls = "rounded-[2rem] bg-[#24161d] text-[#fff7f6] p-8 lg:p-10"
        name_cls = "text-2xl font-semibold"
        tagline_cls = "mt-2 text-sm text-white/60 leading-relaxed"
        title_cls = "uppercase tracking-wide text-white/50 text-sm font-medium mb-3"
        link_cls = "text-white/70 hover:text-white transition-colors text-sm"
        copyright_cls = "mt-10 text-white/40 text-sm"
    elif family == "direct":
        wrapper_cls = "rounded-lg bg-slate-900 text-white p-5 lg:p-6"
        name_cls = "text-lg font-bold"
        tagline_cls = "mt-2 text-xs text-white/50 leading-relaxed"
        title_cls = "text-xs font-bold uppercase text-white/50 mb-3"
        link_cls = "text-xs text-white/60 hover:text-white transition-colors"
        copyright_cls = "mt-6 text-xs text-white/40"
    elif family == "editorial":
        wrapper_cls = "rounded-xl bg-[#1f1812] text-[#f9f4ea] p-8 lg:p-10"
        name_cls = "text-xl font-semibold"
        tagline_cls = "mt-2 text-sm text-white/50 leading-relaxed"
        title_cls = "text-xs uppercase tracking-[0.18em] text-white/40 font-medium mb-3"
        link_cls = "text-sm text-white/60 hover:text-white transition-colors"
        copyright_cls = "mt-10 text-xs text-white/30"
    elif family == "clinic":
        wrapper_cls = "rounded-xl bg-slate-900 text-white p-8"
        name_cls = "text-lg font-semibold"
        tagline_cls = "mt-2 text-sm text-white/50 leading-relaxed"
        title_cls = "text-sm font-semibold uppercase text-white/50 mb-3"
        link_cls = "text-sm text-white/70 hover:text-white transition-colors"
        copyright_cls = "mt-8 text-sm text-white/40"
    else:  # saas
        wrapper_cls = "rounded-xl bg-slate-950 text-white p-8"
        name_cls = "text-lg font-bold"
        tagline_cls = "mt-2 text-sm text-white/50 leading-relaxed"
        title_cls = "text-sm font-semibold uppercase tracking-wide text-white/50 mb-3"
        link_cls = "text-sm text-white/70 hover:text-white transition-colors"
        copyright_cls = "mt-8 text-sm text-white/40"

    # --- Grid columns based on number of footer columns ---
    num_cols = len(columns)
    if num_cols >= 3:
        grid_cls = "grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_1fr_1fr] gap-8 lg:gap-10"
    elif num_cols == 2:
        grid_cls = "grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_1fr] gap-8 lg:gap-10"
    elif num_cols == 1:
        grid_cls = "grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-10"
    else:
        grid_cls = ""

    # --- Company info column ---
    company_html = (
        f'<div>'
        f'<div class="{name_cls}">{site_name}</div>'
    )
    if tagline:
        company_html += f'<p class="{tagline_cls}">{tagline}</p>'
    company_html += '</div>'

    # --- Link columns ---
    cols_html = ""
    for col in columns:
        col_title = esc(col.get("title", ""))
        links = col.get("links", [])
        links_html = ""
        for link in links:
            link_text = esc(link.get("text", ""))
            link_href = esc(link.get("href", "#"))
            links_html += (
                f'<li><a href="{link_href}" class="{link_cls}">'
                f'{link_text}</a></li>'
            )
        cols_html += (
            f'<div>'
            f'<h4 class="{title_cls}">{col_title}</h4>'
            f'<ul class="space-y-2">{links_html}</ul>'
            f'</div>'
        )

    # --- Copyright ---
    copyright_html = (
        f'<div class="{copyright_cls} border-t border-white/10 pt-6">'
        f'&copy; {year} {site_name}. All rights reserved.'
        f'</div>'
    )

    # --- Assemble ---
    if grid_cls:
        inner = f'<div class="{grid_cls}">{company_html}{cols_html}</div>'
    else:
        inner = company_html

    return (
        f'<footer class="{section_py_sm}">'
        f'<div class="{container}">'
        f'<div class="{wrapper_cls}">'
        f'{inner}'
        f'{copyright_html}'
        f'</div>'
        f'</div>'
        f'</footer>'
    )



# Register all renderers
RENDERER_FUNCTIONS = {
    "navbar": render_navbar,
    "split_two_col": render_split_two_col,
    "centered_stack": render_centered_stack,
    "card_grid": render_card_grid,
    "quote_block": render_quote_block,
    "quote_grid": render_quote_grid,
    "stat_row": render_stat_row,
    "step_sequence": render_step_sequence,
    "accordion": render_accordion,
    "form_panel": render_form_panel,
    "list_strip": render_list_strip,
    "fullbleed_media": render_fullbleed_media,
    "footer_columns": render_footer_columns,
}


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
    """Assemble full single-page HTML from pattern sections."""
    sections_html_parts = []
    for sec_def in pattern["sections"]:
        archetype = sec_def["archetype"]
        renderer = RENDERER_FUNCTIONS.get(archetype)
        if not renderer:
            continue
        sid = sec_def.get("id", "")
        variant = sec_def.get("variant", "")

        if archetype == "footer_columns":
            sections_html_parts.append(renderer(content, style))
        elif variant:
            sections_html_parts.append(renderer(content, style, section_id=sid, variant=variant))
        elif archetype in ("quote_block", "quote_grid", "stat_row", "accordion", "list_strip"):
            sections_html_parts.append(renderer(content, style, section_id=sid))
        elif archetype == "fullbleed_media":
            sections_html_parts.append(renderer(content, style, section_id=sid))
        elif archetype == "form_panel":
            sections_html_parts.append(renderer(content, style, section_id=sid))
        elif archetype == "step_sequence":
            sections_html_parts.append(renderer(content, style, section_id=sid))
        else:
            sections_html_parts.append(renderer(content, style, section_id=sid))

    body = "\n".join(part for part in sections_html_parts if part)

    nav_html = render_navbar(content, style)

    font = "Inter"
    if style["family"] == "editorial":
        font = "Playfair Display"

    body_bg_map = {
        "concierge": "linear-gradient(180deg, #fffdf8 0%, #fff8f1 30%, #ffffff 100%)",
        "direct": "#ffffff",
        "saas": "linear-gradient(180deg, #f8fafc 0%, #ffffff 40%, #f1f5f9 100%)",
        "editorial": "linear-gradient(180deg, #f7f1e8 0%, #ffffff 38%, #f6f3ee 100%)",
        "clinic": "linear-gradient(180deg, #f0fafb 0%, #ffffff 42%, #f8fafc 100%)",
    }
    body_bg = body_bg_map.get(style["family"], "#ffffff")

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
    parser.add_argument("--pattern", default="", help="Force pattern: concierge_split, direct_conversion, product_led_b2b, editorial_luxury, trust_panel_clinic")
    args = parser.parse_args()

    api_key = load_env_var("OPENAI_API_KEY")
    if not api_key:
        print("OPENAI_API_KEY not found in environment, .env.local, or .env")
        return 1

    if args.pattern and args.pattern in PATTERN_COMBOS:
        pattern = PATTERN_COMBOS[args.pattern]
        print(f"Pattern (forced): {pattern['label']}")
    else:
        print("1/3 Detecting business type...")
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

    print("2/3 Generating content...")
    content = generate_content(api_key, args.name, args.description, pattern["id"])

    style = get_style(pattern["family"], content.get("primaryColor", "#2563eb"), content.get("accentColor", "#f97316"))

    print("3/3 Rendering page...")
    html = assemble_page(args.name, content, pattern, style)

    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html, encoding="utf-8")

    print(f"Done: {out} ({len(html)} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
