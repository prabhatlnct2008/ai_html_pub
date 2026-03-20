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


def render_buttons(buttons: list[Any], actions: list[dict[str, Any]], tone: dict[str, str] | None = None) -> str:
    tone = tone or {}
    rendered = []
    for button in buttons[:2]:
        if not isinstance(button, dict):
            continue
        href = resolve_action_href(str(button.get("actionId") or "action-primary"), actions)
        style = str(button.get("style") or "primary")
        classes = (
            "inline-flex items-center justify-center px-6 py-3 text-sm font-semibold transition "
            + (
                tone.get("cta_secondary", "rounded-full bg-brand text-white hover:opacity-90")
                if style == "secondary"
                else "bg-accent text-slate-950 hover:opacity-90"
            )
        )
        if style != "secondary":
            classes = "inline-flex items-center justify-center px-6 py-3 text-sm font-semibold transition " + tone.get(
                "cta_primary",
                "rounded-full bg-accent text-slate-950 hover:opacity-90",
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


def render_intro(content: dict[str, Any]) -> str:
    parts: list[str] = []
    if content.get("badge"):
        parts.append(
            f"<div class='mb-4 inline-flex rounded-full bg-slate-900/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]'>{esc(content['badge'])}</div>"
        )
    if content.get("eyebrow"):
        parts.append(
            f"<div class='mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>{esc(content['eyebrow'])}</div>"
        )
    if content.get("heading"):
        parts.append(f"<h2 class='text-4xl font-semibold tracking-tight text-balance text-slate-950'>{esc(content['heading'])}</h2>")
    if content.get("subheading"):
        parts.append(f"<p class='mt-4 max-w-3xl text-lg leading-8 text-slate-600'>{esc(content['subheading'])}</p>")
    return "".join(parts)


def render_supporting_points(points: list[Any]) -> str:
    clean = [p for p in points if p]
    if not clean:
        return ""
    return "<ul class='mt-6 grid gap-3 text-sm text-slate-700'>" + "".join(
        f"<li class='flex gap-3'><span class='mt-1 h-2 w-2 rounded-full bg-emerald-400'></span><span>{esc(point)}</span></li>"
        for point in clean
    ) + "</ul>"


def render_trust_chips(chips: list[Any]) -> str:
    clean = [c for c in chips if c]
    if not clean:
        return ""
    return "<div class='mt-5 flex flex-wrap gap-2'>" + "".join(
        f"<span class='rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-current'>{esc(chip)}</span>"
        for chip in clean
    ) + "</div>"


def render_items_grid(
    items: list[dict[str, Any]],
    card_builder: Any,
    grid_classes: str,
    tone: dict[str, str],
) -> str:
    cards = "".join(card_builder(idx, item) for idx, item in enumerate(items))
    if not cards:
        return ""
    return f"<div class='mt-10 grid {tone['section_gap']} {grid_classes}'>{cards}</div>"


def section_shell(section: dict[str, Any], inner: str) -> str:
    style = section.get("style", {})
    bg = style.get("backgroundColor", "#ffffff")
    fg = style.get("textColor", "#0f172a")
    padding = style.get("padding", "72px 0")
    surface = esc(style.get("surface", "solid"))
    emphasis = esc(style.get("emphasis", "medium"))
    motion = esc(section.get("motionHint", ""))
    layout = esc(section.get("layoutHint", ""))
    return (
        f'<section id="{esc(section.get("id", ""))}" data-motion="{motion}" data-layout="{layout}" '
        f'data-surface="{surface}" data-emphasis="{emphasis}" style="background:{bg};color:{fg};padding:{padding};">'
        f"<div class='mx-auto w-full max-w-7xl px-6 lg:px-8'>{inner}</div></section>"
    )


def render_section(section: dict[str, Any], actions: list[dict[str, Any]], theme_variant: str, design_mode: str) -> str:
    stype = section.get("type", "")
    content = section.get("content", {})
    variant = str(section.get("variant") or "")
    tone = design_classes(design_mode, theme_variant)
    if stype == "hero":
        eyebrow = (
            f"<div class='mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-current/70'>{esc(content.get('eyebrow'))}</div>"
            if content.get("eyebrow")
            else ""
        )
        intro = (
            eyebrow
            + f"<h1 class='{tone['hero_title']}'>{esc(content.get('heading', ''))}</h1>"
            + f"<p class='mt-6 max-w-3xl text-lg leading-8 text-current/80'>{esc(content.get('subheading', ''))}</p>"
            + render_supporting_points(content.get("supportingPoints", []))
            + f"<div class='mt-8 flex flex-wrap gap-3'>{render_buttons(content.get('buttons', []), actions, tone)}</div>"
            + (f"<p class='mt-4 text-sm text-current/70'>{esc(content.get('ctaNote'))}</p>" if content.get("ctaNote") else "")
        )
        if variant == "centered":
            inner = (
                f"<div class='mx-auto max-w-4xl {tone['hero_pad']} text-center'>"
                + intro
                + render_trust_chips(content.get("trustChips", []))
                + "</div>"
            )
        elif variant == "offer-focused":
            proof_items = content.get("supportingPoints", [])[:3] or content.get("trustChips", [])[:3]
            aside = (
                f"<div class='border {tone['card']} {tone['radius_block']} p-6 lg:p-8'>"
                + (f"<div class='text-sm font-semibold uppercase tracking-[0.18em] {tone['muted']}'>{esc(content.get('badge'))}</div>" if content.get("badge") else "")
                + "<div class='mt-5 grid gap-3'>"
                + "".join(
                    f"<div class='rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800'>{esc(point)}</div>"
                    for point in proof_items
                )
                + (f"<div class='mt-3 rounded-xl bg-slate-950 px-4 py-4 text-sm font-semibold text-white'>{esc(content.get('ctaNote'))}</div>" if content.get("ctaNote") else "")
                + "</div></div>"
            )
            inner = (
                f"<div class='grid {tone['section_gap']} {tone['hero_pad']} lg:grid-cols-[1.1fr_0.9fr] lg:items-start {tone['hero_frame']} {tone['radius_hero']}'>"
                f"<div>{intro}</div><div>{aside}</div></div>"
            )
        elif variant == "split-image":
            aside = (
                f"<div class='relative overflow-hidden border {tone['card']} {tone['radius_hero']} p-6 lg:p-8'>"
                + "<div class='absolute inset-x-8 top-8 h-28 rounded-full bg-accent/25 blur-3xl'></div>"
                + "<div class='relative aspect-[4/5] rounded-[1.75rem] bg-[linear-gradient(160deg,rgba(255,255,255,0.92),rgba(255,255,255,0.12))] ring-1 ring-white/30'></div>"
                + "<div class='relative mt-6 grid gap-2 text-sm text-slate-700'>"
                + "".join(f"<div class='rounded-full bg-white/75 px-4 py-2 backdrop-blur'>{esc(chip)}</div>" for chip in content.get("trustChips", [])[:3])
                + "</div>"
                + "</div>"
            )
            inner = (
                f"<div class='grid {tone['section_gap']} {tone['hero_pad']} lg:grid-cols-[0.9fr_1.1fr] lg:items-center {tone['hero_frame']} {tone['radius_hero']}'>"
                f"<div>{intro}</div><div>{aside}</div></div>"
            )
        elif variant == "trust-panel":
            aside = (
                f"<div class='border {tone['panel']} {tone['radius_block']} p-6 lg:p-8'>"
                + (f"<div class='mb-4 inline-flex rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-900'>{esc(content.get('badge'))}</div>" if content.get("badge") else "")
                + "<div class='grid gap-3'>"
                + "".join(
                    f"<div class='rounded-2xl border border-white/20 bg-white/60 px-4 py-4'><div class='text-sm font-semibold text-slate-950'>{esc(point)}</div></div>"
                    for point in (content.get("trustChips", [])[:3] or content.get("supportingPoints", [])[:3])
                )
                + "</div></div>"
            )
            inner = (
                f"<div class='grid {tone['section_gap']} {tone['hero_pad']} lg:grid-cols-[1.15fr_0.85fr] lg:items-center {tone['hero_frame']} {tone['radius_hero']}'>"
                f"<div>{intro}{render_trust_chips(content.get('trustChips', []))}</div><div>{aside}</div></div>"
            )
        else:
            aside = (
                f"<div class='border {tone['panel']} {tone['radius_block']} p-6 lg:p-8'>"
                + (f"<div class='mb-4 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]'>{esc(content.get('badge'))}</div>" if content.get("badge") else "")
                + "<div class='grid gap-4'>"
                + "".join(
                    f"<div class='rounded-2xl border border-white/20 bg-white/10 px-4 py-4 text-sm'>{esc(point)}</div>"
                    for point in (content.get("supportingPoints", [])[:2] + content.get("trustChips", [])[:2])
                )
                + "</div>"
                + "</div>"
            )
            inner = (
                f"<div class=\"grid {tone['section_gap']} {tone['hero_pad']} lg:grid-cols-[1.2fr_0.8fr] lg:items-center {tone['hero_frame']} {tone['radius_hero']}\">"
                f"<div>{intro}</div><div>{aside}</div></div>"
            )
        return section_shell(section, inner)
    if stype == "trust-bar":
        items = "".join(
            f"<span class='rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm'>{esc(item)}</span>"
            for item in content.get("items", [])
        )
        return section_shell(section, f"<div class='flex flex-wrap justify-center gap-3'>{items}</div>")
    if stype == "services":
        items = content.get("items", [])
        if variant == "icon-list":
            inner = render_intro(content) + render_items_grid(
                items,
                lambda idx, item: (
                    f"<article class='grid gap-4 border p-5 {tone['card']} {tone['radius_block']} md:grid-cols-[auto_1fr] md:items-start'>"
                    + f"<div class='grid h-10 w-10 place-items-center rounded-xl bg-accent/15 text-xs font-semibold text-slate-900'>{idx + 1:02d}</div>"
                    + f"<div><h3 class='text-lg font-semibold text-slate-950'>{esc(item.get('title', ''))}</h3><p class='mt-2 text-sm leading-7 text-slate-600'>{esc(item.get('description', ''))}</p></div></article>"
                ),
                "lg:grid-cols-2",
                tone,
            )
        elif variant == "list-with-icons":
            inner = render_intro(content) + render_items_grid(
                items,
                lambda idx, item: (
                    f"<article class='border p-6 {tone['card']} {tone['radius_block']}'>"
                    + f"<div class='mb-5 inline-flex rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-900'>Service {idx + 1}</div>"
                    + f"<h3 class='text-xl font-semibold tracking-tight text-slate-950'>{esc(item.get('title', ''))}</h3>"
                    + f"<p class='mt-3 text-sm leading-7 text-slate-600'>{esc(item.get('description', ''))}</p></article>"
                ),
                "md:grid-cols-2 xl:grid-cols-3",
                tone,
            )
        elif variant == "alternating-rows":
            rows = "".join(
                f"<article class='grid gap-6 border p-6 {tone['card']} {tone['radius_block']} lg:grid-cols-[1.2fr_0.8fr] lg:items-center'><div><h3 class='text-2xl font-semibold tracking-tight text-slate-950'>{esc(item.get('title', ''))}</h3><p class='mt-3 text-sm leading-7 text-slate-600'>{esc(item.get('description', ''))}</p></div><div class='aspect-[5/3] rounded-[1.25rem] bg-[linear-gradient(135deg,theme(colors.brand/.14),theme(colors.accent/.12))]'></div></article>"
                for item in items
            )
            inner = render_intro(content) + f"<div class='mt-10 grid {tone['section_gap']}'>{rows}</div>"
        elif variant == "story":
            rows = "".join(
                f"<article class='grid gap-6 border p-8 {tone['card']} {tone['radius_block']} lg:grid-cols-[0.55fr_1fr] lg:items-start'><div class='text-sm font-semibold uppercase tracking-[0.18em] {tone['muted']}'>Why it matters</div><div><h3 class='text-2xl font-semibold tracking-tight text-slate-950'>{esc(item.get('title', ''))}</h3><p class='mt-4 max-w-2xl text-base leading-8 text-slate-600'>{esc(item.get('description', ''))}</p></div></article>"
                for item in items
            )
            inner = render_intro(content) + f"<div class='mt-10 grid {tone['section_gap']}'>{rows}</div>"
        else:
            inner = render_intro(content) + render_items_grid(
                items,
                lambda idx, item: (
                    f"<article class='border p-6 {tone['card']} {tone['radius_block']}'>"
                    + f"<div class='mb-4 text-xs font-semibold uppercase tracking-[0.18em] {tone['muted']}'>Offer {idx + 1}</div>"
                    + f"<h3 class='text-xl font-semibold tracking-tight text-slate-950'>{esc(item.get('title', ''))}</h3>"
                    + f"<p class='mt-3 text-sm leading-7 text-slate-600'>{esc(item.get('description', ''))}</p></article>"
                ),
                "md:grid-cols-2 xl:grid-cols-3",
                tone,
            )
        return section_shell(section, inner)
    if stype in {"features", "benefits"}:
        items = content.get("items", [])
        if variant == "icon-list":
            rows = "".join(
                f"<article class='flex gap-4 border p-5 {tone['card']} {tone['radius_block']}'><div class='grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent/15 text-sm font-semibold text-slate-900'>{idx + 1:02d}</div><div><h3 class='text-lg font-semibold text-slate-950'>{esc(item.get('title', ''))}</h3><p class='mt-2 text-sm leading-7 text-slate-600'>{esc(item.get('description', ''))}</p></div></article>"
                for idx, item in enumerate(items)
            )
            inner = render_intro(content) + f"<div class='mt-10 grid {tone['section_gap']} lg:grid-cols-2'>{rows}</div>"
        elif variant == "list-with-icons":
            inner = render_intro(content) + render_items_grid(
                items,
                lambda idx, item: (
                    f"<article class='border p-6 {tone['card']} {tone['radius_block']}'>"
                    + f"<div class='mb-4 grid h-11 w-11 place-items-center rounded-full bg-brand/10 text-sm font-semibold text-slate-900'>{idx + 1}</div>"
                    + f"<h3 class='text-xl font-semibold tracking-tight text-slate-950'>{esc(item.get('title', ''))}</h3><p class='mt-3 text-sm leading-7 text-slate-600'>{esc(item.get('description', ''))}</p></article>"
                ),
                "md:grid-cols-2 xl:grid-cols-3",
                tone,
            )
        elif variant == "alternating-rows":
            rows = "".join(
                f"<article class='grid gap-6 border p-8 {tone['card']} {tone['radius_block']} lg:grid-cols-[0.9fr_1.1fr] lg:items-center'><div class='rounded-[1.25rem] bg-[linear-gradient(135deg,theme(colors.brand/.15),theme(colors.accent/.10))] p-8 text-sm font-semibold uppercase tracking-[0.18em] text-slate-900'>Benefit {idx + 1:02d}</div><div><h3 class='text-2xl font-semibold tracking-tight text-slate-950'>{esc(item.get('title', ''))}</h3><p class='mt-3 text-base leading-8 text-slate-600'>{esc(item.get('description', ''))}</p></div></article>"
                for idx, item in enumerate(items)
            )
            inner = render_intro(content) + f"<div class='mt-10 grid {tone['section_gap']}'>{rows}</div>"
        elif variant == "values":
            inner = render_intro(content) + render_items_grid(
                items,
                lambda idx, item: (
                    f"<article class='border p-5 {tone['card']} {tone['radius_block']}'>"
                    + f"<div class='text-xs font-semibold uppercase tracking-[0.18em] {tone['muted']}'>Value</div>"
                    + f"<h3 class='mt-3 text-lg font-semibold text-slate-950'>{esc(item.get('title', ''))}</h3><p class='mt-2 text-sm leading-7 text-slate-600'>{esc(item.get('description', ''))}</p></article>"
                ),
                "sm:grid-cols-2 xl:grid-cols-4",
                tone,
            )
        else:
            inner = render_intro(content) + render_items_grid(
                items,
                lambda idx, item: (
                    f"<article class='border p-6 {tone['card']} {tone['radius_block']}'>"
                    + f"<h3 class='text-xl font-semibold tracking-tight text-slate-950'>{esc(item.get('title', ''))}</h3><p class='mt-3 text-sm leading-7 text-slate-600'>{esc(item.get('description', ''))}</p></article>"
                ),
                "md:grid-cols-2 xl:grid-cols-3",
                tone,
            )
        return section_shell(section, inner)
    if stype == "about-team":
        items = content.get("items", [])
        if variant == "story":
            rows = "".join(
                f"<article class='grid gap-6 border p-8 {tone['card']} {tone['radius_block']} lg:grid-cols-[0.8fr_1.2fr] lg:items-start'><div class='aspect-square rounded-[1.5rem] bg-[linear-gradient(135deg,theme(colors.brand/.18),theme(colors.accent/.10))]'></div><div><h3 class='text-2xl font-semibold tracking-tight text-slate-950'>{esc(item.get('title', ''))}</h3><p class='mt-4 text-base leading-8 text-slate-600'>{esc(item.get('description', ''))}</p></div></article>"
                for item in items
            )
            inner = render_intro(content) + f"<div class='mt-10 grid {tone['section_gap']}'>{rows}</div>"
        else:
            inner = render_intro(content) + render_items_grid(
                items,
                lambda idx, item: (
                    f"<article class='border p-6 {tone['card']} {tone['radius_block']}'>"
                    + "<div class='mb-5 aspect-[4/3] rounded-[1.25rem] bg-[linear-gradient(135deg,theme(colors.brand/.16),theme(colors.accent/.10))]'></div>"
                    + f"<h3 class='text-xl font-semibold tracking-tight text-slate-950'>{esc(item.get('title', ''))}</h3><p class='mt-3 text-sm leading-7 text-slate-600'>{esc(item.get('description', ''))}</p></article>"
                ),
                "md:grid-cols-2 xl:grid-cols-3",
                tone,
            )
        return section_shell(section, inner)
    if stype == "gallery":
        items = content.get("items", [])
        inner = render_intro(content) + render_items_grid(
            items,
            lambda idx, item: (
                f"<article class='overflow-hidden border {tone['card']} {tone['radius_block']}'>"
                + "<div class='aspect-[4/3] bg-[linear-gradient(145deg,theme(colors.brand/.16),theme(colors.accent/.18))]'></div>"
                + f"<div class='p-5'><h3 class='text-lg font-semibold tracking-tight text-slate-950'>{esc(item.get('title', 'Preview'))}</h3><p class='mt-2 text-sm leading-7 text-slate-600'>{esc(item.get('description', ''))}</p></div></article>"
            ),
            "md:grid-cols-2 xl:grid-cols-3",
            tone,
        )
        return section_shell(section, inner)
    if stype == "problem-solution":
        inner = (
            render_intro(content)
            + "<div class='mt-10 grid gap-6 lg:grid-cols-2'>"
            + f"<article class='rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm'><h3 class='text-xl font-semibold text-slate-950'>The Problem</h3><p class='mt-3 text-sm leading-7 text-slate-600'>{esc(content.get('problem', ''))}</p></article>"
            + f"<article class='rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm'><h3 class='text-xl font-semibold text-slate-950'>The Solution</h3><p class='mt-3 text-sm leading-7 text-slate-600'>{esc(content.get('solution', ''))}</p></article>"
            + "</div>"
        )
        return section_shell(section, inner)
    if stype == "how-it-works":
        steps = "".join(
            f"<article class='rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm'><div class='text-sm font-semibold uppercase tracking-[0.18em] text-accent'>Step {esc(step.get('step', ''))}</div><h3 class='mt-3 text-xl font-semibold text-slate-950'>{esc(step.get('title', ''))}</h3><p class='mt-3 text-sm leading-7 text-slate-600'>{esc(step.get('description', ''))}</p></article>"
            for step in content.get("steps", [])
        )
        return section_shell(section, render_intro(content) + f"<div class='mt-10 grid gap-6 lg:grid-cols-3'>{steps}</div>")
    if stype == "testimonials":
        if variant == "single-highlight" and content.get("items"):
            lead = content["items"][0]
            rest = content.get("items", [])[1:3]
            aside = "".join(
                f"<blockquote class='border p-5 {tone['card']} {tone['radius_block']}'><p class='text-sm leading-7 text-slate-700'>“{esc(item.get('quote', ''))}”</p><footer class='mt-4 text-sm font-semibold text-slate-900'>{esc(item.get('author', ''))}</footer></blockquote>"
                for item in rest
            )
            inner = (
                render_intro(content)
                + "<div class='mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]'>"
                + f"<blockquote class='p-8 {tone['dark_block']} {tone['radius_hero']}'><p class='text-2xl leading-10'>“{esc(lead.get('quote', ''))}”</p><footer class='mt-6 text-sm font-semibold text-white/70'>{esc(lead.get('author', ''))}</footer></blockquote>"
                + f"<div class='grid gap-4'>{aside}</div></div>"
            )
            return section_shell(section, inner)
        items = "".join(
            f"<blockquote class='border p-6 {tone['card']} {tone['radius_block']}'><p class='text-base leading-8 text-slate-700'>“{esc(item.get('quote', ''))}”</p><footer class='mt-4 text-sm font-semibold text-slate-900'>{esc(item.get('author', ''))}</footer></blockquote>"
            for item in content.get("items", [])
        )
        cols = "lg:grid-cols-2 xl:grid-cols-3"
        if variant == "avatars":
            cols = "lg:grid-cols-3"
        return section_shell(section, render_intro(content) + f"<div class='mt-10 grid gap-6 {cols}'>{items}</div>")
    if stype == "results":
        stats = "".join(
            f"<div class='rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm'><div class='text-4xl font-semibold tracking-tight text-slate-950'>{esc(item.get('value', ''))}</div><div class='mt-2 text-sm text-slate-600'>{esc(item.get('label', ''))}</div></div>"
            for item in content.get("stats", [])
        )
        return section_shell(section, render_intro(content) + f"<div class='mt-10 grid gap-6 grid-cols-2 lg:grid-cols-4'>{stats}</div>")
    if stype == "pricing":
        plans = "".join(
            f"<article class='rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm'><h3 class='text-xl font-semibold text-slate-950'>{esc(plan.get('name', ''))}</h3><div class='mt-3 text-4xl font-semibold tracking-tight text-slate-950'>{esc(plan.get('price', ''))}</div><p class='mt-3 text-sm leading-7 text-slate-600'>{esc(plan.get('description', ''))}</p><ul class='mt-4 grid gap-2 text-sm text-slate-700'>{''.join(f'<li>{esc(feature)}</li>' for feature in plan.get('features', []))}</ul></article>"
            for plan in content.get("plans", [])
        )
        return section_shell(section, render_intro(content) + f"<div class='mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-3'>{plans}</div>")
    if stype == "faq":
        items = "".join(
            f"<details class='rounded-[1.25rem] border border-slate-200 bg-white p-5 shadow-sm'><summary class='cursor-pointer list-none text-base font-semibold text-slate-950'>{esc(item.get('question', ''))}</summary><p class='mt-4 text-sm leading-7 text-slate-600'>{esc(item.get('answer', ''))}</p></details>"
            for item in content.get("items", [])
        )
        return section_shell(section, render_intro(content) + f"<div class='mt-10 grid gap-4'>{items}</div>")
    if stype == "cta-band":
        if variant == "dual":
            inner = (
                f"<div class='grid gap-6 rounded-[2rem] px-8 py-10 lg:grid-cols-[1fr_auto] lg:items-center {tone['dark_block']}'>"
                + "<div>"
                + render_intro(content)
                + "</div>"
                + f"<div class='flex flex-wrap gap-3 lg:justify-end'>{render_buttons(content.get('buttons', []), actions, tone)}</div>"
                + "</div>"
            )
        elif variant == "contact-strip":
            inner = (
                f"<div class='border px-8 py-8 {tone['card']} {tone['radius_hero']}'>"
                + "<div class='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>"
                + "<div>"
                + render_intro(content)
                + "</div>"
                + f"<div class='flex flex-wrap gap-3'>{render_buttons(content.get('buttons', []), actions, tone)}</div>"
                + "</div></div>"
            )
        else:
            inner = (
                f"<div class='px-8 py-10 {tone['dark_block']} {tone['radius_hero']}'>"
                + render_intro(content)
                + f"<div class='mt-8 flex flex-wrap gap-3'>{render_buttons(content.get('buttons', []), actions, tone)}</div>"
                + "</div>"
            )
        return section_shell(section, inner)
    if stype == "contact":
        details = "".join(f"<li>{esc(item)}</li>" for item in content.get("details", []))
        inner = (
            render_intro(content)
            + "<div id='contact' class='mt-10 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm'>"
            + "<p class='text-sm leading-7 text-slate-600'>Contact us to get started.</p>"
            + f"<ul class='mt-4 grid gap-2 text-sm text-slate-700'>{details}</ul>"
            + "</div>"
        )
        return section_shell(section, inner)
    if stype == "service-area":
        areas = "".join(f"<li class='rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm'>{esc(area)}</li>" for area in content.get("areas", []))
        lead = "<p class='mt-4 max-w-2xl text-lg leading-8 text-slate-600'>We serve these areas and nearby neighborhoods.</p>" if theme_variant in {"clean", "premium"} else ""
        return section_shell(section, render_intro(content) + lead + f"<ul class='mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>{areas}</ul>")
    if stype == "footer":
        simple_links = "".join(
            f"<a class='transition hover:text-white' href='{esc(link.get('href', '#'))}'>{esc(link.get('text', ''))}</a>"
            for col in content.get("columns", [])
            for link in col.get("links", [])[:4]
        )
        columns = "".join(
            "<div><h4 class='text-sm font-semibold uppercase tracking-[0.18em] text-white/60'>{}</h4>{}</div>".format(
                esc(col.get("title", "")),
                "".join(
                    f"<a class='mt-3 block text-sm text-white/80 transition hover:text-white' href='{esc(link.get('href', '#'))}'>{esc(link.get('text', ''))}</a>"
                    for link in col.get("links", [])
                ),
            )
            for col in content.get("columns", [])
        )
        company = esc(content.get("companyName", ""))
        tagline = esc(content.get("tagline", ""))
        year = esc(content.get("copyrightYear", ""))
        if variant == "simple":
            inner = (
                f"<div class='px-8 py-8 {tone['footer']} {tone['radius_hero']}'>"
                + f"<div class='flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'><div><h3 class='text-2xl font-semibold tracking-tight'>{company}</h3><p class='mt-3 text-sm leading-7 text-white/70'>{tagline}</p></div><div class='grid gap-2 text-sm text-white/70'>{simple_links}</div></div>"
                + f"<p class='mt-8 text-sm text-white/50'>&copy; {year} {company}</p>"
                + "</div>"
            )
        else:
            inner = (
                f"<div class='px-8 py-10 {tone['footer']} {tone['radius_hero']}'>"
                + f"<div class='grid gap-8 lg:grid-cols-[1.2fr_1fr_1fr_1fr]'><div><h3 class='text-2xl font-semibold tracking-tight'>{company}</h3><p class='mt-4 text-sm leading-7 text-white/70'>{tagline}</p></div>{columns}</div>"
                + f"<p class='mt-10 text-sm text-white/50'>&copy; {year} {company}</p>"
                + "</div>"
            )
        return section_shell(section, inner)
    return section_shell(section, render_intro(content) + render_supporting_points(content.get("supportingPoints", [])))


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
