#!/usr/bin/env python3
"""
Hero + Navbar generator.

Picks one of 5 pattern combos based on business type, generates copy via
GPT-4o-mini, and renders a single Tailwind HTML page with navbar + hero.

Usage:
    python3 generate_hero.py \
        --name "PawPals Mobile Grooming" \
        --description "At-home pet grooming for dogs and cats in South Delhi" \
        --output hero.html
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
    ctx = ssl.create_default_context()
    return ctx


def parse_json(text: str) -> Any:
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r"```(?:json)?\s*([\s\S]*?)```", text)
        if match:
            return json.loads(match.group(1).strip())
        raise


def esc(value: Any) -> str:
    if value is None:
        return ""
    return str(value).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def chat_json(api_key: str, system_prompt: str, user_prompt: str, temperature: float = 0.5, max_tokens: int = 1500) -> Any:
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
        with urllib.request.urlopen(req, timeout=90, context=ctx) as resp:
            payload = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="ignore")
        raise RuntimeError(f"OpenAI API error {exc.code}: {detail}") from exc
    return parse_json(payload["choices"][0]["message"]["content"])


# ---------------------------------------------------------------------------
# Pattern definitions
# ---------------------------------------------------------------------------

PATTERNS = {
    "concierge_split": {
        "id": "concierge_split",
        "label": "Concierge Split Hero",
        "best_for": ["pet care", "home services", "beauty", "grooming", "cleaning", "plumbing", "electrician", "handyman", "mobile service", "at-home"],
        "nav_style": "soft_concierge",
        "hero_style": "reassuring_split",
    },
    "direct_conversion": {
        "id": "direct_conversion",
        "label": "Direct Conversion Centered Hero",
        "best_for": ["visa", "immigration", "travel agent", "repair", "admissions", "consultant", "lead gen", "insurance", "loan", "real estate agent"],
        "nav_style": "tight_conversion",
        "hero_style": "centered_offer",
    },
    "product_led_b2b": {
        "id": "product_led_b2b",
        "label": "Product-Led B2B Hero",
        "best_for": ["saas", "software", "ai tool", "dashboard", "workflow", "automation", "crm", "clinic software", "b2b", "platform", "app"],
        "nav_style": "saas_product",
        "hero_style": "product_split",
    },
    "editorial_luxury": {
        "id": "editorial_luxury",
        "label": "Editorial Luxury Hero",
        "best_for": ["interior design", "luxury", "architect", "boutique", "high-end beauty", "luxury travel", "fashion", "premium", "bespoke"],
        "nav_style": "editorial_luxury",
        "hero_style": "fullbleed_editorial",
    },
    "trust_panel_clinic": {
        "id": "trust_panel_clinic",
        "label": "Trust Panel Clinic Hero",
        "best_for": ["clinic", "physiotherapy", "dentist", "therapist", "psychologist", "ivf", "hospital", "doctor", "healthcare", "medical", "child development"],
        "nav_style": "healthcare_trust",
        "hero_style": "trust_panel_medical",
    },
}


def pick_pattern(business_type: str, description: str) -> dict:
    text = f"{business_type} {description}".lower()
    best_match = None
    best_score = 0
    for pat in PATTERNS.values():
        score = sum(2 if kw in text else 0 for kw in pat["best_for"])
        if score > best_score:
            best_score = score
            best_match = pat
    return best_match or PATTERNS["concierge_split"]


# ---------------------------------------------------------------------------
# Content generation prompt
# ---------------------------------------------------------------------------

CONTENT_SYSTEM = """You are a homepage copywriter. Given a business, generate hero + navbar content.
Return JSON with this exact structure:
{
  "businessType": "short type label",
  "navLinks": ["link1", "link2", "link3", "link4", "link5"],
  "navCta": "CTA button text",
  "eyebrow": "short eyebrow text",
  "heading": "compelling headline",
  "subheading": "1-2 sentence supporting text",
  "bullets": ["bullet 1", "bullet 2", "bullet 3"],
  "trustChips": ["chip 1", "chip 2", "chip 3"],
  "ctaPrimary": "primary button text",
  "ctaSecondary": "secondary button text",
  "ctaNote": "optional note below CTA or empty string",
  "trustPanelItems": ["trust item 1", "trust item 2", "trust item 3"],
  "statCards": [
    {"value": "32%", "label": "short label"},
    {"value": "5 min", "label": "short label"}
  ],
  "primaryColor": "hex color suited to this business",
  "accentColor": "hex color for CTA/accent"
}
Write specific, realistic copy for this exact business. Not generic."""


def generate_content(api_key: str, name: str, description: str, pattern_id: str) -> dict:
    prompt = f"""Business name: {name}
Description: {description}
Pattern: {pattern_id}

Generate hero and navbar content for this business. Make the copy specific, not generic."""
    return chat_json(api_key, CONTENT_SYSTEM, prompt, temperature=0.6, max_tokens=1200)


# ---------------------------------------------------------------------------
# Navbar renderers (5 distinct navbars)
# ---------------------------------------------------------------------------

def render_nav_soft_concierge(name: str, c: dict) -> str:
    links = "".join(
        f"<a class='text-sm font-medium text-stone-600 transition hover:text-stone-900' href='#{esc(l.lower().replace(' ', '-'))}'>{esc(l)}</a>"
        for l in c.get("navLinks", [])[:5]
    )
    return f"""<header class="sticky top-0 z-50 border-b border-rose-100/70 bg-white/90 backdrop-blur-xl">
  <div class="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
    <strong class="text-lg font-semibold tracking-tight text-stone-900">{esc(name)}</strong>
    <nav class="hidden items-center gap-7 md:flex">
      {links}
      <a class="rounded-full bg-[{esc(c.get('accentColor','#f97316'))}] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90" href="#contact">{esc(c.get('navCta','Book Now'))}</a>
    </nav>
  </div>
</header>"""


def render_nav_tight_conversion(name: str, c: dict) -> str:
    links = "".join(
        f"<a class='text-sm font-semibold text-slate-700 transition hover:text-slate-950' href='#{esc(l.lower().replace(' ', '-'))}'>{esc(l)}</a>"
        for l in c.get("navLinks", [])[:4]
    )
    return f"""<header class="sticky top-0 z-50 border-b border-slate-200 bg-white">
  <div class="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-3.5 lg:px-8">
    <strong class="text-base font-bold tracking-tight text-slate-950">{esc(name)}</strong>
    <nav class="hidden items-center gap-5 md:flex">
      {links}
      <a class="rounded-lg bg-[{esc(c.get('primaryColor','#1e3a5f'))}] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90" href="#contact">{esc(c.get('navCta','Free Consultation'))}</a>
    </nav>
  </div>
</header>"""


def render_nav_saas_product(name: str, c: dict) -> str:
    links = "".join(
        f"<a class='text-sm font-medium text-slate-600 transition hover:text-slate-950' href='#{esc(l.lower().replace(' ', '-'))}'>{esc(l)}</a>"
        for l in c.get("navLinks", [])[:5]
    )
    return f"""<header class="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
  <div class="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
    <strong class="text-base font-bold tracking-tight text-slate-950">{esc(name)}</strong>
    <nav class="hidden items-center gap-6 md:flex">
      {links}
    </nav>
    <div class="hidden items-center gap-3 md:flex">
      <a class="text-sm font-medium text-slate-600 transition hover:text-slate-950" href="#signin">Sign In</a>
      <a class="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800" href="#contact">{esc(c.get('navCta','Book Demo'))}</a>
    </div>
  </div>
</header>"""


def render_nav_editorial_luxury(name: str, c: dict) -> str:
    links = "".join(
        f"<a class='text-xs font-medium uppercase tracking-[0.18em] text-stone-600 transition hover:text-stone-950' href='#{esc(l.lower().replace(' ', '-'))}'>{esc(l)}</a>"
        for l in c.get("navLinks", [])[:5]
    )
    return f"""<header class="sticky top-0 z-50 border-b border-stone-200/50 bg-[#faf6f0]/92 backdrop-blur">
  <div class="mx-auto flex w-full max-w-6xl items-center justify-between px-8 py-6 lg:px-10">
    <strong class="text-lg font-semibold uppercase tracking-[0.06em] text-stone-900">{esc(name)}</strong>
    <nav class="hidden items-center gap-8 md:flex">
      {links}
      <a class="text-xs font-medium uppercase tracking-[0.14em] text-stone-500 transition hover:text-stone-900" href="#contact">{esc(c.get('navCta','Book Consultation'))}</a>
    </nav>
  </div>
</header>"""


def render_nav_healthcare_trust(name: str, c: dict) -> str:
    links = "".join(
        f"<a class='text-sm font-medium text-slate-600 transition hover:text-slate-950' href='#{esc(l.lower().replace(' ', '-'))}'>{esc(l)}</a>"
        for l in c.get("navLinks", [])[:5]
    )
    return f"""<header class="sticky top-0 z-50 border-b border-slate-200/80 bg-white/96 backdrop-blur">
  <div class="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4.5 lg:px-8">
    <strong class="text-base font-semibold tracking-tight text-slate-950">{esc(name)}</strong>
    <nav class="hidden items-center gap-6 md:flex">
      {links}
      <a class="rounded-xl bg-[{esc(c.get('primaryColor','#0f766e'))}] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90" href="#contact">{esc(c.get('navCta','Book Appointment'))}</a>
    </nav>
  </div>
</header>"""


NAV_RENDERERS = {
    "soft_concierge": render_nav_soft_concierge,
    "tight_conversion": render_nav_tight_conversion,
    "saas_product": render_nav_saas_product,
    "editorial_luxury": render_nav_editorial_luxury,
    "healthcare_trust": render_nav_healthcare_trust,
}


# ---------------------------------------------------------------------------
# Hero renderers (5 distinct heroes)
# ---------------------------------------------------------------------------

def render_hero_reassuring_split(c: dict, accent: str) -> str:
    bullets = "".join(
        f"<li class='flex items-start gap-3'><span class='mt-1 h-2 w-2 shrink-0 rounded-full bg-[{esc(accent)}]'></span><span>{esc(b)}</span></li>"
        for b in c.get("bullets", [])[:4]
    )
    chips = "".join(
        f"<span class='rounded-full bg-white/70 px-3.5 py-1.5 text-xs font-medium text-stone-700 shadow-sm backdrop-blur'>{esc(ch)}</span>"
        for ch in c.get("trustChips", [])[:4]
    )
    right_cards = "".join(
        f"<div class='rounded-2xl border border-rose-100/60 bg-white/80 px-4 py-3 text-sm font-medium text-stone-800 shadow-sm backdrop-blur'>{esc(b)}</div>"
        for b in c.get("bullets", [])[:3]
    )
    return f"""<section class="bg-gradient-to-br from-[#fffdf8] via-white to-[#fff5ee]" style="padding:72px 0">
  <div class="mx-auto grid w-full max-w-7xl gap-10 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
    <div>
      <div class="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-rose-600">{esc(c.get('eyebrow',''))}</div>
      <h1 class="max-w-xl text-balance text-4xl font-semibold tracking-[-0.04em] text-stone-950 sm:text-5xl">{esc(c.get('heading',''))}</h1>
      <p class="mt-5 max-w-lg text-base leading-8 text-stone-600">{esc(c.get('subheading',''))}</p>
      <ul class="mt-6 grid gap-2.5 text-sm text-stone-700">{bullets}</ul>
      <div class="mt-8 flex flex-wrap gap-3">
        <a class="rounded-full bg-[{esc(accent)}] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(0,0,0,0.12)] transition hover:opacity-90" href="#contact">{esc(c.get('ctaPrimary','Book Now'))}</a>
        <a class="rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-50" href="#services">{esc(c.get('ctaSecondary','View Services'))}</a>
      </div>
      <div class="mt-5 flex flex-wrap gap-2">{chips}</div>
    </div>
    <div class="relative">
      <div class="aspect-[4/5] overflow-hidden rounded-[2rem] bg-gradient-to-br from-rose-50 to-orange-50 ring-1 ring-stone-200/40">
        <div class="flex h-full items-center justify-center text-stone-300">
          <svg class="h-20 w-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        </div>
      </div>
      <div class="absolute -left-4 bottom-8 grid gap-2 lg:-left-6">{right_cards}</div>
    </div>
  </div>
</section>"""


def render_hero_centered_offer(c: dict, primary: str) -> str:
    chips = "".join(
        f"<span class='rounded-md bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700'>{esc(ch)}</span>"
        for ch in c.get("trustChips", [])[:5]
    )
    return f"""<section class="bg-white" style="padding:56px 0">
  <div class="mx-auto w-full max-w-3xl px-6 text-center lg:px-8">
    <div class="mb-2 text-xs font-bold uppercase tracking-[0.1em] text-slate-500">{esc(c.get('eyebrow',''))}</div>
    <h1 class="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">{esc(c.get('heading',''))}</h1>
    <p class="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">{esc(c.get('subheading',''))}</p>
    <div class="mt-5 flex flex-wrap justify-center gap-2">{chips}</div>
    <div class="mt-7">
      <a class="inline-flex rounded-lg bg-[{esc(primary)}] px-7 py-3.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90" href="#contact">{esc(c.get('ctaPrimary','Get Started'))}</a>
    </div>
    <p class="mt-3 text-xs font-medium text-slate-400">{esc(c.get('ctaNote',''))}</p>
  </div>
</section>"""


def render_hero_product_split(c: dict, primary: str, accent: str) -> str:
    bullets = "".join(
        f"<li class='flex items-start gap-2.5'><span class='mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md bg-slate-100 text-[0.6rem] font-bold text-slate-500'>{i+1}</span><span>{esc(b)}</span></li>"
        for i, b in enumerate(c.get("bullets", [])[:4])
    )
    stat_cards = "".join(
        f"<div class='rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm'><div class='text-lg font-bold tracking-tight text-slate-900'>{esc(s.get('value',''))}</div><div class='text-xs text-slate-500'>{esc(s.get('label',''))}</div></div>"
        for s in c.get("statCards", [])[:3]
    )
    return f"""<section class="bg-gradient-to-br from-slate-50 via-white to-blue-50/40" style="padding:64px 0">
  <div class="mx-auto grid w-full max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:px-8">
    <div>
      <div class="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{esc(c.get('eyebrow',''))}</div>
      <h1 class="max-w-lg text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">{esc(c.get('heading',''))}</h1>
      <p class="mt-4 max-w-md text-base leading-7 text-slate-500">{esc(c.get('subheading',''))}</p>
      <ul class="mt-5 grid gap-2 text-sm text-slate-600">{bullets}</ul>
      <div class="mt-7 flex flex-wrap gap-3">
        <a class="rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800" href="#contact">{esc(c.get('ctaPrimary','Book Demo'))}</a>
        <a class="rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50" href="#features">{esc(c.get('ctaSecondary','See Features'))}</a>
      </div>
    </div>
    <div class="relative">
      <div class="aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-100 to-white shadow-lg ring-1 ring-slate-900/5">
        <div class="flex h-full items-center justify-center text-slate-300">
          <svg class="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
        </div>
      </div>
      <div class="absolute -bottom-4 left-4 right-4 flex gap-2">{stat_cards}</div>
    </div>
  </div>
</section>"""


def render_hero_fullbleed_editorial(c: dict) -> str:
    return f"""<section class="relative overflow-hidden bg-[#f5f0e8]" style="padding:0">
  <div class="aspect-[16/7] w-full bg-gradient-to-br from-stone-200 via-[#ebe4d8] to-stone-100">
    <div class="flex h-full items-center justify-center text-stone-300">
      <svg class="h-24 w-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="0.75" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
    </div>
  </div>
  <div class="absolute inset-0 bg-gradient-to-t from-[#f5f0e8] via-transparent to-transparent"></div>
  <div class="absolute bottom-0 left-0 right-0 px-8 pb-12 lg:px-10">
    <div class="mx-auto max-w-6xl">
      <div class="max-w-xl">
        <div class="mb-4 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-stone-500">{esc(c.get('eyebrow',''))}</div>
        <h1 class="text-3xl font-semibold tracking-[-0.04em] text-stone-900 sm:text-4xl lg:text-5xl">{esc(c.get('heading',''))}</h1>
        <p class="mt-5 max-w-md text-base leading-[1.85] text-stone-600">{esc(c.get('subheading',''))}</p>
        <a class="mt-8 inline-flex border-b border-stone-800 pb-1 text-sm font-medium tracking-wide text-stone-800 transition hover:border-stone-500 hover:text-stone-600" href="#work">{esc(c.get('ctaPrimary','Explore Our Work'))}</a>
      </div>
    </div>
  </div>
</section>"""


def render_hero_trust_panel_medical(c: dict, primary: str) -> str:
    highlights = "".join(
        f"<li class='flex items-start gap-2.5'><span class='mt-0.5 text-[{esc(primary)}]'>&#10003;</span><span>{esc(b)}</span></li>"
        for b in c.get("bullets", [])[:4]
    )
    panel_items = "".join(
        f"<div class='rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-800'>{esc(t)}</div>"
        for t in c.get("trustPanelItems", [])[:4]
    )
    return f"""<section class="bg-gradient-to-br from-[#f0fafb] via-white to-slate-50" style="padding:64px 0">
  <div class="mx-auto grid w-full max-w-7xl gap-10 px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:px-8">
    <div>
      <div class="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{esc(c.get('eyebrow',''))}</div>
      <h1 class="max-w-xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">{esc(c.get('heading',''))}</h1>
      <p class="mt-5 max-w-lg text-base leading-7 text-slate-600">{esc(c.get('subheading',''))}</p>
      <ul class="mt-5 grid gap-2 text-sm text-slate-700">{highlights}</ul>
      <div class="mt-7 flex flex-wrap gap-3">
        <a class="rounded-xl bg-[{esc(primary)}] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90" href="#contact">{esc(c.get('ctaPrimary','Book Appointment'))}</a>
        <a class="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50" href="#treatments">{esc(c.get('ctaSecondary','View Treatments'))}</a>
      </div>
    </div>
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div class="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Why patients trust us</div>
      <div class="grid gap-2">{panel_items}</div>
    </div>
  </div>
</section>"""


HERO_RENDERERS = {
    "reassuring_split": render_hero_reassuring_split,
    "centered_offer": render_hero_centered_offer,
    "product_split": render_hero_product_split,
    "fullbleed_editorial": render_hero_fullbleed_editorial,
    "trust_panel_medical": render_hero_trust_panel_medical,
}


# ---------------------------------------------------------------------------
# Page assembly
# ---------------------------------------------------------------------------

def render_page(name: str, pattern: dict, content: dict) -> str:
    primary = content.get("primaryColor", "#2563eb")
    accent = content.get("accentColor", "#f97316")

    nav_html = NAV_RENDERERS[pattern["nav_style"]](name, content)

    hero_style = pattern["hero_style"]
    if hero_style == "reassuring_split":
        hero_html = render_hero_reassuring_split(content, accent)
    elif hero_style == "centered_offer":
        hero_html = render_hero_centered_offer(content, primary)
    elif hero_style == "product_split":
        hero_html = render_hero_product_split(content, primary, accent)
    elif hero_style == "fullbleed_editorial":
        hero_html = render_hero_fullbleed_editorial(content)
    elif hero_style == "trust_panel_medical":
        hero_html = render_hero_trust_panel_medical(content, primary)
    else:
        hero_html = render_hero_reassuring_split(content, accent)

    font = "Inter"
    if hero_style == "fullbleed_editorial":
        font = "Playfair Display"

    body_bg = {
        "reassuring_split": "#fffdf8",
        "centered_offer": "#ffffff",
        "product_split": "#f8fafc",
        "fullbleed_editorial": "#f5f0e8",
        "trust_panel_medical": "#f8fcfc",
    }.get(hero_style, "#ffffff")

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
    body {{ font-family: '{font}', system-ui, sans-serif; background: {body_bg}; color: #0f172a; }}
    h1, h2, h3, strong {{ font-family: '{font}', system-ui, sans-serif; }}
  </style>
</head>
<body class="antialiased">
{nav_html}
<main>
{hero_html}
</main>
</body>
</html>"""


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main() -> int:
    parser = argparse.ArgumentParser(description="Generate a hero + navbar HTML page.")
    parser.add_argument("--name", required=True, help="Business name")
    parser.add_argument("--description", required=True, help="Business description")
    parser.add_argument("--output", required=True, help="Output HTML path")
    parser.add_argument("--pattern", default="", help="Force a pattern: concierge_split, direct_conversion, product_led_b2b, editorial_luxury, trust_panel_clinic")
    args = parser.parse_args()

    api_key = load_env_var("OPENAI_API_KEY")
    if not api_key:
        print("OPENAI_API_KEY not found in environment, .env.local, or .env")
        return 1

    # Step 1: pick pattern
    if args.pattern and args.pattern in PATTERNS:
        pattern = PATTERNS[args.pattern]
        print(f"Pattern (forced): {pattern['label']}")
    else:
        print("1/2 Detecting business type...")
        context = chat_json(
            api_key,
            "You classify businesses. Return JSON: {\"businessType\": \"short label\", \"keywords\": [\"kw1\",\"kw2\",...]}",
            f"Business: {args.name}\nDescription: {args.description}",
            temperature=0.3,
            max_tokens=300,
        )
        btype = context.get("businessType", "")
        keywords = " ".join(context.get("keywords", []))
        pattern = pick_pattern(btype, f"{args.description} {keywords}")
        print(f"Pattern: {pattern['label']} (detected: {btype})")

    # Step 2: generate content
    print("2/2 Generating hero content...")
    content = generate_content(api_key, args.name, args.description, pattern["id"])

    # Step 3: render
    html = render_page(args.name, pattern, content)
    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html, encoding="utf-8")

    print(f"Done: {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
