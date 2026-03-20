#!/usr/bin/env python3.11

from __future__ import annotations

import argparse
import json
import textwrap
from pathlib import Path
from typing import Any

import generate_html as core


def esc(value: Any) -> str:
    return core.esc(value)


def resolve_action_href(action_id: str, actions: list[dict[str, Any]]) -> str:
    return core.resolve_action_href(action_id, actions)


def extract_text(item: Any) -> str:
    if isinstance(item, str):
        return item
    if isinstance(item, dict):
        return str(item.get("text") or item.get("label") or item.get("title") or item.get("name") or "")
    return str(item) if item else ""


def extract_href(item: Any) -> str:
    if isinstance(item, dict):
        return str(item.get("href") or item.get("url") or item.get("link") or "#")
    return "#"


def extract_label(item: Any) -> str:
    if isinstance(item, str):
        return item
    if isinstance(item, dict):
        return str(item.get("label") or item.get("text") or item.get("title") or item.get("name") or "")
    return str(item) if item else ""


def normalize_list_items(items: list[Any]) -> list[str]:
    return [extract_text(item) for item in items if extract_text(item)]


def normalize_dict_items(items: list[Any]) -> list[dict[str, str]]:
    result = []
    for item in items:
        if isinstance(item, dict):
            result.append({
                "title": str(item.get("title") or item.get("name") or item.get("label") or ""),
                "description": str(item.get("description") or item.get("text") or item.get("summary") or ""),
            })
        elif isinstance(item, str):
            result.append({"title": item, "description": ""})
    return [r for r in result if r["title"]]


def _mode_family(design_mode: str) -> str:
    if design_mode in {"editorial-luxe", "premium_editorial"}:
        return "editorial"
    if design_mode in {"soft_concierge"}:
        return "soft"
    if design_mode in {"warm-service", "warm_local_service"}:
        return "warm"
    if design_mode in {"direct_local_conversion"}:
        return "direct"
    if design_mode in {"clinical-structured"}:
        return "clinical"
    if design_mode in {"modern_glass_saas"}:
        return "glass"
    if design_mode in {"crisp_b2b_saas"}:
        return "b2b"
    return "default"


def render_buttons(buttons: list[Any], actions: list[dict[str, Any]], tone: dict[str, str] | None = None) -> str:
    tone = tone or {}
    rendered = []
    for button in buttons[:2]:
        if not isinstance(button, dict):
            continue
        href = resolve_action_href(str(button.get("actionId") or "action-primary"), actions)
        style = str(button.get("style") or "primary")
        if style == "secondary":
            classes = "inline-flex items-center justify-center px-6 py-3 text-sm font-semibold transition " + tone.get(
                "cta_secondary", "rounded-full bg-brand text-white hover:opacity-90"
            )
        else:
            classes = "inline-flex items-center justify-center px-6 py-3 text-sm font-semibold transition " + tone.get(
                "cta_primary", "rounded-full bg-accent text-slate-950 hover:opacity-90"
            )
        rendered.append(f'<a class="{classes}" href="{esc(href)}">{esc(button.get("text", "Learn More"))}</a>')
    return "".join(rendered)


def design_classes(design_mode: str, theme_variant: str) -> dict[str, str]:
    if design_mode in {"editorial-luxe", "premium_editorial"}:
        return {
            "body_bg": "linear-gradient(180deg, #f7f1e8 0%, #ffffff 38%, #f6f3ee 100%)",
            "header": "border-stone-300/70 bg-[#f8f2e8]/90 backdrop-blur",
            "nav_link": "text-sm font-medium uppercase tracking-[0.14em] text-stone-700 transition hover:text-stone-950",
            "hero_frame": "border border-stone-300/70 bg-[#f2e8da]/75",
            "muted": "text-stone-600",
            "panel": "border-stone-400/30 bg-[#fbf7f0]/78",
            "card": "border-stone-300/70 bg-[#fffaf2] shadow-[0_24px_60px_rgba(71,55,32,0.08)]",
            "dark_block": "bg-[#1f1812] text-[#f9f4ea] shadow-[0_24px_80px_rgba(31,24,18,0.26)]",
            "footer": "bg-[#1f1812] text-[#f9f4ea] shadow-[0_24px_80px_rgba(31,24,18,0.26)]",
            "radius_hero": "rounded-[1.5rem]",
            "radius_block": "rounded-[1.25rem]",
            "header_inner": "mx-auto flex w-full max-w-7xl items-center justify-between gap-8 px-6 py-6 lg:px-8",
            "brand_mark": "text-lg font-semibold uppercase tracking-[0.08em] text-stone-950",
            "nav_gap": "gap-8",
            "hero_pad": "p-12 lg:p-16",
            "hero_title": "max-w-3xl text-balance text-5xl font-semibold tracking-[-0.05em] sm:text-6xl",
            "section_gap": "gap-8",
            "cta_primary": "rounded-full bg-stone-950 px-6 py-3 text-[#f9f4ea] hover:opacity-90",
            "cta_secondary": "rounded-full border border-stone-400/60 bg-transparent px-6 py-3 text-stone-900 hover:bg-stone-100",
        }
    if design_mode == "soft_concierge":
        return {
            "body_bg": "linear-gradient(180deg, #fffdf8 0%, #fff8f1 32%, #ffffff 100%)",
            "header": "border-rose-100/80 bg-white/86 backdrop-blur-xl",
            "nav_link": "text-sm font-medium text-stone-600 transition hover:text-stone-950",
            "hero_frame": "border border-rose-100/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(255,244,236,0.86))]",
            "muted": "text-rose-700",
            "panel": "border-rose-100/80 bg-white/80 backdrop-blur",
            "card": "border-rose-100/70 bg-white shadow-[0_28px_70px_rgba(190,24,93,0.08)]",
            "dark_block": "bg-[linear-gradient(135deg,#201419,#4b2b34)] text-[#fff7f6] shadow-[0_24px_70px_rgba(76,29,49,0.22)]",
            "footer": "bg-[#24161d] text-[#fff7f6] shadow-[0_24px_70px_rgba(36,22,29,0.22)]",
            "radius_hero": "rounded-[2.5rem]",
            "radius_block": "rounded-[1.75rem]",
            "header_inner": "mx-auto flex w-full max-w-7xl items-center justify-between gap-8 px-6 py-6 lg:px-8",
            "brand_mark": "text-lg font-semibold tracking-tight text-stone-950",
            "nav_gap": "gap-8",
            "hero_pad": "p-10 lg:p-14",
            "hero_title": "max-w-3xl text-balance text-5xl font-semibold tracking-[-0.04em] sm:text-6xl",
            "section_gap": "gap-8",
            "cta_primary": "rounded-full bg-accent px-6 py-3 text-slate-950 shadow-[0_16px_34px_rgba(249,115,22,0.18)] hover:opacity-90",
            "cta_secondary": "rounded-full border border-rose-200 bg-white/80 px-6 py-3 text-stone-900 hover:bg-white",
        }
    if design_mode in {"warm-service", "warm_local_service"}:
        return {
            "body_bg": "linear-gradient(180deg, #fff8f1 0%, #ffffff 36%, #fff4e6 100%)",
            "header": "border-orange-200/70 bg-white/94 backdrop-blur",
            "nav_link": "text-sm font-semibold text-slate-700 transition hover:text-slate-950",
            "hero_frame": "border border-orange-200/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(255,244,230,0.88))]",
            "muted": "text-orange-700",
            "panel": "border-orange-200/80 bg-white",
            "card": "border-orange-100 bg-white shadow-[0_18px_45px_rgba(234,88,12,0.10)]",
            "dark_block": "bg-[linear-gradient(135deg,theme(colors.brand),theme(colors.accent))] text-slate-950 shadow-[0_20px_70px_rgba(249,115,22,0.18)]",
            "footer": "bg-slate-950 text-white shadow-xl",
            "radius_hero": "rounded-[1.75rem]",
            "radius_block": "rounded-[1.25rem]",
            "header_inner": "mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-5 lg:px-8",
            "brand_mark": "text-base font-semibold tracking-tight text-slate-950",
            "nav_gap": "gap-6",
            "hero_pad": "p-8 lg:p-10",
            "hero_title": "max-w-4xl text-balance text-5xl font-semibold tracking-tight sm:text-6xl",
            "section_gap": "gap-6",
            "cta_primary": "rounded-full bg-accent px-6 py-3 text-slate-950 hover:opacity-90",
            "cta_secondary": "rounded-full bg-brand px-6 py-3 text-white hover:opacity-90",
        }
    if design_mode == "direct_local_conversion":
        return {
            "body_bg": "linear-gradient(180deg, #fffef8 0%, #ffffff 26%, #f8fafc 100%)",
            "header": "border-slate-300 bg-white",
            "nav_link": "text-sm font-semibold text-slate-700 transition hover:text-slate-950",
            "hero_frame": "border border-slate-300 bg-white",
            "muted": "text-slate-600",
            "panel": "border-slate-300 bg-slate-50",
            "card": "border-slate-300 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.06)]",
            "dark_block": "bg-slate-950 text-white shadow-[0_18px_40px_rgba(15,23,42,0.16)]",
            "footer": "bg-slate-950 text-white shadow-xl",
            "radius_hero": "rounded-[1rem]",
            "radius_block": "rounded-[0.9rem]",
            "header_inner": "mx-auto flex w-full max-w-7xl items-center justify-between gap-5 px-6 py-4 lg:px-8",
            "brand_mark": "text-base font-bold tracking-tight text-slate-950",
            "nav_gap": "gap-5",
            "hero_pad": "p-6 lg:p-8",
            "hero_title": "max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl",
            "section_gap": "gap-4",
            "cta_primary": "rounded-xl bg-accent px-6 py-3 text-slate-950 shadow-sm hover:opacity-90",
            "cta_secondary": "rounded-xl bg-brand px-6 py-3 text-white hover:opacity-90",
        }
    if design_mode == "clinical-structured":
        return {
            "body_bg": "linear-gradient(180deg, #f6fbfc 0%, #ffffff 42%, #f8fafc 100%)",
            "header": "border-slate-200/90 bg-white/96 backdrop-blur",
            "nav_link": "text-sm font-medium text-slate-600 transition hover:text-slate-950",
            "hero_frame": "border border-slate-200 bg-white",
            "muted": "text-slate-600",
            "panel": "border-slate-200 bg-slate-50",
            "card": "border-slate-200 bg-white shadow-[0_12px_34px_rgba(15,23,42,0.05)]",
            "dark_block": "bg-slate-900 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]",
            "footer": "bg-slate-950 text-white shadow-xl",
            "radius_hero": "rounded-[1rem]",
            "radius_block": "rounded-[1rem]",
            "header_inner": "mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-5 lg:px-8",
            "brand_mark": "text-base font-semibold tracking-tight text-slate-950",
            "nav_gap": "gap-6",
            "hero_pad": "p-8 lg:p-10",
            "hero_title": "max-w-4xl text-balance text-5xl font-semibold tracking-tight sm:text-6xl",
            "section_gap": "gap-6",
            "cta_primary": "rounded-xl bg-slate-950 px-6 py-3 text-white hover:opacity-90",
            "cta_secondary": "rounded-xl border border-slate-300 bg-white px-6 py-3 text-slate-950 hover:bg-slate-50",
        }
    if design_mode == "modern_glass_saas":
        return {
            "body_bg": "linear-gradient(180deg, #eaf1ff 0%, #ffffff 38%, #edf4ff 100%)",
            "header": "border-slate-200/80 bg-white/88 backdrop-blur",
            "nav_link": "text-sm font-medium text-slate-700 transition hover:text-slate-950",
            "hero_frame": "border border-white/10 bg-[linear-gradient(135deg,theme(colors.brand/.82),theme(colors.brand/.68))]",
            "muted": "text-slate-500",
            "panel": "border-white/10 bg-white/10 backdrop-blur",
            "card": "border-slate-200/80 bg-white shadow-[0_18px_50px_rgba(37,99,235,0.10)]",
            "dark_block": "bg-slate-950 text-white shadow-xl",
            "footer": "bg-slate-950 text-white shadow-xl",
            "radius_hero": "rounded-[2rem]",
            "radius_block": "rounded-[1.5rem]",
            "header_inner": "mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-5 lg:px-8",
            "brand_mark": "text-base font-semibold tracking-tight text-slate-950",
            "nav_gap": "gap-6",
            "hero_pad": "p-8 lg:p-10",
            "hero_title": "max-w-4xl text-balance text-5xl font-semibold tracking-tight sm:text-6xl",
            "section_gap": "gap-6",
            "cta_primary": "rounded-full bg-accent px-6 py-3 text-slate-950 hover:opacity-90",
            "cta_secondary": "rounded-full bg-brand px-6 py-3 text-white hover:opacity-90",
        }
    if design_mode == "crisp_b2b_saas":
        return {
            "body_bg": "linear-gradient(180deg, #f8fafc 0%, #ffffff 42%, #f1f5f9 100%)",
            "header": "border-slate-200 bg-white/98",
            "nav_link": "text-sm font-medium text-slate-600 transition hover:text-slate-950",
            "hero_frame": "border border-slate-200 bg-white",
            "muted": "text-slate-600",
            "panel": "border-slate-200 bg-slate-50",
            "card": "border-slate-200 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.05)]",
            "dark_block": "bg-slate-950 text-white shadow-[0_18px_40px_rgba(15,23,42,0.16)]",
            "footer": "bg-slate-950 text-white shadow-xl",
            "radius_hero": "rounded-[1rem]",
            "radius_block": "rounded-[1rem]",
            "header_inner": "mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-8",
            "brand_mark": "text-base font-bold tracking-tight text-slate-950",
            "nav_gap": "gap-6",
            "hero_pad": "p-8 lg:p-10",
            "hero_title": "max-w-4xl text-balance text-5xl font-bold tracking-tight sm:text-6xl",
            "section_gap": "gap-5",
            "cta_primary": "rounded-lg bg-slate-950 px-6 py-3 text-white hover:opacity-90",
            "cta_secondary": "rounded-lg border border-slate-300 bg-white px-6 py-3 text-slate-950 hover:bg-slate-50",
        }
    if theme_variant == "premium":
        return {
            "body_bg": "linear-gradient(180deg, #eef2ff 0%, #ffffff 40%, #f8fafc 100%)",
            "header": "border-slate-200/80 bg-white/90 backdrop-blur",
            "nav_link": "text-sm font-medium text-slate-700 transition hover:text-slate-950",
            "hero_frame": "border border-white/10 bg-[linear-gradient(135deg,theme(colors.brand/.80),theme(colors.brand/.68))]",
            "muted": "text-slate-500",
            "panel": "border-white/10 bg-white/8 backdrop-blur",
            "card": "border-stone-200/70 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]",
            "dark_block": "bg-slate-950 text-white shadow-[0_24px_80px_rgba(15,23,42,0.26)]",
            "footer": "bg-slate-950 text-white shadow-[0_24px_80px_rgba(15,23,42,0.26)]",
            "radius_hero": "rounded-[2rem]",
            "radius_block": "rounded-[1.5rem]",
            "header_inner": "mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-5 lg:px-8",
            "brand_mark": "text-base font-semibold tracking-tight text-slate-950",
            "nav_gap": "gap-6",
            "hero_pad": "p-8 lg:p-10",
            "hero_title": "max-w-4xl text-balance text-5xl font-semibold tracking-tight sm:text-6xl",
            "section_gap": "gap-6",
            "cta_primary": "rounded-full bg-accent px-6 py-3 text-slate-950 hover:opacity-90",
            "cta_secondary": "rounded-full bg-brand px-6 py-3 text-white hover:opacity-90",
        }
    return {
        "body_bg": "linear-gradient(180deg, #edf4ff 0%, #ffffff 42%, #eef6ff 100%)",
        "header": "border-slate-200/80 bg-white/90 backdrop-blur",
        "nav_link": "text-sm font-medium text-slate-700 transition hover:text-slate-950",
        "hero_frame": "border border-white/10 bg-[linear-gradient(135deg,theme(colors.brand/.82),theme(colors.brand/.68))]",
        "muted": "text-slate-500",
        "panel": "border-white/10 bg-white/10 backdrop-blur",
        "card": "border-slate-200/80 bg-white shadow-[0_18px_50px_rgba(37,99,235,0.10)]",
        "dark_block": "bg-slate-950 text-white shadow-xl",
        "footer": "bg-slate-950 text-white shadow-xl",
        "radius_hero": "rounded-[2rem]",
        "radius_block": "rounded-[1.5rem]",
        "header_inner": "mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-5 lg:px-8",
        "brand_mark": "text-base font-semibold tracking-tight text-slate-950",
        "nav_gap": "gap-6",
        "hero_pad": "p-8 lg:p-10",
        "hero_title": "max-w-4xl text-balance text-5xl font-semibold tracking-tight sm:text-6xl",
        "section_gap": "gap-6",
        "cta_primary": "rounded-full bg-accent px-6 py-3 text-slate-950 hover:opacity-90",
        "cta_secondary": "rounded-full bg-brand px-6 py-3 text-white hover:opacity-90",
    }


def build_navigation(shared_settings: dict[str, Any], site_plan: dict[str, Any], design_brief: dict[str, Any]) -> list[dict[str, str]]:
    pages_by_label = {str(page.get("title") or "").strip().lower(): page for page in site_plan.get("pages", [])}
    pages_by_slug = {str(page.get("slug") or "").strip().lower(): page for page in site_plan.get("pages", [])}
    requested = ((design_brief.get("navigationStrategy") or {}).get("links")) or []
    resolved: list[dict[str, str]] = []
    for label in requested:
        key = str(label).strip().lower()
        page = pages_by_label.get(key) or pages_by_slug.get(key.replace(" ", "-"))
        if not page:
            continue
        href = "#home" if page.get("slug") == "home" else f"#{page.get('slug')}"
        resolved.append({"label": str(page.get("title") or label), "href": href})
    if resolved:
        return resolved
    return shared_settings.get("navigation") or [
        {"label": p["title"], "href": f"#{p['slug']}"} for p in site_plan.get("pages", [])
    ]


def get_nav_cta(shared_settings: dict[str, Any]) -> dict[str, Any] | None:
    actions = shared_settings.get("actions", [])
    return actions[0] if actions else None


def render_intro_editorial(content: dict[str, Any], tone: dict[str, str]) -> str:
    parts: list[str] = []
    if content.get("badge"):
        parts.append(
            f"<div class='mb-6 inline-flex border-b border-stone-300/60 pb-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-stone-500'>{esc(extract_text(content['badge']))}</div>"
        )
    if content.get("eyebrow"):
        parts.append(
            f"<div class='mb-4 text-[0.7rem] font-medium uppercase tracking-[0.2em] {tone['muted']}'>{esc(extract_text(content['eyebrow']))}</div>"
        )
    if content.get("heading"):
        parts.append(f"<h2 class='max-w-2xl text-balance text-3xl font-semibold tracking-[-0.035em] text-slate-950 lg:text-4xl'>{esc(extract_text(content['heading']))}</h2>")
    if content.get("subheading"):
        parts.append(f"<p class='mt-6 max-w-xl text-base leading-[1.85] text-slate-600'>{esc(extract_text(content['subheading']))}</p>")
    return "".join(parts)


def render_intro_compact(content: dict[str, Any], tone: dict[str, str]) -> str:
    parts: list[str] = []
    badge = content.get("badge")
    eyebrow = content.get("eyebrow")
    if badge:
        parts.append(
            f"<span class='mb-2 inline-block rounded-md bg-accent/12 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-slate-800'>{esc(extract_text(badge))}</span>"
        )
    if eyebrow:
        parts.append(
            f"<div class='mb-1 text-[0.7rem] font-bold uppercase tracking-[0.1em] {tone['muted']}'>{esc(extract_text(eyebrow))}</div>"
        )
    if content.get("heading"):
        parts.append(f"<h2 class='text-2xl font-bold tracking-tight text-slate-950 lg:text-3xl'>{esc(extract_text(content['heading']))}</h2>")
    if content.get("subheading"):
        parts.append(f"<p class='mt-2 max-w-2xl text-sm leading-7 text-slate-600'>{esc(extract_text(content['subheading']))}</p>")
    return "".join(parts)


def render_intro_bold(content: dict[str, Any], tone: dict[str, str]) -> str:
    parts: list[str] = []
    if content.get("badge"):
        parts.append(
            f"<div class='mb-5 inline-flex rounded-full bg-slate-950/8 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-slate-800'>{esc(extract_text(content['badge']))}</div>"
        )
    if content.get("eyebrow"):
        parts.append(
            f"<div class='mb-3 text-xs font-bold uppercase tracking-[0.16em] {tone['muted']}'>{esc(extract_text(content['eyebrow']))}</div>"
        )
    if content.get("heading"):
        parts.append(f"<h2 class='max-w-3xl text-balance text-4xl font-bold tracking-[-0.04em] text-slate-950 lg:text-5xl'>{esc(extract_text(content['heading']))}</h2>")
    if content.get("subheading"):
        parts.append(f"<p class='mt-5 max-w-2xl text-lg leading-8 text-slate-500'>{esc(extract_text(content['subheading']))}</p>")
    return "".join(parts)


def render_intro_soft(content: dict[str, Any], tone: dict[str, str]) -> str:
    parts: list[str] = []
    if content.get("badge"):
        parts.append(
            f"<div class='mb-5 inline-flex rounded-full bg-rose-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-rose-800'>{esc(extract_text(content['badge']))}</div>"
        )
    if content.get("eyebrow"):
        parts.append(
            f"<div class='mb-3 text-xs font-semibold uppercase tracking-[0.18em] {tone['muted']}'>{esc(extract_text(content['eyebrow']))}</div>"
        )
    if content.get("heading"):
        parts.append(f"<h2 class='max-w-2xl text-balance text-3xl font-semibold tracking-[-0.03em] text-slate-950 lg:text-4xl'>{esc(extract_text(content['heading']))}</h2>")
    if content.get("subheading"):
        parts.append(f"<p class='mt-5 max-w-xl text-base leading-8 text-slate-600'>{esc(extract_text(content['subheading']))}</p>")
    return "".join(parts)


def pick_intro_renderer(design_mode: str, section_type: str, variant: str):
    family = _mode_family(design_mode)
    if family == "editorial":
        return render_intro_editorial
    if family == "direct":
        return render_intro_compact
    if family == "clinical":
        return render_intro_compact
    if family in {"glass", "b2b"}:
        if section_type in {"about-team", "testimonials"}:
            return render_intro_editorial
        return render_intro_bold
    if family == "soft":
        return render_intro_soft
    if family == "warm":
        if section_type in {"services", "how-it-works"}:
            return render_intro_compact
        return render_intro_soft
    return render_intro_bold


def render_intro(content: dict[str, Any], tone: dict[str, str] | None = None, design_mode: str = "", section_type: str = "", variant: str = "") -> str:
    tone = tone or {}
    renderer = pick_intro_renderer(design_mode, section_type, variant)
    return renderer(content, tone)


def render_supporting_points(points: list[Any], design_mode: str = "") -> str:
    clean = normalize_list_items(points)
    if not clean:
        return ""
    family = _mode_family(design_mode)
    if family == "editorial":
        return "<ul class='mt-8 grid gap-4 text-sm text-stone-700'>" + "".join(
            f"<li class='flex gap-3'><span class='mt-1.5 h-1.5 w-1.5 rounded-full bg-stone-400'></span><span>{esc(p)}</span></li>"
            for p in clean
        ) + "</ul>"
    if family == "direct":
        return "<ul class='mt-4 grid gap-1.5 text-sm text-slate-700'>" + "".join(
            f"<li class='flex gap-2'><span class='text-accent font-bold'>&#10003;</span><span>{esc(p)}</span></li>"
            for p in clean
        ) + "</ul>"
    if family in {"glass", "b2b"}:
        return "<ul class='mt-6 grid gap-3 text-sm text-slate-600'>" + "".join(
            f"<li class='flex gap-3 items-start'><span class='mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md bg-slate-100 text-[0.6rem] font-bold text-slate-500'>{i+1}</span><span>{esc(p)}</span></li>"
            for i, p in enumerate(clean)
        ) + "</ul>"
    if family == "soft":
        return "<ul class='mt-6 grid gap-3 text-sm text-stone-600'>" + "".join(
            f"<li class='flex gap-3'><span class='mt-1 h-2 w-2 rounded-full bg-rose-300'></span><span>{esc(p)}</span></li>"
            for p in clean
        ) + "</ul>"
    return "<ul class='mt-6 grid gap-3 text-sm text-slate-700'>" + "".join(
        f"<li class='flex gap-3'><span class='mt-1 h-2 w-2 rounded-full bg-emerald-400'></span><span>{esc(p)}</span></li>"
        for p in clean
    ) + "</ul>"


def render_trust_chips(chips: list[Any], design_mode: str = "") -> str:
    clean = normalize_list_items(chips)
    if not clean:
        return ""
    family = _mode_family(design_mode)
    if family == "editorial":
        return "<div class='mt-6 flex flex-wrap gap-3'>" + "".join(
            f"<span class='border-b border-stone-400/40 pb-0.5 text-xs font-medium tracking-wide text-stone-600'>{esc(c)}</span>"
            for c in clean
        ) + "</div>"
    if family == "direct":
        return "<div class='mt-4 flex flex-wrap gap-2'>" + "".join(
            f"<span class='rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700'>{esc(c)}</span>"
            for c in clean
        ) + "</div>"
    if family in {"glass", "b2b"}:
        return "<div class='mt-5 flex flex-wrap gap-2'>" + "".join(
            f"<span class='rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm'>{esc(c)}</span>"
            for c in clean
        ) + "</div>"
    if family == "soft":
        return "<div class='mt-5 flex flex-wrap gap-2'>" + "".join(
            f"<span class='rounded-full bg-white/60 px-3.5 py-1.5 text-xs font-medium text-stone-700 backdrop-blur'>{esc(c)}</span>"
            for c in clean
        ) + "</div>"
    return "<div class='mt-5 flex flex-wrap gap-2'>" + "".join(
        f"<span class='rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-current'>{esc(c)}</span>"
        for c in clean
    ) + "</div>"


def render_stat_chip(value: str, label: str, design_mode: str = "") -> str:
    family = _mode_family(design_mode)
    if family == "editorial":
        return f"<div class='border-l-2 border-stone-300 pl-4'><div class='text-3xl font-semibold tracking-tight text-stone-900'>{esc(value)}</div><div class='mt-1 text-xs font-medium uppercase tracking-[0.1em] text-stone-500'>{esc(label)}</div></div>"
    if family == "direct":
        return f"<div class='rounded-lg border border-slate-200 bg-white px-4 py-3'><div class='text-2xl font-bold tracking-tight text-slate-950'>{esc(value)}</div><div class='mt-0.5 text-xs text-slate-500'>{esc(label)}</div></div>"
    if family in {"glass", "b2b"}:
        return f"<div class='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'><div class='text-3xl font-bold tracking-tight text-slate-950'>{esc(value)}</div><div class='mt-1.5 text-sm text-slate-500'>{esc(label)}</div></div>"
    if family == "soft":
        return f"<div class='rounded-2xl bg-white/70 p-5 backdrop-blur'><div class='text-3xl font-semibold tracking-tight text-stone-900'>{esc(value)}</div><div class='mt-1.5 text-sm text-stone-500'>{esc(label)}</div></div>"
    return f"<div class='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'><div class='text-3xl font-semibold tracking-tight text-slate-950'>{esc(value)}</div><div class='mt-1.5 text-sm text-slate-500'>{esc(label)}</div></div>"


def render_proof_list(items: list[Any], design_mode: str = "") -> str:
    clean = normalize_list_items(items)
    if not clean:
        return ""
    family = _mode_family(design_mode)
    if family == "editorial":
        return "<div class='mt-6 grid gap-2'>" + "".join(
            f"<div class='flex items-center gap-3 text-sm text-stone-700'><span class='h-px w-4 bg-stone-400'></span>{esc(p)}</div>"
            for p in clean
        ) + "</div>"
    if family == "direct":
        return "<div class='mt-4 grid gap-1'>" + "".join(
            f"<div class='flex items-center gap-2 text-sm font-medium text-slate-800'><span class='text-emerald-500'>&#10003;</span>{esc(p)}</div>"
            for p in clean
        ) + "</div>"
    return "<div class='mt-6 grid gap-2'>" + "".join(
        f"<div class='flex items-center gap-3 text-sm text-slate-600'><span class='h-1.5 w-1.5 rounded-full bg-accent'></span>{esc(p)}</div>"
        for p in clean
    ) + "</div>"


def render_story_row(title: str, description: str, idx: int, tone: dict[str, str], design_mode: str = "") -> str:
    family = _mode_family(design_mode)
    if family == "editorial":
        return (
            f"<article class='grid gap-8 py-8 lg:grid-cols-[0.3fr_1fr] lg:items-start' style='border-top:1px solid rgba(120,113,108,0.15)'>"
            f"<div class='text-xs font-medium uppercase tracking-[0.2em] text-stone-400'>{idx + 1:02d}</div>"
            f"<div><h3 class='text-xl font-semibold tracking-tight text-stone-900'>{esc(title)}</h3>"
            f"<p class='mt-3 max-w-xl text-sm leading-7 text-stone-600'>{esc(description)}</p></div></article>"
        )
    if family == "direct":
        return (
            f"<article class='flex gap-4 rounded-lg border border-slate-200 bg-white p-4'>"
            f"<div class='grid h-8 w-8 shrink-0 place-items-center rounded-md bg-slate-100 text-xs font-bold text-slate-600'>{idx + 1}</div>"
            f"<div><h3 class='text-base font-bold text-slate-950'>{esc(title)}</h3>"
            f"<p class='mt-1 text-sm leading-6 text-slate-600'>{esc(description)}</p></div></article>"
        )
    if family in {"glass", "b2b"}:
        return (
            f"<article class='grid gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[auto_1fr] lg:items-start'>"
            f"<div class='grid h-10 w-10 place-items-center rounded-lg bg-slate-900 text-sm font-bold text-white'>{idx + 1:02d}</div>"
            f"<div><h3 class='text-lg font-bold tracking-tight text-slate-950'>{esc(title)}</h3>"
            f"<p class='mt-2 text-sm leading-7 text-slate-500'>{esc(description)}</p></div></article>"
        )
    return (
        f"<article class='grid gap-6 border p-8 {tone['card']} {tone['radius_block']} lg:grid-cols-[0.55fr_1fr] lg:items-start'>"
        f"<div class='text-sm font-semibold uppercase tracking-[0.18em] {tone['muted']}'>Why it matters</div>"
        f"<div><h3 class='text-2xl font-semibold tracking-tight text-slate-950'>{esc(title)}</h3>"
        f"<p class='mt-4 max-w-2xl text-base leading-8 text-slate-600'>{esc(description)}</p></div></article>"
    )


def render_split_panel(title: str, description: str, idx: int, tone: dict[str, str], design_mode: str = "") -> str:
    family = _mode_family(design_mode)
    flip = "lg:grid-cols-[1fr_1.1fr]" if idx % 2 == 0 else "lg:grid-cols-[1.1fr_1fr]"
    gradient = "bg-[linear-gradient(135deg,theme(colors.brand/.14),theme(colors.accent/.10))]"
    if family == "editorial":
        return (
            f"<article class='grid gap-8 {flip} lg:items-center'>"
            f"<div class='aspect-[4/3] rounded-xl {gradient}'></div>"
            f"<div class='max-w-md'><h3 class='text-2xl font-semibold tracking-[-0.03em] text-stone-900'>{esc(title)}</h3>"
            f"<p class='mt-4 text-sm leading-[1.85] text-stone-600'>{esc(description)}</p></div></article>"
        )
    if family in {"glass", "b2b"}:
        return (
            f"<article class='grid gap-6 rounded-xl border border-slate-200 bg-white shadow-sm {flip} lg:items-center overflow-hidden'>"
            f"<div class='aspect-[4/3] {gradient}'></div>"
            f"<div class='p-6 lg:p-8'><h3 class='text-xl font-bold tracking-tight text-slate-950'>{esc(title)}</h3>"
            f"<p class='mt-3 text-sm leading-7 text-slate-500'>{esc(description)}</p></div></article>"
        )
    return (
        f"<article class='grid gap-6 {flip} lg:items-center border p-6 {tone['card']} {tone['radius_block']}'>"
        f"<div class='aspect-[5/3] {tone['radius_block']} {gradient}'></div>"
        f"<div><h3 class='text-xl font-semibold tracking-tight text-slate-950'>{esc(title)}</h3>"
        f"<p class='mt-3 text-sm leading-7 text-slate-600'>{esc(description)}</p></div></article>"
    )


def pick_card_classes(design_mode: str, section_type: str, variant: str) -> dict[str, str]:
    family = _mode_family(design_mode)
    if family == "editorial":
        return {
            "wrapper": "border border-stone-200/50 bg-[#fffaf2] rounded-xl shadow-[0_18px_50px_rgba(71,55,32,0.06)]",
            "padding": "p-7",
            "title": "text-lg font-semibold tracking-[-0.02em] text-stone-900",
            "desc": "mt-3 text-sm leading-[1.85] text-stone-600",
            "badge": "text-[0.6rem] font-medium uppercase tracking-[0.2em] text-stone-400",
        }
    if family == "soft":
        return {
            "wrapper": "border border-rose-100/60 bg-white rounded-2xl shadow-[0_20px_50px_rgba(190,24,93,0.06)]",
            "padding": "p-7",
            "title": "text-lg font-semibold tracking-tight text-stone-900",
            "desc": "mt-3 text-sm leading-7 text-stone-600",
            "badge": "text-xs font-semibold uppercase tracking-[0.14em] text-rose-600",
        }
    if family == "warm":
        return {
            "wrapper": "border border-orange-100 bg-white rounded-xl shadow-[0_14px_36px_rgba(234,88,12,0.08)]",
            "padding": "p-5",
            "title": "text-base font-semibold tracking-tight text-slate-950",
            "desc": "mt-2 text-sm leading-7 text-slate-600",
            "badge": "text-xs font-semibold uppercase tracking-[0.1em] text-orange-600",
        }
    if family == "direct":
        return {
            "wrapper": "border border-slate-200 bg-white rounded-lg shadow-[0_6px_16px_rgba(15,23,42,0.04)]",
            "padding": "p-4",
            "title": "text-base font-bold text-slate-950",
            "desc": "mt-1.5 text-sm leading-6 text-slate-600",
            "badge": "text-[0.65rem] font-bold uppercase tracking-[0.08em] text-slate-500",
        }
    if family == "clinical":
        return {
            "wrapper": "border border-slate-200 bg-white rounded-xl shadow-[0_8px_24px_rgba(15,23,42,0.04)]",
            "padding": "p-5",
            "title": "text-base font-semibold text-slate-950",
            "desc": "mt-2 text-sm leading-7 text-slate-600",
            "badge": "text-xs font-medium uppercase tracking-[0.12em] text-slate-500",
        }
    if family == "glass":
        return {
            "wrapper": "border border-slate-200/80 bg-white rounded-2xl shadow-[0_16px_44px_rgba(37,99,235,0.08)]",
            "padding": "p-6",
            "title": "text-lg font-semibold tracking-tight text-slate-950",
            "desc": "mt-3 text-sm leading-7 text-slate-500",
            "badge": "text-xs font-semibold uppercase tracking-[0.12em] text-brand",
        }
    if family == "b2b":
        return {
            "wrapper": "border border-slate-200 bg-white rounded-xl shadow-[0_10px_28px_rgba(15,23,42,0.04)]",
            "padding": "p-5",
            "title": "text-base font-bold tracking-tight text-slate-950",
            "desc": "mt-2 text-sm leading-7 text-slate-500",
            "badge": "text-xs font-bold uppercase tracking-[0.1em] text-slate-400",
        }
    return {
        "wrapper": "border border-slate-200/80 bg-white rounded-2xl shadow-[0_18px_50px_rgba(37,99,235,0.10)]",
        "padding": "p-6",
        "title": "text-xl font-semibold tracking-tight text-slate-950",
        "desc": "mt-3 text-sm leading-7 text-slate-600",
        "badge": "text-xs font-semibold uppercase tracking-[0.18em] text-slate-500",
    }


def render_card_block(title: str, description: str, idx: int, design_mode: str = "", badge_text: str = "") -> str:
    cs = pick_card_classes(design_mode, "", "")
    badge_cls = cs["badge"]
    label = badge_text if badge_text else f"{idx + 1:02d}"
    badge = f"<div class='mb-3 {badge_cls}'>{esc(label)}</div>"
    return (
        f"<article class='{cs['wrapper']} {cs['padding']}'>"
        f"{badge}"
        f"<h3 class='{cs['title']}'>{esc(title)}</h3>"
        f"<p class='{cs['desc']}'>{esc(description)}</p></article>"
    )


def render_items_grid(
    items: list[dict[str, Any]],
    card_builder: Any,
    grid_classes: str,
    tone: dict[str, str],
    design_mode: str = "",
) -> str:
    cards = "".join(card_builder(idx, item) for idx, item in enumerate(items))
    if not cards:
        return ""
    family = _mode_family(design_mode)
    if family == "editorial":
        gap = "gap-8"
    elif family == "direct":
        gap = "gap-3"
    elif family in {"glass", "b2b"}:
        gap = "gap-5"
    elif family == "soft":
        gap = "gap-7"
    else:
        gap = tone.get("section_gap", "gap-6")
    return f"<div class='mt-10 grid {gap} {grid_classes}'>{cards}</div>"


def pick_shell_padding(design_mode: str, section_type: str) -> str:
    family = _mode_family(design_mode)
    if family == "editorial":
        if section_type in {"hero", "cta-band", "footer"}:
            return "96px 0"
        return "80px 0"
    if family == "direct":
        if section_type in {"hero"}:
            return "48px 0"
        if section_type in {"cta-band", "footer"}:
            return "40px 0"
        return "40px 0"
    if family == "clinical":
        return "56px 0"
    if family == "soft":
        if section_type in {"hero", "cta-band"}:
            return "88px 0"
        return "72px 0"
    if family in {"glass", "b2b"}:
        if section_type in {"hero"}:
            return "72px 0"
        return "64px 0"
    return "72px 0"


def section_shell(section: dict[str, Any], inner: str, design_mode: str = "") -> str:
    stype = section.get("type", "")
    style = section.get("style", {})
    bg = style.get("backgroundColor", "#ffffff")
    fg = style.get("textColor", "#0f172a")
    default_pad = pick_shell_padding(design_mode, stype)
    padding = style.get("padding", default_pad)
    surface = esc(style.get("surface", "solid"))
    emphasis = esc(style.get("emphasis", "medium"))
    motion = esc(section.get("motionHint", ""))
    layout = esc(section.get("layoutHint", ""))
    family = _mode_family(design_mode)
    if family == "editorial":
        container = "mx-auto w-full max-w-6xl px-8 lg:px-10"
    elif family == "direct":
        container = "mx-auto w-full max-w-7xl px-5 lg:px-6"
    elif family in {"glass", "b2b"}:
        container = "mx-auto w-full max-w-7xl px-6 lg:px-8"
    else:
        container = "mx-auto w-full max-w-7xl px-6 lg:px-8"
    return (
        f'<section id="{esc(section.get("id", ""))}" data-motion="{motion}" data-layout="{layout}" '
        f'data-surface="{surface}" data-emphasis="{emphasis}" style="background:{bg};color:{fg};padding:{padding};">'
        f"<div class='{container}'>{inner}</div></section>"
    )


def _render_hero(section, content, variant, tone, actions, design_mode, family):
    eyebrow_text = extract_text(content.get("eyebrow", ""))
    heading_text = extract_text(content.get("heading", ""))
    subheading_text = extract_text(content.get("subheading", ""))
    badge_text = extract_text(content.get("badge", ""))
    cta_note = extract_text(content.get("ctaNote", ""))
    support_pts = normalize_list_items(content.get("supportingPoints", []))
    trust_chips = normalize_list_items(content.get("trustChips", []))

    # Build hero intro block — varies by family
    if family == "editorial":
        eyebrow = f"<div class='mb-4 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-stone-500'>{esc(eyebrow_text)}</div>" if eyebrow_text else ""
        hero_intro = (
            eyebrow
            + f"<h1 class='max-w-3xl text-balance text-4xl font-semibold tracking-[-0.05em] text-stone-950 sm:text-5xl lg:text-6xl'>{esc(heading_text)}</h1>"
            + f"<p class='mt-7 max-w-xl text-base leading-[1.85] text-stone-600'>{esc(subheading_text)}</p>"
            + render_supporting_points(support_pts, design_mode)
            + f"<div class='mt-10 flex flex-wrap gap-4'>{render_buttons(content.get('buttons', []), actions, tone)}</div>"
            + (f"<p class='mt-4 text-sm text-stone-500'>{esc(cta_note)}</p>" if cta_note else "")
        )
    elif family == "direct":
        eyebrow = f"<div class='mb-1 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-slate-500'>{esc(eyebrow_text)}</div>" if eyebrow_text else ""
        hero_intro = (
            eyebrow
            + f"<h1 class='max-w-3xl text-balance text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl'>{esc(heading_text)}</h1>"
            + f"<p class='mt-3 max-w-2xl text-sm leading-7 text-slate-600'>{esc(subheading_text)}</p>"
            + render_supporting_points(support_pts, design_mode)
            + f"<div class='mt-5 flex flex-wrap gap-2'>{render_buttons(content.get('buttons', []), actions, tone)}</div>"
            + (f"<p class='mt-2 text-xs font-medium text-slate-500'>{esc(cta_note)}</p>" if cta_note else "")
        )
    elif family in {"glass", "b2b"}:
        eyebrow = f"<div class='mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-400'>{esc(eyebrow_text)}</div>" if eyebrow_text else ""
        hero_intro = (
            eyebrow
            + f"<h1 class='{tone['hero_title']}'>{esc(heading_text)}</h1>"
            + f"<p class='mt-5 max-w-2xl text-lg leading-8 text-slate-500'>{esc(subheading_text)}</p>"
            + render_supporting_points(support_pts, design_mode)
            + f"<div class='mt-8 flex flex-wrap gap-3'>{render_buttons(content.get('buttons', []), actions, tone)}</div>"
            + (f"<p class='mt-3 text-sm text-slate-400'>{esc(cta_note)}</p>" if cta_note else "")
        )
    elif family == "soft":
        eyebrow = f"<div class='mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-rose-600'>{esc(eyebrow_text)}</div>" if eyebrow_text else ""
        hero_intro = (
            eyebrow
            + f"<h1 class='max-w-3xl text-balance text-4xl font-semibold tracking-[-0.04em] text-stone-950 sm:text-5xl lg:text-6xl'>{esc(heading_text)}</h1>"
            + f"<p class='mt-6 max-w-xl text-base leading-8 text-stone-600'>{esc(subheading_text)}</p>"
            + render_supporting_points(support_pts, design_mode)
            + f"<div class='mt-8 flex flex-wrap gap-3'>{render_buttons(content.get('buttons', []), actions, tone)}</div>"
            + (f"<p class='mt-4 text-sm text-stone-500'>{esc(cta_note)}</p>" if cta_note else "")
        )
    else:
        eyebrow = f"<div class='mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-current/70'>{esc(eyebrow_text)}</div>" if eyebrow_text else ""
        hero_intro = (
            eyebrow
            + f"<h1 class='{tone['hero_title']}'>{esc(heading_text)}</h1>"
            + f"<p class='mt-6 max-w-3xl text-lg leading-8 text-current/80'>{esc(subheading_text)}</p>"
            + render_supporting_points(support_pts, design_mode)
            + f"<div class='mt-8 flex flex-wrap gap-3'>{render_buttons(content.get('buttons', []), actions, tone)}</div>"
            + (f"<p class='mt-4 text-sm text-current/70'>{esc(cta_note)}</p>" if cta_note else "")
        )

    # --- Variant: centered ---
    if variant == "centered":
        if family == "editorial":
            inner = (
                f"<div class='mx-auto max-w-3xl py-16 text-center'>"
                + hero_intro
                + render_trust_chips(trust_chips, design_mode)
                + "</div>"
            )
        elif family == "direct":
            inner = (
                f"<div class='mx-auto max-w-3xl py-8 text-center'>"
                + hero_intro
                + render_trust_chips(trust_chips, design_mode)
                + "</div>"
            )
        else:
            inner = (
                f"<div class='mx-auto max-w-4xl {tone['hero_pad']} text-center'>"
                + hero_intro
                + render_trust_chips(trust_chips, design_mode)
                + "</div>"
            )
        return section_shell(section, inner, design_mode)

    # --- Variant: offer-focused ---
    if variant == "offer-focused":
        proof_items = normalize_list_items(support_pts[:3] or trust_chips[:3])
        if family == "direct":
            aside_items = "".join(
                f"<div class='flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800'><span class='text-emerald-500 font-bold'>&#10003;</span>{esc(p)}</div>"
                for p in proof_items
            )
            aside = (
                f"<div class='rounded-lg border border-slate-200 bg-white p-4 shadow-sm'>"
                + (f"<div class='mb-3 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-slate-500'>{esc(badge_text)}</div>" if badge_text else "")
                + f"<div class='grid gap-2'>{aside_items}</div>"
                + (f"<div class='mt-3 rounded-lg bg-slate-900 px-4 py-3 text-sm font-bold text-white'>{esc(cta_note)}</div>" if cta_note else "")
                + "</div>"
            )
            inner = (
                f"<div class='grid gap-4 py-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start'>"
                f"<div>{hero_intro}</div><div>{aside}</div></div>"
            )
        elif family == "editorial":
            aside_items = "".join(
                f"<div class='border-b border-stone-200/60 py-3 text-sm text-stone-700'>{esc(p)}</div>"
                for p in proof_items
            )
            aside = (
                f"<div class='rounded-xl border border-stone-200/50 bg-[#fffaf2] p-6'>"
                + (f"<div class='mb-4 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-stone-400'>{esc(badge_text)}</div>" if badge_text else "")
                + f"{aside_items}"
                + (f"<div class='mt-4 text-sm font-semibold text-stone-800'>{esc(cta_note)}</div>" if cta_note else "")
                + "</div>"
            )
            inner = (
                f"<div class='grid gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start'>"
                f"<div>{hero_intro}</div><div>{aside}</div></div>"
            )
        else:
            aside_items = "".join(
                f"<div class='rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800'>{esc(p)}</div>"
                for p in proof_items
            )
            aside = (
                f"<div class='border {tone['card']} {tone['radius_block']} p-6 lg:p-8'>"
                + (f"<div class='text-sm font-semibold uppercase tracking-[0.18em] {tone['muted']}'>{esc(badge_text)}</div>" if badge_text else "")
                + f"<div class='mt-5 grid gap-3'>{aside_items}</div>"
                + (f"<div class='mt-3 rounded-xl bg-slate-950 px-4 py-4 text-sm font-semibold text-white'>{esc(cta_note)}</div>" if cta_note else "")
                + "</div>"
            )
            inner = (
                f"<div class='grid {tone['section_gap']} {tone['hero_pad']} lg:grid-cols-[1.1fr_0.9fr] lg:items-start {tone['hero_frame']} {tone['radius_hero']}'>"
                f"<div>{hero_intro}</div><div>{aside}</div></div>"
            )
        return section_shell(section, inner, design_mode)

    # --- Variant: split-image ---
    if variant == "split-image":
        if family == "editorial":
            aside = (
                "<div class='relative overflow-hidden rounded-xl'>"
                + "<div class='aspect-[4/5] bg-[linear-gradient(160deg,rgba(247,241,232,0.9),rgba(255,250,242,0.4))] ring-1 ring-stone-200/50'></div>"
                + "</div>"
            )
            inner = (
                f"<div class='grid gap-12 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center'>"
                f"<div>{hero_intro}</div><div>{aside}</div></div>"
            )
        elif family in {"glass", "b2b"}:
            aside = (
                f"<div class='relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-lg'>"
                + "<div class='absolute inset-x-6 top-6 h-24 rounded-full bg-brand/15 blur-3xl'></div>"
                + "<div class='relative aspect-[4/5] rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 ring-1 ring-slate-200'></div>"
                + render_trust_chips(trust_chips[:3], design_mode)
                + "</div>"
            )
            inner = (
                f"<div class='grid gap-8 {tone['hero_pad']} lg:grid-cols-[0.9fr_1.1fr] lg:items-center {tone['hero_frame']} {tone['radius_hero']}'>"
                f"<div>{hero_intro}</div><div>{aside}</div></div>"
            )
        elif family == "direct":
            aside = (
                "<div class='relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50'>"
                + "<div class='aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-50'></div>"
                + "</div>"
            )
            inner = (
                f"<div class='grid gap-4 py-6 lg:grid-cols-[1fr_1fr] lg:items-center'>"
                f"<div>{hero_intro}</div><div>{aside}</div></div>"
            )
        else:
            aside = (
                f"<div class='relative overflow-hidden border {tone['card']} {tone['radius_hero']} p-6 lg:p-8'>"
                + "<div class='absolute inset-x-8 top-8 h-28 rounded-full bg-accent/25 blur-3xl'></div>"
                + f"<div class='relative aspect-[4/5] {tone['radius_block']} bg-[linear-gradient(160deg,rgba(255,255,255,0.92),rgba(255,255,255,0.12))] ring-1 ring-white/30'></div>"
                + render_trust_chips(trust_chips[:3], design_mode)
                + "</div>"
            )
            inner = (
                f"<div class='grid {tone['section_gap']} {tone['hero_pad']} lg:grid-cols-[0.9fr_1.1fr] lg:items-center {tone['hero_frame']} {tone['radius_hero']}'>"
                f"<div>{hero_intro}</div><div>{aside}</div></div>"
            )
        return section_shell(section, inner, design_mode)

    # --- Variant: trust-panel ---
    if variant == "trust-panel":
        panel_items = normalize_list_items(trust_chips[:4] or support_pts[:4])
        if family == "direct":
            aside_items = "".join(
                f"<div class='flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800'><span class='text-emerald-500'>&#10003;</span>{esc(p)}</div>"
                for p in panel_items
            )
            aside = f"<div class='rounded-lg border border-slate-200 bg-slate-50 p-3'><div class='grid gap-1.5'>{aside_items}</div></div>"
            inner = (
                f"<div class='grid gap-4 py-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center'>"
                f"<div>{hero_intro}</div><div>{aside}</div></div>"
            )
        elif family == "editorial":
            aside_items = "".join(
                f"<div class='border-b border-stone-200/40 py-3.5 text-sm font-medium text-stone-700'>{esc(p)}</div>"
                for p in panel_items
            )
            aside = (
                f"<div class='rounded-xl border border-stone-200/50 bg-[#fbf7f0] p-7'>"
                + (f"<div class='mb-4 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-stone-400'>{esc(badge_text)}</div>" if badge_text else "")
                + f"{aside_items}</div>"
            )
            inner = (
                f"<div class='grid gap-10 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center'>"
                f"<div>{hero_intro}{render_trust_chips(trust_chips, design_mode)}</div><div>{aside}</div></div>"
            )
        elif family in {"glass", "b2b"}:
            aside_items = "".join(
                f"<div class='rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-800 shadow-sm'>{esc(p)}</div>"
                for p in panel_items
            )
            aside = (
                f"<div class='rounded-2xl border border-slate-200 bg-slate-50 p-5'>"
                + (f"<div class='mb-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-400'>{esc(badge_text)}</div>" if badge_text else "")
                + f"<div class='grid gap-2'>{aside_items}</div></div>"
            )
            inner = (
                f"<div class='grid gap-8 {tone['hero_pad']} lg:grid-cols-[1.15fr_0.85fr] lg:items-center {tone['hero_frame']} {tone['radius_hero']}'>"
                f"<div>{hero_intro}</div><div>{aside}</div></div>"
            )
        else:
            aside_items = "".join(
                f"<div class='rounded-2xl border border-white/20 bg-white/60 px-4 py-4'><div class='text-sm font-semibold text-slate-950'>{esc(p)}</div></div>"
                for p in panel_items
            )
            aside = (
                f"<div class='border {tone['panel']} {tone['radius_block']} p-6 lg:p-8'>"
                + (f"<div class='mb-4 inline-flex rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-900'>{esc(badge_text)}</div>" if badge_text else "")
                + f"<div class='grid gap-3'>{aside_items}</div></div>"
            )
            inner = (
                f"<div class='grid {tone['section_gap']} {tone['hero_pad']} lg:grid-cols-[1.15fr_0.85fr] lg:items-center {tone['hero_frame']} {tone['radius_hero']}'>"
                f"<div>{hero_intro}{render_trust_chips(trust_chips, design_mode)}</div><div>{aside}</div></div>"
            )
        return section_shell(section, inner, design_mode)

    # --- Default hero ---
    combined = normalize_list_items(support_pts[:2]) + normalize_list_items(trust_chips[:2])
    if family == "direct":
        aside_items = "".join(
            f"<div class='rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700'>{esc(p)}</div>"
            for p in combined
        )
        aside = f"<div class='rounded-lg border border-slate-200 bg-slate-50 p-3'><div class='grid gap-1.5'>{aside_items}</div></div>"
        inner = f"<div class='grid gap-4 py-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center'><div>{hero_intro}</div><div>{aside}</div></div>"
    elif family == "editorial":
        aside_items = "".join(
            f"<div class='border-b border-stone-200/40 py-3 text-sm text-stone-600'>{esc(p)}</div>"
            for p in combined
        )
        aside = f"<div class='rounded-xl border border-stone-200/50 bg-[#fbf7f0] p-6'>{aside_items}</div>"
        inner = f"<div class='grid gap-10 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center'><div>{hero_intro}</div><div>{aside}</div></div>"
    else:
        aside_items = "".join(
            f"<div class='rounded-2xl border border-white/20 bg-white/10 px-4 py-4 text-sm'>{esc(p)}</div>"
            for p in combined
        )
        aside = (
            f"<div class='border {tone['panel']} {tone['radius_block']} p-6 lg:p-8'>"
            + (f"<div class='mb-4 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]'>{esc(badge_text)}</div>" if badge_text else "")
            + f"<div class='grid gap-4'>{aside_items}</div></div>"
        )
        inner = (
            f"<div class=\"grid {tone['section_gap']} {tone['hero_pad']} lg:grid-cols-[1.2fr_0.8fr] lg:items-center {tone['hero_frame']} {tone['radius_hero']}\">"
            f"<div>{hero_intro}</div><div>{aside}</div></div>"
        )
    return section_shell(section, inner, design_mode)


def _render_trust_bar(section, content, tone, design_mode, family):
    raw_items = normalize_list_items(content.get("items", []))
    if family == "direct":
        items_html = "".join(
            f"<span class='rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700'>{esc(item)}</span>"
            for item in raw_items
        )
    elif family == "editorial":
        items_html = "".join(
            f"<span class='border-b border-stone-300/40 pb-0.5 text-xs font-medium tracking-wide text-stone-600'>{esc(item)}</span>"
            for item in raw_items
        )
    elif family == "soft":
        items_html = "".join(
            f"<span class='rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-stone-700 backdrop-blur'>{esc(item)}</span>"
            for item in raw_items
        )
    else:
        items_html = "".join(
            f"<span class='rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm'>{esc(item)}</span>"
            for item in raw_items
        )
    return section_shell(section, f"<div class='flex flex-wrap justify-center gap-3'>{items_html}</div>", design_mode)


def _render_services(section, content, variant, tone, actions, design_mode, family, _intro):
    items = normalize_dict_items(content.get("items", []))
    cs = pick_card_classes(design_mode, "services", variant)

    if variant in {"alternating-rows", "story"} or (family in {"editorial", "glass", "b2b"} and variant != "icon-list" and len(items) <= 4):
        # Use split panels or story rows instead of card grid
        if variant == "story" or family == "editorial":
            rows = "".join(
                render_story_row(item["title"], item["description"], idx, tone, design_mode)
                for idx, item in enumerate(items)
            )
        else:
            rows = "".join(
                render_split_panel(item["title"], item["description"], idx, tone, design_mode)
                for idx, item in enumerate(items)
            )
        inner = _intro() + f"<div class='mt-10 grid gap-6'>{rows}</div>"
        return section_shell(section, inner, design_mode)

    if variant == "icon-list" or family == "direct":
        # Compact list layout
        def card_builder(idx, item):
            if family == "direct":
                return (
                    f"<article class='flex gap-3 rounded-lg border border-slate-200 bg-white p-3.5'>"
                    f"<div class='grid h-8 w-8 shrink-0 place-items-center rounded-md bg-accent/12 text-xs font-bold text-slate-800'>{idx + 1:02d}</div>"
                    f"<div><h3 class='text-sm font-bold text-slate-950'>{esc(item['title'])}</h3><p class='mt-0.5 text-xs leading-5 text-slate-600'>{esc(item['description'])}</p></div></article>"
                )
            return (
                f"<article class='grid gap-4 {cs['wrapper']} {cs['padding']} md:grid-cols-[auto_1fr] md:items-start'>"
                f"<div class='grid h-10 w-10 place-items-center rounded-xl bg-accent/15 text-xs font-semibold text-slate-900'>{idx + 1:02d}</div>"
                f"<div><h3 class='{cs['title']}'>{esc(item['title'])}</h3><p class='{cs['desc']}'>{esc(item['description'])}</p></div></article>"
            )
        inner = _intro() + render_items_grid(items, card_builder, "lg:grid-cols-2", tone, design_mode)
        return section_shell(section, inner, design_mode)

    # Default: card grid
    def card_builder(idx, item):
        badge_label = f"Service {idx + 1}" if family != "editorial" else f"{idx + 1:02d}"
        return (
            f"<article class='{cs['wrapper']} {cs['padding']}'>"
            f"<div class='mb-3 {cs['badge']}'>{esc(badge_label)}</div>"
            f"<h3 class='{cs['title']}'>{esc(item['title'])}</h3>"
            f"<p class='{cs['desc']}'>{esc(item['description'])}</p></article>"
        )
    cols = "md:grid-cols-2 xl:grid-cols-3" if len(items) >= 3 else "md:grid-cols-2"
    inner = _intro() + render_items_grid(items, card_builder, cols, tone, design_mode)
    return section_shell(section, inner, design_mode)


def _render_features(section, content, variant, tone, design_mode, family, _intro, stype):
    items = normalize_dict_items(content.get("items", []))
    cs = pick_card_classes(design_mode, stype, variant)

    if variant == "alternating-rows" or (family in {"editorial"} and len(items) <= 4):
        rows = "".join(
            render_split_panel(item["title"], item["description"], idx, tone, design_mode)
            for idx, item in enumerate(items)
        )
        inner = _intro() + f"<div class='mt-10 grid gap-8'>{rows}</div>"
        return section_shell(section, inner, design_mode)

    if variant == "values":
        def card_builder(idx, item):
            return (
                f"<article class='{cs['wrapper']} {cs['padding']}'>"
                f"<div class='{cs['badge']}'>Value</div>"
                f"<h3 class='mt-2 {cs['title']}'>{esc(item['title'])}</h3>"
                f"<p class='{cs['desc']}'>{esc(item['description'])}</p></article>"
            )
        inner = _intro() + render_items_grid(items, card_builder, "sm:grid-cols-2 xl:grid-cols-4", tone, design_mode)
        return section_shell(section, inner, design_mode)

    if variant == "icon-list" or family == "direct":
        def card_builder(idx, item):
            if family == "direct":
                return (
                    f"<article class='flex gap-3 rounded-lg border border-slate-200 bg-white p-3.5'>"
                    f"<div class='grid h-8 w-8 shrink-0 place-items-center rounded-md bg-slate-100 text-xs font-bold text-slate-600'>{idx + 1:02d}</div>"
                    f"<div><h3 class='text-sm font-bold text-slate-950'>{esc(item['title'])}</h3><p class='mt-0.5 text-xs leading-5 text-slate-600'>{esc(item['description'])}</p></div></article>"
                )
            return (
                f"<article class='flex gap-4 {cs['wrapper']} {cs['padding']}'>"
                f"<div class='grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent/15 text-sm font-semibold text-slate-900'>{idx + 1:02d}</div>"
                f"<div><h3 class='{cs['title']}'>{esc(item['title'])}</h3><p class='{cs['desc']}'>{esc(item['description'])}</p></div></article>"
            )
        inner = _intro() + render_items_grid(items, card_builder, "lg:grid-cols-2", tone, design_mode)
        return section_shell(section, inner, design_mode)

    # Narrative stacked rows for benefits in soft/warm modes
    if stype == "benefits" and family in {"soft", "warm"} and len(items) <= 5:
        rows = "".join(
            render_story_row(item["title"], item["description"], idx, tone, design_mode)
            for idx, item in enumerate(items)
        )
        inner = _intro() + f"<div class='mt-10 grid gap-4'>{rows}</div>"
        return section_shell(section, inner, design_mode)

    # Default: card grid
    def card_builder(idx, item):
        return (
            f"<article class='{cs['wrapper']} {cs['padding']}'>"
            f"<h3 class='{cs['title']}'>{esc(item['title'])}</h3>"
            f"<p class='{cs['desc']}'>{esc(item['description'])}</p></article>"
        )
    cols = "md:grid-cols-2 xl:grid-cols-3" if len(items) >= 3 else "md:grid-cols-2"
    inner = _intro() + render_items_grid(items, card_builder, cols, tone, design_mode)
    return section_shell(section, inner, design_mode)


def _render_about_team(section, content, variant, tone, design_mode, family, _intro):
    items = normalize_dict_items(content.get("items", []))
    cs = pick_card_classes(design_mode, "about-team", variant)

    if variant == "story" or family == "editorial":
        rows = "".join(
            render_split_panel(item["title"], item["description"], idx, tone, design_mode)
            for idx, item in enumerate(items)
        )
        inner = _intro() + f"<div class='mt-10 grid gap-8'>{rows}</div>"
        return section_shell(section, inner, design_mode)

    # People-oriented: photo placeholder + text
    def card_builder(idx, item):
        gradient = "bg-[linear-gradient(135deg,theme(colors.brand/.16),theme(colors.accent/.10))]"
        if family == "direct":
            return (
                f"<article class='rounded-lg border border-slate-200 bg-white overflow-hidden'>"
                f"<div class='aspect-[4/3] {gradient}'></div>"
                f"<div class='p-3.5'><h3 class='text-sm font-bold text-slate-950'>{esc(item['title'])}</h3>"
                f"<p class='mt-1 text-xs leading-5 text-slate-600'>{esc(item['description'])}</p></div></article>"
            )
        return (
            f"<article class='{cs['wrapper']} overflow-hidden'>"
            f"<div class='aspect-[4/3] {gradient}'></div>"
            f"<div class='{cs['padding']}'><h3 class='{cs['title']}'>{esc(item['title'])}</h3>"
            f"<p class='{cs['desc']}'>{esc(item['description'])}</p></div></article>"
        )
    cols = "md:grid-cols-2 xl:grid-cols-3" if len(items) >= 3 else "md:grid-cols-2"
    inner = _intro() + render_items_grid(items, card_builder, cols, tone, design_mode)
    return section_shell(section, inner, design_mode)


def _render_gallery(section, content, variant, tone, design_mode, family, _intro):
    items = normalize_dict_items(content.get("items", []))
    cs = pick_card_classes(design_mode, "gallery", variant)
    gradient = "bg-[linear-gradient(145deg,theme(colors.brand/.16),theme(colors.accent/.18))]"

    if family == "editorial":
        # Masonry-like staggered layout
        card_parts = []
        for idx, item in enumerate(items):
            aspect = "4/3" if idx % 2 == 0 else "3/4"
            card_parts.append(
                f"<article class='overflow-hidden rounded-xl border border-stone-200/50 bg-[#fffaf2]'>"
                f"<div class='aspect-[{aspect}] {gradient}'></div>"
                f"<div class='p-5'><h3 class='text-base font-semibold tracking-tight text-stone-900'>{esc(item['title'])}</h3>"
                f"<p class='mt-2 text-sm leading-[1.8] text-stone-600'>{esc(item['description'])}</p></div></article>"
            )
        cards = "".join(card_parts)
        inner = _intro() + f"<div class='mt-10 columns-1 gap-6 space-y-6 md:columns-2 xl:columns-3'>{cards}</div>"
        return section_shell(section, inner, design_mode)

    def card_builder(idx, item):
        return (
            f"<article class='{cs['wrapper']} overflow-hidden'>"
            f"<div class='aspect-[4/3] {gradient}'></div>"
            f"<div class='{cs['padding']}'><h3 class='{cs['title']}'>{esc(item.get('title', 'Preview'))}</h3>"
            f"<p class='{cs['desc']}'>{esc(item.get('description', ''))}</p></div></article>"
        )
    inner = _intro() + render_items_grid(items, card_builder, "md:grid-cols-2 xl:grid-cols-3", tone, design_mode)
    return section_shell(section, inner, design_mode)


def _render_problem_solution(section, content, tone, design_mode, family, _intro):
    problem = extract_text(content.get("problem", ""))
    solution = extract_text(content.get("solution", ""))
    cs = pick_card_classes(design_mode, "problem-solution", "")

    if family == "direct":
        inner = (
            _intro()
            + "<div class='mt-6 grid gap-3 lg:grid-cols-2'>"
            + f"<article class='rounded-lg border border-red-200 bg-red-50 p-4'><h3 class='text-sm font-bold text-red-800'>The Problem</h3><p class='mt-1.5 text-sm leading-6 text-red-700'>{esc(problem)}</p></article>"
            + f"<article class='rounded-lg border border-emerald-200 bg-emerald-50 p-4'><h3 class='text-sm font-bold text-emerald-800'>The Solution</h3><p class='mt-1.5 text-sm leading-6 text-emerald-700'>{esc(solution)}</p></article>"
            + "</div>"
        )
    elif family == "editorial":
        inner = (
            _intro()
            + "<div class='mt-10 grid gap-12 lg:grid-cols-2'>"
            + f"<article><div class='text-[0.6rem] font-medium uppercase tracking-[0.2em] text-stone-400'>The Challenge</div><p class='mt-4 text-base leading-[1.85] text-stone-700'>{esc(problem)}</p></article>"
            + f"<article><div class='text-[0.6rem] font-medium uppercase tracking-[0.2em] text-stone-400'>Our Approach</div><p class='mt-4 text-base leading-[1.85] text-stone-700'>{esc(solution)}</p></article>"
            + "</div>"
        )
    else:
        inner = (
            _intro()
            + "<div class='mt-10 grid gap-6 lg:grid-cols-2'>"
            + f"<article class='{cs['wrapper']} {cs['padding']}'><h3 class='{cs['title']}'>The Problem</h3><p class='{cs['desc']}'>{esc(problem)}</p></article>"
            + f"<article class='{cs['wrapper']} {cs['padding']}'><h3 class='{cs['title']}'>The Solution</h3><p class='{cs['desc']}'>{esc(solution)}</p></article>"
            + "</div>"
        )
    return section_shell(section, inner, design_mode)


def _render_how_it_works(section, content, tone, design_mode, family, _intro):
    steps = content.get("steps", [])
    cs = pick_card_classes(design_mode, "how-it-works", "")

    if family == "direct":
        steps_html = "".join(
            f"<article class='flex gap-3 rounded-lg border border-slate-200 bg-white p-3.5'>"
            f"<div class='grid h-8 w-8 shrink-0 place-items-center rounded-md bg-accent/15 text-xs font-bold text-slate-800'>{esc(extract_text(step.get('step', str(idx+1))))}</div>"
            f"<div><h3 class='text-sm font-bold text-slate-950'>{esc(extract_text(step.get('title', '')))}</h3>"
            f"<p class='mt-0.5 text-xs leading-5 text-slate-600'>{esc(extract_text(step.get('description', '')))}</p></div></article>"
            for idx, step in enumerate(steps)
        )
        inner = _intro() + f"<div class='mt-6 grid gap-2'>{steps_html}</div>"
    elif family == "editorial":
        steps_html = "".join(
            render_story_row(
                extract_text(step.get("title", "")),
                extract_text(step.get("description", "")),
                idx, tone, design_mode
            )
            for idx, step in enumerate(steps)
        )
        inner = _intro() + f"<div class='mt-10'>{steps_html}</div>"
    elif family in {"glass", "b2b"}:
        steps_html = "".join(
            f"<article class='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'>"
            f"<div class='grid h-9 w-9 place-items-center rounded-lg bg-slate-900 text-xs font-bold text-white'>{esc(extract_text(step.get('step', str(idx+1))))}</div>"
            f"<h3 class='mt-3 text-base font-bold tracking-tight text-slate-950'>{esc(extract_text(step.get('title', '')))}</h3>"
            f"<p class='mt-2 text-sm leading-7 text-slate-500'>{esc(extract_text(step.get('description', '')))}</p></article>"
            for idx, step in enumerate(steps)
        )
        cols = "lg:grid-cols-3" if len(steps) >= 3 else "lg:grid-cols-2"
        inner = _intro() + f"<div class='mt-10 grid gap-5 {cols}'>{steps_html}</div>"
    else:
        steps_html = "".join(
            f"<article class='{cs['wrapper']} {cs['padding']}'>"
            f"<div class='{cs['badge']}'>Step {esc(extract_text(step.get('step', str(idx+1))))}</div>"
            f"<h3 class='mt-3 {cs['title']}'>{esc(extract_text(step.get('title', '')))}</h3>"
            f"<p class='{cs['desc']}'>{esc(extract_text(step.get('description', '')))}</p></article>"
            for idx, step in enumerate(steps)
        )
        cols = "lg:grid-cols-3" if len(steps) >= 3 else "lg:grid-cols-2"
        inner = _intro() + f"<div class='mt-10 grid gap-6 {cols}'>{steps_html}</div>"
    return section_shell(section, inner, design_mode)


def _render_testimonials(section, content, variant, tone, design_mode, family, _intro):
    raw_items = content.get("items", [])

    if variant == "single-highlight" and raw_items:
        lead = raw_items[0]
        rest = raw_items[1:3]
        cs = pick_card_classes(design_mode, "testimonials", variant)

        if family == "editorial":
            aside = "".join(
                f"<blockquote class='border-l-2 border-stone-300/50 pl-5 py-2'>"
                f"<p class='text-sm leading-[1.85] text-stone-600 italic'>\u201c{esc(extract_text(item.get('quote', '')))}\u201d</p>"
                f"<footer class='mt-3 text-xs font-medium text-stone-500'>{esc(extract_text(item.get('author', '')))}</footer></blockquote>"
                for item in rest
            )
            inner = (
                _intro()
                + "<div class='mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]'>"
                + f"<blockquote class='rounded-xl bg-[#1f1812] p-8 text-[#f9f4ea]'>"
                + f"<p class='text-xl leading-[1.65] font-light'>\u201c{esc(extract_text(lead.get('quote', '')))}\u201d</p>"
                + f"<footer class='mt-6 text-sm font-medium text-white/60'>{esc(extract_text(lead.get('author', '')))}</footer></blockquote>"
                + f"<div class='grid content-start gap-6'>{aside}</div></div>"
            )
        elif family == "direct":
            aside = "".join(
                f"<blockquote class='rounded-lg border border-slate-200 bg-white p-3.5'>"
                f"<p class='text-xs leading-5 text-slate-600'>\u201c{esc(extract_text(item.get('quote', '')))}\u201d</p>"
                f"<footer class='mt-2 text-xs font-bold text-slate-800'>{esc(extract_text(item.get('author', '')))}</footer></blockquote>"
                for item in rest
            )
            inner = (
                _intro()
                + "<div class='mt-6 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]'>"
                + f"<blockquote class='rounded-lg bg-slate-900 p-5 text-white'>"
                + f"<p class='text-base leading-7 font-medium'>\u201c{esc(extract_text(lead.get('quote', '')))}\u201d</p>"
                + f"<footer class='mt-3 text-xs font-bold text-white/60'>{esc(extract_text(lead.get('author', '')))}</footer></blockquote>"
                + f"<div class='grid gap-2'>{aside}</div></div>"
            )
        else:
            aside = "".join(
                f"<blockquote class='{cs['wrapper']} {cs['padding']}'>"
                f"<p class='text-sm leading-7 text-slate-700'>\u201c{esc(extract_text(item.get('quote', '')))}\u201d</p>"
                f"<footer class='mt-4 text-sm font-semibold text-slate-900'>{esc(extract_text(item.get('author', '')))}</footer></blockquote>"
                for item in rest
            )
            inner = (
                _intro()
                + "<div class='mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]'>"
                + f"<blockquote class='p-8 {tone['dark_block']} {tone['radius_hero']}'>"
                + f"<p class='text-2xl leading-10'>\u201c{esc(extract_text(lead.get('quote', '')))}\u201d</p>"
                + f"<footer class='mt-6 text-sm font-semibold text-white/70'>{esc(extract_text(lead.get('author', '')))}</footer></blockquote>"
                + f"<div class='grid gap-4'>{aside}</div></div>"
            )
        return section_shell(section, inner, design_mode)

    # Grid testimonials
    cs = pick_card_classes(design_mode, "testimonials", variant)
    items_html = "".join(
        f"<blockquote class='{cs['wrapper']} {cs['padding']}'>"
        f"<p class='text-sm leading-7 text-slate-700'>\u201c{esc(extract_text(item.get('quote', '')))}\u201d</p>"
        f"<footer class='mt-4 text-sm font-semibold text-slate-900'>{esc(extract_text(item.get('author', '')))}</footer></blockquote>"
        for item in raw_items
    )
    cols = "lg:grid-cols-3" if variant == "avatars" else "lg:grid-cols-2 xl:grid-cols-3"
    gap = "gap-3" if family == "direct" else "gap-6"
    return section_shell(section, _intro() + f"<div class='mt-10 grid {gap} {cols}'>{items_html}</div>", design_mode)


def _render_results(section, content, tone, design_mode, family, _intro):
    stats_html = "".join(
        render_stat_chip(
            extract_text(item.get("value", "")),
            extract_text(item.get("label", "")),
            design_mode,
        )
        for item in content.get("stats", [])
    )
    gap = "gap-3" if family == "direct" else "gap-6"
    return section_shell(section, _intro() + f"<div class='mt-10 grid {gap} grid-cols-2 lg:grid-cols-4'>{stats_html}</div>", design_mode)


def _render_pricing(section, content, tone, design_mode, family, _intro):
    cs = pick_card_classes(design_mode, "pricing", "")
    plans = "".join(
        f"<article class='{cs['wrapper']} {cs['padding']}'>"
        f"<h3 class='{cs['title']}'>{esc(extract_text(plan.get('name', '')))}</h3>"
        f"<div class='mt-3 text-3xl font-bold tracking-tight text-slate-950'>{esc(extract_text(plan.get('price', '')))}</div>"
        f"<p class='{cs['desc']}'>{esc(extract_text(plan.get('description', '')))}</p>"
        f"<ul class='mt-4 grid gap-2 text-sm text-slate-700'>{''.join(f'<li>{esc(extract_text(f))}</li>' for f in plan.get('features', []))}</ul></article>"
        for plan in content.get("plans", [])
    )
    return section_shell(section, _intro() + f"<div class='mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-3'>{plans}</div>", design_mode)


def _render_faq(section, content, tone, design_mode, family, _intro):
    cs = pick_card_classes(design_mode, "faq", "")
    if family == "direct":
        items = "".join(
            f"<details class='rounded-lg border border-slate-200 bg-white p-3.5'>"
            f"<summary class='cursor-pointer list-none text-sm font-bold text-slate-950'>{esc(extract_text(item.get('question', '')))}</summary>"
            f"<p class='mt-2 text-xs leading-5 text-slate-600'>{esc(extract_text(item.get('answer', '')))}</p></details>"
            for item in content.get("items", [])
        )
        gap = "gap-2"
    elif family == "editorial":
        items = "".join(
            f"<details class='border-b border-stone-200/50 py-5'>"
            f"<summary class='cursor-pointer list-none text-base font-semibold tracking-tight text-stone-900'>{esc(extract_text(item.get('question', '')))}</summary>"
            f"<p class='mt-4 max-w-2xl text-sm leading-[1.85] text-stone-600'>{esc(extract_text(item.get('answer', '')))}</p></details>"
            for item in content.get("items", [])
        )
        gap = "gap-0"
    else:
        items = "".join(
            f"<details class='{cs['wrapper']} {cs['padding']}'>"
            f"<summary class='cursor-pointer list-none text-base font-semibold text-slate-950'>{esc(extract_text(item.get('question', '')))}</summary>"
            f"<p class='mt-4 text-sm leading-7 text-slate-600'>{esc(extract_text(item.get('answer', '')))}</p></details>"
            for item in content.get("items", [])
        )
        gap = "gap-4"
    return section_shell(section, _intro() + f"<div class='mt-10 grid {gap}'>{items}</div>", design_mode)


def _render_cta_band(section, content, variant, tone, actions, design_mode, family, _intro):
    if family == "direct":
        if variant == "contact-strip":
            inner = (
                f"<div class='rounded-lg border border-slate-200 bg-white px-5 py-5'>"
                + "<div class='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>"
                + f"<div>{_intro()}</div>"
                + f"<div class='flex flex-wrap gap-2'>{render_buttons(content.get('buttons', []), actions, tone)}</div>"
                + "</div></div>"
            )
        else:
            inner = (
                f"<div class='rounded-lg bg-slate-900 px-5 py-6 text-white'>"
                + _intro()
                + f"<div class='mt-4 flex flex-wrap gap-2'>{render_buttons(content.get('buttons', []), actions, tone)}</div>"
                + "</div>"
            )
    elif family == "editorial":
        if variant == "contact-strip":
            inner = (
                f"<div class='rounded-xl border border-stone-200/50 bg-[#fffaf2] px-8 py-8'>"
                + "<div class='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>"
                + f"<div>{_intro()}</div>"
                + f"<div class='flex flex-wrap gap-3'>{render_buttons(content.get('buttons', []), actions, tone)}</div>"
                + "</div></div>"
            )
        else:
            inner = (
                f"<div class='rounded-xl bg-[#1f1812] px-8 py-12 text-[#f9f4ea]'>"
                + _intro()
                + f"<div class='mt-8 flex flex-wrap gap-4'>{render_buttons(content.get('buttons', []), actions, tone)}</div>"
                + "</div>"
            )
    else:
        if variant == "dual":
            inner = (
                f"<div class='grid gap-6 {tone['radius_hero']} px-8 py-10 lg:grid-cols-[1fr_auto] lg:items-center {tone['dark_block']}'>"
                + f"<div>{_intro()}</div>"
                + f"<div class='flex flex-wrap gap-3 lg:justify-end'>{render_buttons(content.get('buttons', []), actions, tone)}</div>"
                + "</div>"
            )
        elif variant == "contact-strip":
            inner = (
                f"<div class='border px-8 py-8 {tone['card']} {tone['radius_hero']}'>"
                + "<div class='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>"
                + f"<div>{_intro()}</div>"
                + f"<div class='flex flex-wrap gap-3'>{render_buttons(content.get('buttons', []), actions, tone)}</div>"
                + "</div></div>"
            )
        else:
            inner = (
                f"<div class='px-8 py-10 {tone['dark_block']} {tone['radius_hero']}'>"
                + _intro()
                + f"<div class='mt-8 flex flex-wrap gap-3'>{render_buttons(content.get('buttons', []), actions, tone)}</div>"
                + "</div>"
            )
    return section_shell(section, inner, design_mode)


def _render_contact(section, content, tone, design_mode, family, _intro):
    details = normalize_list_items(content.get("details", []))
    details_html = "".join(f"<li>{esc(d)}</li>" for d in details)
    cs = pick_card_classes(design_mode, "contact", "")

    if family == "direct":
        inner = (
            _intro()
            + f"<div id='contact' class='mt-6 rounded-lg border border-slate-200 bg-white p-4'>"
            + "<p class='text-sm text-slate-600'>Contact us to get started.</p>"
            + f"<ul class='mt-3 grid gap-1 text-sm text-slate-700'>{details_html}</ul>"
            + "</div>"
        )
    elif family == "editorial":
        inner = (
            _intro()
            + f"<div id='contact' class='mt-10 max-w-lg'>"
            + "<p class='text-sm leading-[1.85] text-stone-600'>We'd love to hear from you.</p>"
            + f"<ul class='mt-6 grid gap-3 text-sm text-stone-700'>{details_html}</ul>"
            + "</div>"
        )
    else:
        inner = (
            _intro()
            + f"<div id='contact' class='mt-10 {cs['wrapper']} {cs['padding']}'>"
            + "<p class='text-sm leading-7 text-slate-600'>Contact us to get started.</p>"
            + f"<ul class='mt-4 grid gap-2 text-sm text-slate-700'>{details_html}</ul>"
            + "</div>"
        )
    return section_shell(section, inner, design_mode)


def _render_service_area(section, content, tone, design_mode, family, _intro, theme_variant):
    areas = normalize_list_items(content.get("areas", []))
    cs = pick_card_classes(design_mode, "service-area", "")

    if family == "direct":
        areas_html = "".join(f"<li class='rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700'>{esc(a)}</li>" for a in areas)
        inner = _intro() + f"<ul class='mt-4 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-4'>{areas_html}</ul>"
    elif family == "editorial":
        areas_html = "".join(f"<li class='text-sm text-stone-600'>{esc(a)}</li>" for a in areas)
        lead = "<p class='mt-5 max-w-xl text-base leading-[1.85] text-stone-600'>We serve these areas and nearby neighborhoods.</p>"
        inner = _intro() + lead + f"<ul class='mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>{areas_html}</ul>"
    else:
        areas_html = "".join(f"<li class='{cs['wrapper']} px-4 py-3'>{esc(a)}</li>" for a in areas)
        lead = "<p class='mt-4 max-w-2xl text-lg leading-8 text-slate-600'>We serve these areas and nearby neighborhoods.</p>" if theme_variant in {"clean", "premium"} else ""
        inner = _intro() + lead + f"<ul class='mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>{areas_html}</ul>"
    return section_shell(section, inner, design_mode)


def _render_footer(section, content, variant, tone, design_mode, family):
    company = esc(extract_text(content.get("companyName", "")))
    tagline = esc(extract_text(content.get("tagline", "")))
    year = esc(extract_text(content.get("copyrightYear", "")))

    simple_links = "".join(
        f"<a class='transition hover:text-white' href='{esc(extract_href(link))}'>{esc(extract_text(link))}</a>"
        for col in content.get("columns", [])
        for link in col.get("links", [])[:4]
    )
    columns = "".join(
        "<div><h4 class='text-sm font-semibold uppercase tracking-[0.18em] text-white/60'>{}</h4>{}</div>".format(
            esc(extract_text(col.get("title", ""))),
            "".join(
                f"<a class='mt-3 block text-sm text-white/80 transition hover:text-white' href='{esc(extract_href(link))}'>{esc(extract_text(link))}</a>"
                for link in col.get("links", [])
            ),
        )
        for col in content.get("columns", [])
    )

    if family == "direct":
        if variant == "simple":
            inner = (
                f"<div class='rounded-lg bg-slate-900 px-5 py-5 text-white'>"
                + f"<div class='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'><div><h3 class='text-lg font-bold tracking-tight'>{company}</h3><p class='mt-1 text-xs leading-5 text-white/60'>{tagline}</p></div><div class='grid gap-1 text-xs text-white/60'>{simple_links}</div></div>"
                + f"<p class='mt-4 text-xs text-white/40'>&copy; {year} {company}</p></div>"
            )
        else:
            inner = (
                f"<div class='rounded-lg bg-slate-900 px-5 py-6 text-white'>"
                + f"<div class='grid gap-6 lg:grid-cols-[1.2fr_1fr_1fr_1fr]'><div><h3 class='text-lg font-bold tracking-tight'>{company}</h3><p class='mt-2 text-xs leading-5 text-white/60'>{tagline}</p></div>{columns}</div>"
                + f"<p class='mt-6 text-xs text-white/40'>&copy; {year} {company}</p></div>"
            )
    elif family == "editorial":
        if variant == "simple":
            inner = (
                f"<div class='rounded-xl bg-[#1f1812] px-8 py-8 text-[#f9f4ea]'>"
                + f"<div class='flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'><div><h3 class='text-xl font-semibold tracking-tight'>{company}</h3><p class='mt-3 text-sm leading-7 text-white/60'>{tagline}</p></div><div class='grid gap-2 text-sm text-white/60'>{simple_links}</div></div>"
                + f"<p class='mt-10 text-xs text-white/40'>&copy; {year} {company}</p></div>"
            )
        else:
            inner = (
                f"<div class='rounded-xl bg-[#1f1812] px-8 py-10 text-[#f9f4ea]'>"
                + f"<div class='grid gap-8 lg:grid-cols-[1.2fr_1fr_1fr_1fr]'><div><h3 class='text-xl font-semibold tracking-tight'>{company}</h3><p class='mt-4 text-sm leading-7 text-white/60'>{tagline}</p></div>{columns}</div>"
                + f"<p class='mt-10 text-xs text-white/40'>&copy; {year} {company}</p></div>"
            )
    else:
        if variant == "simple":
            inner = (
                f"<div class='px-8 py-8 {tone['footer']} {tone['radius_hero']}'>"
                + f"<div class='flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'><div><h3 class='text-2xl font-semibold tracking-tight'>{company}</h3><p class='mt-3 text-sm leading-7 text-white/70'>{tagline}</p></div><div class='grid gap-2 text-sm text-white/70'>{simple_links}</div></div>"
                + f"<p class='mt-8 text-sm text-white/50'>&copy; {year} {company}</p></div>"
            )
        else:
            inner = (
                f"<div class='px-8 py-10 {tone['footer']} {tone['radius_hero']}'>"
                + f"<div class='grid gap-8 lg:grid-cols-[1.2fr_1fr_1fr_1fr]'><div><h3 class='text-2xl font-semibold tracking-tight'>{company}</h3><p class='mt-4 text-sm leading-7 text-white/70'>{tagline}</p></div>{columns}</div>"
                + f"<p class='mt-10 text-sm text-white/50'>&copy; {year} {company}</p></div>"
            )
    return section_shell(section, inner, design_mode)


def render_section(section: dict[str, Any], actions: list[dict[str, Any]], theme_variant: str, design_mode: str) -> str:
    stype = section.get("type", "")
    content = section.get("content", {})
    variant = str(section.get("variant") or "")
    tone = design_classes(design_mode, theme_variant)
    family = _mode_family(design_mode)
    intro_fn = pick_intro_renderer(design_mode, stype, variant)

    def _intro(c: dict[str, Any] | None = None) -> str:
        return intro_fn(c or content, tone)

    if stype == "hero":
        return _render_hero(section, content, variant, tone, actions, design_mode, family)
    if stype == "trust-bar":
        return _render_trust_bar(section, content, tone, design_mode, family)
    if stype == "services":
        return _render_services(section, content, variant, tone, actions, design_mode, family, _intro)
    if stype in {"features", "benefits"}:
        return _render_features(section, content, variant, tone, design_mode, family, _intro, stype)
    if stype == "about-team":
        return _render_about_team(section, content, variant, tone, design_mode, family, _intro)
    if stype == "gallery":
        return _render_gallery(section, content, variant, tone, design_mode, family, _intro)
    if stype == "problem-solution":
        return _render_problem_solution(section, content, tone, design_mode, family, _intro)
    if stype == "how-it-works":
        return _render_how_it_works(section, content, tone, design_mode, family, _intro)
    if stype == "testimonials":
        return _render_testimonials(section, content, variant, tone, design_mode, family, _intro)
    if stype == "results":
        return _render_results(section, content, tone, design_mode, family, _intro)
    if stype == "pricing":
        return _render_pricing(section, content, tone, design_mode, family, _intro)
    if stype == "faq":
        return _render_faq(section, content, tone, design_mode, family, _intro)
    if stype == "cta-band":
        return _render_cta_band(section, content, variant, tone, actions, design_mode, family, _intro)
    if stype == "contact":
        return _render_contact(section, content, tone, design_mode, family, _intro)
    if stype == "service-area":
        return _render_service_area(section, content, tone, design_mode, family, _intro, theme_variant)
    if stype == "footer":
        return _render_footer(section, content, variant, tone, design_mode, family)
    return section_shell(section, _intro() + render_supporting_points(content.get("supportingPoints", []), design_mode), design_mode)


def render_page(doc: dict[str, Any], shared_settings: dict[str, Any], site_plan: dict[str, Any], design_brief: dict[str, Any]) -> str:
    navigation = build_navigation(shared_settings, site_plan, design_brief)
    design_mode = shared_settings.get("designMode", "soft-glass")
    design = design_classes(design_mode, shared_settings.get("themeVariant", "clean"))
    nav_items = "".join(
        f"<a class='{design['nav_link']}' href='{esc(item.get('href', '#'))}'>{esc(item.get('label', ''))}</a>"
        for item in navigation
    )
    nav_cta = get_nav_cta(shared_settings)
    theme_variant = shared_settings.get("themeVariant", "clean")
    body = "\n".join(render_section(section, shared_settings.get("actions", []), theme_variant, design_mode) for section in doc.get("sections", []))
    brand = shared_settings["brand"]
    site_name = shared_settings.get("header", {}).get("siteName", doc["meta"]["title"])
    nav_cta_href = resolve_action_href(str((nav_cta or {}).get("id") or "action-primary"), shared_settings.get("actions", []))
    nav_cta_html = ""
    if nav_cta:
        nav_cta_html = (
            f"<a class='inline-flex items-center justify-center text-sm font-semibold transition {design['cta_primary']}' "
            f"href='{esc(nav_cta_href)}'>{esc(nav_cta.get('label', 'Get Started'))}</a>"
        )
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{doc["meta"]["title"]}</title>
  <meta name="description" content="{doc["meta"]["description"]}" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {{
      theme: {{
        extend: {{
          colors: {{
            brand: "{brand["primaryColor"]}",
            secondary: "{brand["secondaryColor"]}",
            accent: "{brand["accentColor"]}"
          }},
          boxShadow: {{
            glow: "0 24px 80px rgba(15, 23, 42, 0.12)"
          }}
        }}
      }}
    }}
  </script>
  <style>
    body {{
      background: {design["body_bg"]};
      color: #0f172a;
      font-family: {brand["fontBody"]}, system-ui, sans-serif;
    }}
    h1, h2, h3, h4, strong {{
      font-family: {brand["fontHeading"]}, system-ui, sans-serif;
    }}
    [data-surface="soft-gradient"] {{
      background-image: linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.02));
    }}
    [data-emphasis="high"] h1,
    [data-emphasis="high"] h2 {{
      letter-spacing: -0.04em;
    }}
    .text-balance {{
      text-wrap: balance;
    }}
  </style>
</head>
<body class="antialiased">
  <header class="sticky top-0 z-50 border-b {design['header']}">
    <div class="{design['header_inner']}">
      <strong class="{design['brand_mark']}">{site_name}</strong>
      <div class="hidden items-center gap-6 md:flex">
        <nav class="flex flex-wrap {design['nav_gap']}">{nav_items}</nav>
        {nav_cta_html}
      </div>
    </div>
  </header>
  <main>{body}</main>
</body>
</html>"""


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate one homepage HTML file from a business description using Tailwind rendering.")
    parser.add_argument("--name", required=True, help="Business name")
    parser.add_argument("--description", required=True, help="Business description")
    parser.add_argument("--location", default="", help="Optional location")
    parser.add_argument("--audience", default="", help="Optional target audience hint")
    parser.add_argument("--output", required=True, help="Output HTML path")
    parser.add_argument("--rag-dir", default=core.DEFAULT_RAG_DIR, help="Optional ChromaDB directory for Tailwind variant guidance.")
    parser.add_argument("--business-rag-dir", default=core.DEFAULT_BUSINESS_RAG_DIR, help="Optional ChromaDB directory for business playbook guidance.")
    parser.add_argument("--design-modes", default=core.DEFAULT_DESIGN_MODES_PATH, help="Path to the design mode JSON library.")
    parser.add_argument("--section-patterns", default=core.DEFAULT_SECTION_PATTERNS_PATH, help="Path to the section pattern JSON library.")
    args = parser.parse_args()

    api_key = core.load_env_var("OPENAI_API_KEY")
    if not api_key:
        print("OPENAI_API_KEY not found in environment, .env.local, or .env")
        return 1

    inputs = core.Inputs(
        name=args.name.strip(),
        description=args.description.strip(),
        location=args.location.strip(),
        audience=args.audience.strip(),
        output=Path(args.output),
    )
    inputs.output.parent.mkdir(parents=True, exist_ok=True)
    prompt_log: list[dict[str, Any]] = []
    rag_dir = args.rag_dir.strip() or core.DEFAULT_RAG_DIR
    business_rag_dir = args.business_rag_dir.strip() or core.DEFAULT_BUSINESS_RAG_DIR
    design_modes = core.load_design_modes(args.design_modes.strip() or core.DEFAULT_DESIGN_MODES_PATH)
    section_patterns = core.load_section_patterns(args.section_patterns.strip() or core.DEFAULT_SECTION_PATTERNS_PATH)

    print("1/5 Inferring business context...")
    business_context = core.phase_chat_json(
        api_key,
        "infer_context",
        core.INFER_CONTEXT_SYSTEM,
        core.infer_context_user_prompt(inputs),
        core.validate_inferred_context,
        temperature=0.4,
        max_tokens=1200,
        prompt_log=prompt_log,
    )
    design_mode_selection = core.pick_design_mode(business_context, design_modes)
    print(f"[Pattern design] {design_mode_selection['selected'].get('id', 'unknown')} score={design_mode_selection.get('score', 0)}")
    for reason in design_mode_selection.get("reasons", [])[:5]:
        print(f"  - {reason}")

    print("2/5 Planning site...")
    site_plan = core.phase_chat_json(
        api_key,
        "site_plan",
        core.SITE_PLANNER_SYSTEM,
        core.site_planner_user_prompt(
            business_context,
            core.get_business_guidance(
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
            ),
        ),
        core.validate_site_plan,
        temperature=0.6,
        max_tokens=1800,
        prompt_log=prompt_log,
    )

    print("2.5/5 Building keyword strategy...")
    keyword_strategy = core.phase_chat_json(
        api_key,
        "keyword_strategy",
        core.KEYWORD_STRATEGY_SYSTEM,
        core.keyword_strategy_user_prompt(
            business_context,
            site_plan,
            core.get_business_guidance(
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
        lambda raw: core.validate_keyword_strategy(raw, site_plan),
        temperature=0.35,
        max_tokens=1800,
        prompt_log=prompt_log,
    )

    print("3/5 Generating shared settings...")
    shared_settings = core.phase_chat_json(
        api_key,
        "shared_settings",
        core.SHARED_SETTINGS_SYSTEM,
        core.shared_settings_user_prompt(
            business_context,
            site_plan,
            core.get_business_guidance(
                " | ".join(
                    [
                        business_context.get("businessType", ""),
                        business_context.get("mainOffer", ""),
                        "homepage design color typography navigation visual character",
                    ]
                ),
                business_rag_dir,
            ),
            design_mode_selection.get("selected"),
        ),
        lambda raw: core.validate_shared_settings(raw, site_plan, business_context),
        temperature=0.5,
        max_tokens=1800,
        prompt_log=prompt_log,
    )
    shared_settings["designMode"] = str(design_mode_selection["selected"].get("id") or shared_settings.get("designMode") or "")
    shared_settings["selectedDesignMode"] = design_mode_selection.get("selected", {})

    print("3.5/5 Designing homepage direction...")
    design_brief = core.phase_chat_json(
        api_key,
        "design_brief",
        core.DESIGN_PLANNER_SYSTEM,
        core.design_planner_user_prompt(
            business_context,
            site_plan,
            shared_settings,
            core.get_business_guidance(
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
            design_mode_selection.get("selected"),
        ),
        lambda raw: core.validate_design_brief(raw, business_context, shared_settings),
        temperature=0.45,
        max_tokens=2000,
        prompt_log=prompt_log,
    )
    design_brief = core.review_and_improve_design_brief(
        api_key,
        design_brief,
        business_context,
        site_plan,
        shared_settings,
        prompt_log,
        core.get_business_guidance(
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
    page_plan = core.phase_chat_json(
        api_key,
        "page_plan",
        core.PAGE_PLANNER_SYSTEM,
        core.page_planner_user_prompt(
            home_page,
            business_context,
            shared_settings,
            site_plan,
            design_brief,
            core.get_business_guidance(
                " | ".join(
                    [
                        business_context.get("businessType", ""),
                        business_context.get("mainOffer", ""),
                        "site architecture homepage sections section order objections trust conversion",
                    ]
                ),
                business_rag_dir,
            ),
            design_mode_selection.get("selected"),
        ),
        lambda raw: core.validate_page_plan(raw, home_page, business_context),
        temperature=0.6,
        max_tokens=1600,
        prompt_log=prompt_log,
    )
    page_plan = core.enforce_design_on_page_plan(page_plan, design_brief)
    page_plan, section_pattern_selection, used_patterns = core.apply_section_patterns_to_page_plan(
        page_plan,
        business_context,
        design_mode_selection,
        section_patterns,
    )
    print("[Pattern sections]")
    for item in section_pattern_selection:
        print(f"  {item['section_type']}: {item['selected_pattern_id']} -> {item['variant']}")

    print("4.5/5 Assigning section keywords...")
    section_keyword_plan = core.phase_chat_json(
        api_key,
        "section_keyword_plan",
        core.SECTION_KEYWORD_SYSTEM,
        core.section_keyword_user_prompt(
            page_plan,
            business_context,
            design_brief,
            keyword_strategy,
            core.get_business_guidance(
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
        lambda raw: core.validate_section_keyword_plan(raw, page_plan),
        temperature=0.3,
        max_tokens=2200,
        prompt_log=prompt_log,
    )

    print("5/5 Generating homepage document...")
    page_doc = core.phase_chat_json(
        api_key,
        "page_document",
        core.PAGE_GENERATOR_SYSTEM,
        core.page_generator_user_prompt(
            page_plan,
            business_context,
            shared_settings,
            design_brief,
            core.get_business_guidance(
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
            design_mode_selection.get("selected"),
        ),
        lambda raw: core.validate_page_document(raw, page_plan, shared_settings, business_context),
        temperature=0.7,
        max_tokens=3200,
        prompt_log=prompt_log,
    )
    page_doc = core.write_sections_with_keywords(
        api_key,
        page_doc,
        page_plan,
        shared_settings,
        business_context,
        design_brief,
        section_keyword_plan,
        prompt_log,
        rag_dir,
        core.get_business_guidance(
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
    page_doc = core.review_and_regenerate_sections(
        api_key,
        page_doc,
        page_plan,
        shared_settings,
        business_context,
        prompt_log,
    )
    page_doc = core.ensure_defaults(page_doc, page_plan, shared_settings, business_context)

    html = render_page(page_doc, shared_settings, site_plan, design_brief)
    inputs.output.write_text(html, encoding="utf-8")

    trace_path = inputs.output.with_suffix(".trace.json")
    prompt_log_path = inputs.output.with_suffix(".prompts.json")
    trace_path.write_text(
        json.dumps(
            {
                "model": core.MODEL,
                "renderer": "tailwind",
                "business_context": business_context,
                "site_plan": site_plan,
                "keyword_strategy": keyword_strategy,
                "shared_settings": shared_settings,
                "design_mode_selection": {
                    "selected_id": design_mode_selection["selected"].get("id"),
                    "score": design_mode_selection.get("score", 0),
                    "reasons": design_mode_selection.get("reasons", []),
                    "score_table": design_mode_selection.get("score_table", []),
                },
                "design_brief": design_brief,
                "page_plan": page_plan,
                "section_pattern_selection": section_pattern_selection,
                "used_patterns": used_patterns,
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
