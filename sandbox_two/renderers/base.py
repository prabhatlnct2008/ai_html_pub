"""Base renderer class with all shared section renderers."""
from __future__ import annotations
from typing import Any


def esc(value: Any) -> str:
    if value is None:
        return ""
    return str(value).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


class BaseRenderer:
    FAMILY = "saas"
    FONT = "Inter"
    BODY_BG = "linear-gradient(180deg, #f8fafc 0%, #ffffff 40%, #f1f5f9 100%)"

    def __init__(self, content: dict, style: dict) -> None:
        self.content = content
        self.style = style
        self.family = style.get("family", self.FAMILY)

    @classmethod
    def get_style(cls, primary_color: str = "#2563eb", accent_color: str = "#f97316") -> dict[str, str]:
        base = {
            "family": "saas",
            "primary_color": primary_color,
            "accent_color": accent_color,
        }
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

    # -------------------------------------------------------------------
    # Helper methods
    # -------------------------------------------------------------------

    def _family_gap(self) -> str:
        return {
            "concierge": "gap-10",
            "direct": "gap-4",
            "saas": "gap-8",
            "editorial": "gap-12",
            "clinic": "gap-10",
        }.get(self.family, "gap-8")

    def _family_section_bg(self, variant: str) -> str:
        if variant == "hero":
            return {
                "concierge": "bg-gradient-to-br from-[#fffdf8] via-white to-[#fff5ee]",
                "direct": "bg-white",
                "saas": "bg-gradient-to-br from-slate-50 via-white to-blue-50/40",
                "editorial": "bg-[#faf6f0]",
                "clinic": "bg-gradient-to-br from-[#f0fafb] via-white to-slate-50",
            }.get(self.family, "bg-white")
        elif variant == "about":
            return {
                "concierge": "bg-gradient-to-br from-white to-rose-50/30",
                "direct": "bg-slate-50",
                "saas": "bg-white",
                "editorial": "bg-[#faf6f0]",
                "clinic": "bg-gradient-to-br from-teal-50/30 via-white to-white",
            }.get(self.family, "bg-white")
        else:  # contact
            return {
                "concierge": "bg-gradient-to-br from-[#fffdf8] to-white",
                "direct": "bg-white",
                "saas": "bg-slate-50",
                "editorial": "bg-[#faf6f0]",
                "clinic": "bg-gradient-to-br from-[#f0fafb] to-white",
            }.get(self.family, "bg-white")

    def _chip_classes(self) -> str:
        return {
            "concierge": "rounded-full bg-white/70 px-3.5 py-1.5 text-xs font-medium text-stone-700 shadow-sm backdrop-blur",
            "direct": "rounded-md bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700",
            "saas": "rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600",
            "editorial": "border-b border-stone-300 pb-0.5 text-xs font-medium tracking-wide text-stone-500",
            "clinic": "rounded-full bg-teal-50 px-3.5 py-1.5 text-xs font-medium text-teal-700",
        }.get(self.family, "rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600")

    def _contact_icon(self) -> str:
        color = {
            "concierge": "text-rose-400",
            "direct": "text-slate-400",
            "saas": "text-slate-400",
            "editorial": "text-stone-400",
            "clinic": "text-teal-500",
        }.get(self.family, "text-stone-400")
        return (
            f'<svg class="mt-0.5 h-4 w-4 shrink-0 {color}" fill="none" stroke="currentColor" viewBox="0 0 24 24">'
            f'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" '
            f'd="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>'
            f'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>'
            f'</svg>'
        )

    @staticmethod
    def _placeholder_image_svg(size: str = "h-20 w-20") -> str:
        return (
            f'<svg class="{size}" fill="none" stroke="currentColor" viewBox="0 0 24 24">'
            f'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" '
            f'd="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01'
            f'M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>'
        )

    @staticmethod
    def _placeholder_dashboard_svg() -> str:
        return (
            '<svg class="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">'
            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" '
            'd="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>'
        )

    def _form_placeholder_fields(self) -> str:
        """Returns styled placeholder form fields (non-functional, visual only)."""
        primary_btn = self.style.get("primary_btn", "rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white")

        input_cls = {
            "concierge": "w-full rounded-xl border border-rose-100/60 bg-white px-4 py-3 text-sm text-stone-500",
            "direct": "w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-500",
            "saas": "w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500",
            "editorial": "w-full border-b border-stone-200 bg-transparent px-0 py-3 text-sm text-stone-500",
            "clinic": "w-full rounded-xl border border-teal-100 bg-white px-4 py-3 text-sm text-slate-500",
        }.get(self.family, "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500")

        muted = self.style.get("muted_text", "text-stone-400")

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

    # -------------------------------------------------------------------
    # Sub-renderer methods
    # -------------------------------------------------------------------

    def _build_hero_left(self) -> str:
        heading_cls = f"{self.style.get('heading_size','text-4xl')} {self.style.get('heading_weight','font-semibold')} {self.style.get('heading_tracking','tracking-tight')} {self.style.get('heading_color','text-stone-950')}"
        body_cls = f"{self.style.get('body_size','text-base')} {self.style.get('body_leading','leading-8')} {self.style.get('body_text','text-stone-600')}"
        muted = self.style.get("muted_text", "text-stone-400")
        bullet_marker = self.style.get("bullet_marker", '<span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-stone-400"></span>')
        primary_btn = self.style.get("primary_btn", "rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90")
        secondary_btn = self.style.get("secondary_btn", "rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-50")
        eyebrow_style = self.style.get("eyebrow_style", "text-xs font-semibold uppercase tracking-[0.16em] text-rose-600")

        eyebrow = self.content.get("heroEyebrow", "")
        heading = self.content.get("heroHeading", "")
        subheading = self.content.get("heroSubheading", "")
        bullets = self.content.get("heroBullets", [])
        cta_primary = self.content.get("heroCtaPrimary", "")
        cta_secondary = self.content.get("heroCtaSecondary", "")
        trust_chips = self.content.get("heroTrustChips", [])
        cta_note = self.content.get("heroCtaNote", "")

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
        bullets_html = f'<ul class="mt-6 grid gap-2.5 text-sm {self.style.get("body_text","text-stone-700")}">{bullet_items}</ul>' if bullet_items else ""

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
            chip_cls = self._chip_classes()
            chips = "".join(f'<span class="{chip_cls}">{esc(c)}</span>' for c in trust_chips[:4])
            chips_html = f'<div class="mt-5 flex flex-wrap gap-2">{chips}</div>'

        return f'{eyebrow_html}{heading_html}{sub_html}{bullets_html}{ctas_html}{note_html}{chips_html}'

    def _build_hero_right(self) -> str:
        stat_cards = self.content.get("heroStatCards", [])

        if self.family == "concierge":
            bullets = self.content.get("heroBullets", [])
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
                f'{self._placeholder_image_svg()}'
                f'</div></div>'
                f'<div class="absolute -left-4 bottom-8 grid gap-2 lg:-left-6">{floating_cards}</div>'
                f'</div>'
            )

        elif self.family == "direct":
            return (
                f'<div class="aspect-[4/3] overflow-hidden rounded-lg bg-slate-50 ring-1 ring-slate-200">'
                f'<div class="flex h-full items-center justify-center text-slate-300">'
                f'{self._placeholder_image_svg("h-14 w-14")}'
                f'</div></div>'
            )

        elif self.family == "saas":
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
                f'{self._placeholder_dashboard_svg()}'
                f'</div></div>'
                f'<div class="absolute -bottom-4 left-4 right-4 flex gap-2">{cards_html}</div>'
                f'</div>'
            )

        elif self.family == "editorial":
            return (
                f'<div class="aspect-[4/5] border border-stone-200 bg-gradient-to-br from-stone-100 via-[#ebe4d8] to-stone-50">'
                f'<div class="flex h-full items-center justify-center text-stone-300">'
                f'{self._placeholder_image_svg("h-20 w-20")}'
                f'</div></div>'
            )

        elif self.family == "clinic":
            trust_chips = self.content.get("heroTrustChips", [])
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
                f'{self._placeholder_image_svg("h-16 w-16")}'
                f'</div></div>'
                f'<div class="mt-4 grid gap-2">{trust_items}</div>'
                f'</div>'
            )

        return ""

    def _build_about_left(self) -> str:
        heading_cls = f"{self.style.get('heading_size','text-4xl')} {self.style.get('heading_weight','font-semibold')} {self.style.get('heading_tracking','tracking-tight')} {self.style.get('heading_color','text-stone-950')}"
        body_cls = f"{self.style.get('body_size','text-base')} {self.style.get('body_leading','leading-8')} {self.style.get('body_text','text-stone-600')}"
        bullet_marker = self.style.get("bullet_marker", '<span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-stone-400"></span>')

        heading = self.content.get("aboutHeading", "")
        text = self.content.get("aboutText", "")
        bullets = self.content.get("aboutBullets", [])

        heading_html = f'<h2 class="{esc(heading_cls)}">{esc(heading)}</h2>'
        text_html = f'<p class="mt-5 max-w-xl {esc(body_cls)}">{esc(text)}</p>' if text else ""

        bullet_items = ""
        for b in bullets[:6]:
            bullet_items += f'<li class="flex items-start gap-3">{bullet_marker}<span>{esc(b)}</span></li>'
        bullets_html = f'<ul class="mt-6 grid gap-2.5 text-sm {self.style.get("body_text","text-stone-700")}">{bullet_items}</ul>' if bullet_items else ""

        return f'{heading_html}{text_html}{bullets_html}'

    def _build_about_right(self) -> str:
        if self.family == "concierge":
            return (
                f'<div class="aspect-[4/5] overflow-hidden rounded-[2rem] bg-gradient-to-br from-rose-50 to-orange-50/60 '
                f'ring-1 ring-stone-200/40 shadow-[0_16px_40px_rgba(190,24,93,0.05)]">'
                f'<div class="flex h-full items-center justify-center text-stone-300">'
                f'{self._placeholder_image_svg()}'
                f'</div></div>'
            )
        elif self.family == "direct":
            return (
                f'<div class="aspect-[4/3] overflow-hidden rounded-lg bg-slate-50 ring-1 ring-slate-200">'
                f'<div class="flex h-full items-center justify-center text-slate-300">'
                f'{self._placeholder_image_svg("h-14 w-14")}'
                f'</div></div>'
            )
        elif self.family == "saas":
            return (
                f'<div class="aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 '
                f'bg-gradient-to-br from-slate-100 to-white shadow-md ring-1 ring-slate-900/5">'
                f'<div class="flex h-full items-center justify-center text-slate-300">'
                f'{self._placeholder_image_svg("h-16 w-16")}'
                f'</div></div>'
            )
        elif self.family == "editorial":
            return (
                f'<div class="aspect-[3/4] border border-stone-200 bg-gradient-to-br from-stone-100 to-[#ebe4d8]">'
                f'<div class="flex h-full items-center justify-center text-stone-300">'
                f'{self._placeholder_image_svg("h-20 w-20")}'
                f'</div></div>'
            )
        elif self.family == "clinic":
            return (
                f'<div class="aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50/30 '
                f'ring-1 ring-teal-100/60">'
                f'<div class="flex h-full items-center justify-center text-teal-200">'
                f'{self._placeholder_image_svg("h-16 w-16")}'
                f'</div></div>'
            )
        return ""

    def _build_contact_left(self) -> str:
        heading_cls = f"{self.style.get('heading_size','text-4xl')} {self.style.get('heading_weight','font-semibold')} {self.style.get('heading_tracking','tracking-tight')} {self.style.get('heading_color','text-stone-950')}"
        body_cls = f"{self.style.get('body_size','text-base')} {self.style.get('body_leading','leading-8')} {self.style.get('body_text','text-stone-600')}"
        muted = self.style.get("muted_text", "text-stone-400")

        heading = self.content.get("contactHeading", "")
        subheading = self.content.get("contactSubheading", "")
        details = self.content.get("contactDetails", [])

        heading_html = f'<h2 class="{esc(heading_cls)}">{esc(heading)}</h2>'
        sub_html = f'<p class="mt-4 max-w-lg {esc(body_cls)}">{esc(subheading)}</p>' if subheading else ""

        detail_items = ""
        for d in details[:6]:
            detail_items += f'<li class="flex items-start gap-3">{self._contact_icon()}<span>{esc(d)}</span></li>'
        details_html = f'<ul class="mt-6 grid gap-3 text-sm {self.style.get("body_text","text-stone-700")}">{detail_items}</ul>' if detail_items else ""

        return f'{heading_html}{sub_html}{details_html}'

    def _build_contact_right(self) -> str:
        if self.family == "concierge":
            return (
                f'<div class="rounded-[2rem] bg-gradient-to-br from-rose-50 to-orange-50/60 p-8 '
                f'shadow-[0_16px_40px_rgba(190,24,93,0.05)] ring-1 ring-stone-200/40">'
                f'{self._form_placeholder_fields()}'
                f'</div>'
            )
        elif self.family == "direct":
            return (
                f'<div class="rounded-lg bg-slate-50 p-6 ring-1 ring-slate-200">'
                f'{self._form_placeholder_fields()}'
                f'</div>'
            )
        elif self.family == "saas":
            return (
                f'<div class="rounded-2xl border border-slate-200 bg-white p-7 shadow-md ring-1 ring-slate-900/5">'
                f'{self._form_placeholder_fields()}'
                f'</div>'
            )
        elif self.family == "editorial":
            return (
                f'<div class="border border-stone-200 bg-white p-8">'
                f'{self._form_placeholder_fields()}'
                f'</div>'
            )
        elif self.family == "clinic":
            return (
                f'<div class="rounded-2xl bg-gradient-to-br from-teal-50 to-white p-7 ring-1 ring-teal-100/60">'
                f'{self._form_placeholder_fields()}'
                f'</div>'
            )
        return ""

    # -------------------------------------------------------------------
    # Section renderers
    # -------------------------------------------------------------------

    def render_split_two_col(self, section_id: str = "", variant: str = "hero") -> str:
        """Renders a two-column split section for hero, about, or contact variants.

        Each style family produces a visually distinct layout.
        """
        sid = f' id="{esc(section_id)}"' if section_id else ""
        container = self.style.get("container", "mx-auto w-full max-w-7xl px-6 lg:px-8")
        section_py = self.style.get("section_py", "py-20")

        # --- Override container for editorial ---
        if self.family == "editorial":
            container = self.style.get("container", "mx-auto w-full max-w-6xl px-8 lg:px-10")

        # ===== Build variant-specific left and right columns =====

        if variant == "hero":
            left_html = self._build_hero_left()
            right_html = self._build_hero_right()
        elif variant == "about":
            left_html = self._build_about_left()
            right_html = self._build_about_right()
        elif variant == "contact":
            left_html = self._build_contact_left()
            right_html = self._build_contact_right()
        else:
            left_html = ""
            right_html = ""

        # ===== Family-specific grid and section styling =====
        grid_gap = self._family_gap()
        section_bg = self._family_section_bg(variant)
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

    def render_centered_stack(self, section_id: str = "", variant: str = "hero") -> str:
        """Renders a centered vertically-stacked section (hero or CTA band)."""

        family = self.family
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
            heading = self.content.get("ctaBandHeading", "")
            subheading = self.content.get("ctaBandSubheading", "")
            btn_text = self.content.get("ctaBandButtonText", "")
            dark_block = self.style.get("dark_block", "bg-slate-900 rounded-2xl")

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
                    f'<a href="#" class="{esc(self.style.get("primary_btn", ""))} {esc(c["cta_extra"])}">'
                    f'{esc(btn_text)}</a>'
                )

            inner_gap = "gap-4" if family == "direct" else "gap-6"

            return (
                f'<section{sid}>\n'
                f'  <div class="{esc(dark_block)} {esc(cta_py)}">\n'
                f'    <div class="mx-auto {esc(c["max_w"])} px-6 lg:px-8 text-center">\n'
                f'      <div class="flex flex-col items-center {inner_gap}">\n'
                f'        <h2 class="text-3xl sm:text-4xl {esc(self.style.get("heading_weight", "font-bold"))} '
                f'{esc(self.style.get("heading_tracking", "tracking-tight"))} text-white">'
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
        eyebrow = self.content.get("heroEyebrow", "")
        heading = self.content.get("heroHeading", "")
        subheading = self.content.get("heroSubheading", "")
        trust_chips = self.content.get("heroTrustChips", [])
        cta_primary = self.content.get("heroCtaPrimary", "")
        cta_note = self.content.get("heroCtaNote", "")

        parts = []

        # Eyebrow
        if eyebrow:
            eyebrow_cls = self.style.get("eyebrow_style", "text-sm font-semibold uppercase tracking-widest text-slate-500")
            parts.append(
                f'      <div class="{esc(eyebrow_cls)} {c["eyebrow_mb"]}">{esc(eyebrow)}</div>'
            )

        # Heading
        if heading:
            parts.append(
                f'      <h1 class="{c["heading_size"]} {esc(self.style.get("heading_weight", "font-bold"))} '
                f'{esc(self.style.get("heading_tracking", "tracking-tight"))} '
                f'{esc(self.style.get("heading_color", "text-slate-950"))} {c["heading_mb"]}">'
                f'{esc(heading)}</h1>'
            )

        # Subheading
        if subheading:
            parts.append(
                f'      <p class="{c["sub_size"]} {esc(self.style.get("body_leading", "leading-7"))} '
                f'{esc(self.style.get("body_text", "text-slate-600"))} max-w-xl {c["sub_mb"]}">'
                f'{esc(subheading)}</p>'
            )

        # Trust chips
        if trust_chips:
            if family == "editorial":
                # Editorial: comma-separated text, no chips
                chip_text = ", ".join(esc(chip) for chip in trust_chips)
                parts.append(
                    f'      <p class="{esc(self.style.get("muted_text", "text-stone-400"))} text-sm italic {c["chips_mb"]}">'
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
                    f'{esc(self.style.get("heading_color", "text-slate-950"))} underline underline-offset-4 '
                    f'decoration-current/40 hover:decoration-current">'
                    f'{esc(cta_primary)}</a>'
                )
            else:
                btn_cls = self.style.get("primary_btn", "")
                parts.append(
                    f'      <a href="#" class="{esc(btn_cls)} {c["cta_extra"]}">'
                    f'{esc(cta_primary)}</a>'
                )

        # CTA note
        if cta_note:
            parts.append(
                f'      <p class="{esc(self.style.get("muted_text", "text-stone-400"))} text-sm {c["note_mt"]}">'
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

    def render_card_grid(self, section_id: str = "", variant: str = "services") -> str:
        family = self.family
        container = self.style.get("container", "mx-auto w-full max-w-7xl px-6 lg:px-8")
        section_py = self.style.get("section_py", "py-20")
        heading_size = self.style.get("heading_size", "text-4xl")
        heading_weight = self.style.get("heading_weight", "font-semibold")
        heading_tracking = self.style.get("heading_tracking", "tracking-tight")
        heading_color = self.style.get("heading_color", "text-stone-950")
        body_text = self.style.get("body_text", "text-stone-600")
        body_size = self.style.get("body_size", "text-base")
        body_leading = self.style.get("body_leading", "leading-8")
        muted_text = self.style.get("muted_text", "text-stone-400")
        eyebrow_style = self.style.get("eyebrow_style", "text-xs font-medium uppercase tracking-widest text-stone-400")
        card_border = self.style.get("card_border", "border border-stone-200")
        card_bg = self.style.get("card_bg", "bg-white")
        card_radius = self.style.get("card_radius", "rounded-2xl")
        card_shadow = self.style.get("card_shadow", "shadow-sm")
        card_padding = self.style.get("card_padding", "p-7")
        badge_style = self.style.get("badge_style", "")
        primary_color = self.style.get("primary_color", "#1e3a5f")
        accent_color = self.style.get("accent_color", "#f97316")
        gap = self.style.get("gap", "gap-8")
        gap_sm = self.style.get("gap_sm", "gap-4")
        check_marker = self.style.get("check_marker", '<svg class="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>')

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

        heading_text = esc(self.content.get("sectionHeading", "") or self.content.get(f"{variant}Heading", "") or fallback_headings.get(variant, ""))
        subheading_text = esc(self.content.get("sectionSubheading", "") or self.content.get(f"{variant}Subheading", ""))
        eyebrow_text = esc(self.content.get("sectionEyebrow", "") or self.content.get(f"{variant}Eyebrow", "") or fallback_eyebrows.get(variant, ""))

        # --- Get items per variant ---
        if variant == "services":
            items = self.content.get("services", [])
        elif variant == "features":
            items = self.content.get("features", [])
        elif variant == "team":
            items = self.content.get("teamMembers", [])
        elif variant == "pricing":
            items = self.content.get("pricingPlans", [])
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
    def render_quote_block(self, section_id: str = "") -> str:
        """Renders a single featured testimonial / social-proof quote block."""

        testimonials = self.content.get("testimonials") or []
        if not testimonials:
            return ""

        t = testimonials[0]
        quote = esc(t.get("quote", ""))
        author = esc(t.get("author", ""))
        role = esc(t.get("role", ""))
        family = self.family
        container = self.style.get("container", "mx-auto w-full max-w-7xl px-6 lg:px-8")
        section_py_sm = self.style.get("section_py_sm", "py-14")
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
            hero_stats = self.content.get("heroStatCards") or []
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

    def render_quote_grid(self, section_id: str = "") -> str:
        """Renders a grid of testimonial cards, styled per family archetype."""

        testimonials = self.content.get("testimonials") or []
        if not testimonials:
            return ""

        family = self.family
        sid = f' id="{esc(section_id)}"' if section_id else ""

        # Section heading
        heading_classes = f'{self.style["heading_size"]} {self.style["heading_weight"]} {self.style["heading_color"]} {self.style.get("heading_tracking", "")}'
        heading_html = f'<h2 class="{heading_classes.strip()}">What Our Clients Say</h2>'

        # ---------- editorial: stacked blockquotes, no card grid ----------
        if family == "editorial":
            items_html = []
            for i, t in enumerate(testimonials):
                border = 'border-b border-stone-200 pb-10 mb-10' if i < len(testimonials) - 1 else ''
                items_html.append(
                    f'<div class="{border}">'
                    f'<blockquote class="text-xl md:text-2xl italic {self.style["body_text"]} leading-relaxed mb-6">'
                    f'\u201c{esc(t["quote"])}\u201d'
                    f'</blockquote>'
                    f'<p class="{self.style["heading_color"]} font-medium">'
                    f'\u2014&nbsp;{esc(t["author"])}'
                    f'<span class="{self.style["muted_text"]} font-normal ml-2">{esc(t["role"])}</span>'
                    f'</p>'
                    f'</div>'
                )
            return (
                f'<section{sid} class="{self.style["section_py"]}">'
                f'<div class="{self.style["container_narrow"]}">'
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
                    f'<p class="{self.style["body_text"]} {self.style["body_size"]} {self.style["body_leading"]} mt-2">{quote_text}</p>'
                )
                author_block = (
                    f'<div class="mt-5 pt-4 border-t border-rose-50">'
                    f'<p class="{self.style["heading_color"]} font-medium">{author}</p>'
                    f'<p class="{self.style["muted_text"]} text-sm">{role}</p>'
                    f'</div>'
                )

            elif family == "direct":
                card_cls = "rounded-lg border border-slate-200 bg-white shadow-sm p-4"
                quote_block = (
                    f'<p class="{self.style["body_text"]} {self.style["body_size"]} {self.style["body_leading"]}">{quote_text}</p>'
                )
                author_block = (
                    f'<div class="mt-4 pt-3 border-t border-slate-100">'
                    f'<p class="{self.style["heading_color"]} font-bold text-sm">{author}</p>'
                    f'<p class="{self.style["muted_text"]} text-xs">{role}</p>'
                    f'</div>'
                )

            elif family == "saas":
                card_cls = "rounded-xl border border-slate-200 bg-white shadow-sm p-5"
                quote_mark = '<span class="text-3xl leading-none text-slate-300 font-serif">\u201c</span>'
                quote_block = (
                    f'{quote_mark}'
                    f'<p class="{self.style["body_text"]} {self.style["body_size"]} {self.style["body_leading"]} mt-2">{quote_text}</p>'
                )
                author_block = (
                    f'<div class="mt-5 pt-4 border-t border-slate-100">'
                    f'<p class="{self.style["heading_color"]} font-medium text-sm">{author}</p>'
                    f'<p class="{self.style["muted_text"]} text-sm">{role}</p>'
                    f'</div>'
                )

            elif family == "clinic":
                card_cls = "rounded-xl border border-slate-200 bg-white shadow-sm p-5"
                quote_mark = '<span class="text-3xl leading-none text-teal-400 font-serif">\u201c</span>'
                quote_block = (
                    f'{quote_mark}'
                    f'<p class="{self.style["body_text"]} {self.style["body_size"]} {self.style["body_leading"]} mt-2">{quote_text}</p>'
                )
                author_block = (
                    f'<div class="mt-5 pt-4 border-t border-slate-100">'
                    f'<p class="{self.style["heading_color"]} font-medium text-sm">{author}</p>'
                    f'<p class="{self.style["muted_text"]} text-sm">{role}</p>'
                    f'</div>'
                )

            else:
                # fallback — same as saas
                card_cls = "rounded-xl border border-slate-200 bg-white shadow-sm p-5"
                quote_block = (
                    f'<p class="{self.style["body_text"]} {self.style["body_size"]} {self.style["body_leading"]}">{quote_text}</p>'
                )
                author_block = (
                    f'<div class="mt-5 pt-4 border-t border-slate-100">'
                    f'<p class="{self.style["heading_color"]} font-medium text-sm">{author}</p>'
                    f'<p class="{self.style["muted_text"]} text-sm">{role}</p>'
                    f'</div>'
                )

            cards_html.append(
                f'<div class="{card_cls}">'
                f'{quote_block}'
                f'{author_block}'
                f'</div>'
            )

        return (
            f'<section{sid} class="{self.style["section_py"]}">'
            f'<div class="{self.style["container"]}">'
            f'<div class="text-center mb-12">{heading_html}</div>'
            f'<div class="grid {grid_cols} {self.style["gap"]}">'
            f'{"".join(cards_html)}'
            f'</div>'
            f'</div>'
            f'</section>'
        )

    def render_stat_row(self, section_id: str = "") -> str:
        """Renders a row of statistics / trust indicators as a <section>."""

        stats = self.content.get("stats") or []
        if not stats:
            return ""

        family = self.family
        container = self.style.get("container", "mx-auto w-full max-w-7xl px-6 lg:px-8")
        section_py_sm = self.style.get("section_py_sm", "py-14")
        heading_size = self.style.get("heading_size", "text-3xl")
        heading_weight = self.style.get("heading_weight", "font-bold")
        heading_tracking = self.style.get("heading_tracking", "tracking-tight")
        heading_color = self.style.get("heading_color", "text-stone-950")

        # Optional section heading
        section_heading = self.content.get("statsHeading") or self.content.get("sectionHeading") or ""
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

    def render_step_sequence(self, section_id: str = "") -> str:
        """Renders a numbered step/process sequence as a <section>."""

        steps = self.content.get("steps") or []
        if not steps:
            return ""

        family = self.family
        container = self.style.get("container", "mx-auto w-full max-w-7xl px-6 lg:px-8")
        section_py = self.style.get("section_py", "py-20")
        heading_size = self.style.get("heading_size", "text-3xl")
        heading_weight = self.style.get("heading_weight", "font-bold")
        heading_tracking = self.style.get("heading_tracking", "tracking-tight")
        heading_color = self.style.get("heading_color", "text-stone-950")
        body_text = self.style.get("body_text", "text-stone-600")
        body_size = self.style.get("body_size", "text-base")

        # Section intro
        section_heading = self.content.get("stepsHeading") or self.content.get("sectionHeading") or "How It Works"
        section_sub = self.content.get("stepsSubheading") or self.content.get("sectionSubheading") or ""

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
    def render_accordion(self, section_id: str = "") -> str:
        """Renders a FAQ accordion section with <details>/<summary> elements."""

        items = self.content.get("faqItems", [])
        if not items:
            return ""

        family = self.family

        # --- Section heading tokens ---
        heading_size = self.style.get("heading_size", "text-4xl")
        heading_weight = self.style.get("heading_weight", "font-semibold")
        heading_tracking = self.style.get("heading_tracking", "tracking-tight")
        heading_color = self.style.get("heading_color", "text-stone-950")
        body_text = self.style.get("body_text", "text-stone-600")
        section_py = self.style.get("section_py", "py-20")
        container = self.style.get("container_narrow", self.style.get("container", "mx-auto w-full max-w-3xl px-6 lg:px-8"))

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

    def render_list_strip(self, section_id: str = "") -> str:
        """Renders a compact list/chip strip section for service areas, tags, coverage zones, etc."""

        items = self.content.get("serviceAreas", [])
        if not items:
            return ""

        heading = esc(self.content.get("serviceAreaHeading", "Areas We Serve"))
        family = self.family
        section_py = self.style.get("section_py_sm", "py-10")
        container = self.style.get("container", "mx-auto w-full max-w-7xl px-6 lg:px-8")
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

    def render_fullbleed_media(self, section_id: str = "") -> str:
        """Renders a full-width visual-first hero with background placeholder and text overlay at bottom-left."""

        family = self.family
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
        eyebrow = self.content.get("heroEyebrow", "")
        heading = self.content.get("heroHeading", "")
        subheading = self.content.get("heroSubheading", "")
        cta_primary = self.content.get("heroCtaPrimary", "")

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
                f'        <h1 class="{c["heading_size"]} {esc(self.style.get("heading_weight", "font-bold"))} '
                f'{esc(self.style.get("heading_tracking", "tracking-tight"))} '
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
    def render_navbar(self) -> str:
        """Default navbar. Override in subclasses for family-specific design."""
        site_name = esc(self.content.get("siteName", ""))
        nav_links = self.content.get("navLinks", [])[:5]
        nav_cta = esc(self.content.get("navCta", "Get Started"))
        primary_color = self.style.get("primary_color", "#1e3a5f")

        def link_href(text):
            return "#" + text.lower().strip().replace(" ", "-")

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

    def render_form_panel(self, section_id: str = "") -> str:
        """Default form panel. Override in subclasses for family-specific fields."""
        heading = esc(self.content.get("contactHeading", "Get in Touch"))
        subheading = esc(self.content.get("contactSubheading", ""))
        details = self.content.get("contactDetails", [])
        marker = self.style.get("check_marker", self.style.get("bullet_marker", "&#x2022;"))
        sid = f' id="{esc(section_id)}"' if section_id else ""
        section_py = esc(self.style.get("section_py", "py-16"))
        container = esc(self.style.get("container", "mx-auto w-full max-w-7xl px-6 lg:px-8"))

        details_html = ""
        if details:
            items = "".join(
                f'<li class="flex items-start gap-3">'
                f'<span class="shrink-0 mt-0.5">{marker}</span>'
                f'<span class="{esc(self.style.get("body_text", "text-slate-500"))} {esc(self.style.get("body_size", "text-base"))}">{esc(d)}</span>'
                f'</li>'
                for d in details
            )
            details_html = f'<ul class="mt-8 space-y-4">{items}</ul>'

        left_col = (
            f'<div class="flex flex-col justify-center">'
            f'<h2 class="{esc(self.style.get("heading_size", "text-4xl"))} {esc(self.style.get("heading_weight", "font-bold"))} '
            f'{esc(self.style.get("heading_tracking", "tracking-tight"))} {esc(self.style.get("heading_color", "text-slate-950"))}">'
            f'{heading}</h2>'
        )
        if subheading:
            left_col += (
                f'<p class="mt-4 {esc(self.style.get("body_text", "text-slate-500"))} '
                f'{esc(self.style.get("body_size", "text-base"))} {esc(self.style.get("body_leading", "leading-7"))}">'
                f'{subheading}</p>'
            )
        left_col += details_html + '</div>'

        panel_cls = "rounded-xl border border-slate-200 bg-slate-50 shadow-sm p-6"
        input_cls = "w-full px-4 py-2.5 text-sm outline-none rounded-lg border border-slate-200 bg-white focus:border-slate-400 transition"

        form_html = (
            f'<div class="{panel_cls}">'
            f'<form onsubmit="return false;" class="flex flex-col gap-4">'
            f'<div><label class="block text-xs font-medium {esc(self.style.get("muted_text", "text-slate-400"))} mb-1">Name</label>'
            f'<input type="text" placeholder="Your name" class="{input_cls}" /></div>'
            f'<div><label class="block text-xs font-medium {esc(self.style.get("muted_text", "text-slate-400"))} mb-1">Email</label>'
            f'<input type="email" placeholder="you@example.com" class="{input_cls}" /></div>'
            f'<div><label class="block text-xs font-medium {esc(self.style.get("muted_text", "text-slate-400"))} mb-1">Phone</label>'
            f'<input type="tel" placeholder="(555) 123-4567" class="{input_cls}" /></div>'
            f'<div><label class="block text-xs font-medium {esc(self.style.get("muted_text", "text-slate-400"))} mb-1">Message</label>'
            f'<textarea rows="4" placeholder="How can we help?" class="{input_cls}"></textarea></div>'
            f'<div><button type="submit" class="w-full py-2.5 px-6 text-sm font-medium text-white bg-slate-900 rounded-lg transition hover:bg-slate-800">'
            f'Send Message</button></div>'
            f'</form></div>'
        )

        return (
            f'<section{sid} class="{section_py}">'
            f'<div class="{container}">'
            f'<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">'
            f'{left_col}{form_html}'
            f'</div></div></section>'
        )

    def render_footer(self) -> str:
        """Default footer. Override in subclasses for family-specific design."""
        site_name = esc(self.content.get("siteName", ""))
        tagline = esc(self.content.get("footerTagline", ""))
        year = esc(self.content.get("copyrightYear", "2026"))
        columns = self.content.get("footerColumns", [])
        container = esc(self.style.get("container", "mx-auto w-full max-w-7xl px-6 lg:px-8"))

        cols_html = ""
        for col in columns:
            title = esc(col.get("title", ""))
            links = col.get("links", [])
            links_html = "".join(
                f'<li><a href="{esc(l.get("href", "#"))}" class="text-sm text-white/60 hover:text-white transition-colors">{esc(l.get("text", ""))}</a></li>'
                for l in links
            )
            cols_html += (
                f'<div>'
                f'<h4 class="text-xs font-semibold uppercase tracking-wider text-white/50 mb-3">{title}</h4>'
                f'<ul class="space-y-2">{links_html}</ul>'
                f'</div>'
            )

        return (
            f'<footer class="bg-slate-950 text-white">'
            f'<div class="{container} py-12">'
            f'<div class="grid grid-cols-2 md:grid-cols-4 gap-8">'
            f'<div class="col-span-2 md:col-span-1">'
            f'<div class="text-lg font-semibold">{site_name}</div>'
            f'<p class="mt-2 text-sm text-white/50">{tagline}</p>'
            f'</div>'
            f'{cols_html}'
            f'</div>'
            f'<div class="mt-10 pt-6 border-t border-white/10 text-xs text-white/40">'
            f'&copy; {year} {site_name}. All rights reserved.'
            f'</div>'
            f'</div>'
            f'</footer>'
        )

    def render_section(self, archetype: str, section_id: str = "", variant: str = "") -> str:
        """Dispatch archetype string to the appropriate render method."""
        dispatch = {
            "split_two_col": lambda: self.render_split_two_col(section_id=section_id, variant=variant),
            "centered_stack": lambda: self.render_centered_stack(section_id=section_id, variant=variant),
            "card_grid": lambda: self.render_card_grid(section_id=section_id, variant=variant),
            "quote_block": lambda: self.render_quote_block(section_id=section_id),
            "quote_grid": lambda: self.render_quote_grid(section_id=section_id),
            "stat_row": lambda: self.render_stat_row(section_id=section_id),
            "step_sequence": lambda: self.render_step_sequence(section_id=section_id),
            "accordion": lambda: self.render_accordion(section_id=section_id),
            "form_panel": lambda: self.render_form_panel(section_id=section_id),
            "list_strip": lambda: self.render_list_strip(section_id=section_id),
            "fullbleed_media": lambda: self.render_fullbleed_media(section_id=section_id),
            "footer_columns": lambda: self.render_footer(),
        }
        fn = dispatch.get(archetype)
        return fn() if fn else ""
