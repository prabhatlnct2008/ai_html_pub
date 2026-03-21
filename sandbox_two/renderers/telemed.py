from __future__ import annotations

from .base import BaseRenderer, esc


class TelemedRenderer(BaseRenderer):
    """Clean, modern, trust-forward design for telemedicine and virtual health platforms."""

    FAMILY = "telemed"
    FONT = "Inter"
    BODY_BG = "linear-gradient(180deg, #f0f7ff 0%, #ffffff 40%, #f8fafc 100%)"

    @classmethod
    def get_style(cls, primary_color: str = "#1d4ed8", accent_color: str = "#0ea5e9") -> dict[str, str]:
        base = {"family": cls.FAMILY, "primary_color": primary_color, "accent_color": accent_color}
        return {
            **base,
            "card_border": "border border-blue-100/80",
            "card_bg": "bg-white",
            "card_radius": "rounded-2xl",
            "card_shadow": "shadow-[0_8px_30px_rgba(29,78,216,0.06)]",
            "card_padding": "p-6",
            "heading_size": "text-3xl lg:text-4xl",
            "heading_weight": "font-bold",
            "heading_tracking": "tracking-tight",
            "heading_color": "text-slate-950",
            "body_text": "text-slate-600",
            "body_size": "text-base",
            "body_leading": "leading-7",
            "muted_text": "text-slate-400",
            "eyebrow_style": "mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-blue-600",
            "badge_style": "rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-medium text-blue-700",
            "section_py": "py-16",
            "section_py_sm": "py-10",
            "container": "mx-auto w-full max-w-7xl px-6 lg:px-8",
            "container_narrow": "mx-auto w-full max-w-3xl px-6 lg:px-8",
            "gap": "gap-6",
            "gap_sm": "gap-4",
            "bullet_marker": f"<span class='mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-100 text-[0.6rem] font-bold text-blue-600'>&#10003;</span>",
            "check_marker": f"<span class='text-blue-600'>&#10003;</span>",
            "primary_btn": f"inline-flex items-center justify-center rounded-xl bg-[{primary_color}] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90",
            "secondary_btn": "inline-flex items-center justify-center rounded-xl border border-blue-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-blue-50",
            "dark_block": "rounded-2xl bg-slate-950 text-white",
            "section_border": "",
        }

    # ------------------------------------------------------------------
    # Navbar — clean medical with video-call CTA
    # ------------------------------------------------------------------

    def render_navbar(self) -> str:
        site_name = esc(self.content.get("siteName", ""))
        nav_links = self.content.get("navLinks", [])[:5]
        nav_cta = esc(self.content.get("navCta", "Start Visit"))
        primary_color = esc(self.style.get("primary_color", "#1d4ed8"))

        def link_href(text):
            return "#" + text.lower().strip().replace(" ", "-")

        links_html = ""
        for link in nav_links:
            links_html += (
                f'<a href="{esc(link_href(link))}" '
                f'class="text-slate-500 hover:text-blue-700 transition-colors duration-200 text-sm font-medium">'
                f'{esc(link)}</a>'
            )

        # Video-call icon SVG
        video_icon = (
            '<svg class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
            '<path stroke-linecap="round" stroke-linejoin="round" '
            'd="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>'
            '</svg>'
        )

        return (
            f'<nav class="sticky top-0 z-50 bg-white/[0.97] backdrop-blur-lg border-b border-blue-100/60">'
            f'<div class="mx-auto w-full max-w-7xl px-6 lg:px-8 flex items-center justify-between py-4">'
            f'<div class="flex items-center gap-2">'
            f'<div class="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">'
            f'<svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
            f'<path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>'
            f'</svg></div>'
            f'<a href="#" class="text-lg font-bold text-slate-900 tracking-tight">{site_name}</a>'
            f'</div>'
            f'<div class="hidden md:flex items-center gap-8">{links_html}</div>'
            f'<a href="#contact" class="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90" '
            f'style="background-color:{primary_color}">{video_icon}{nav_cta}</a>'
            f'</div>'
            f'</nav>'
        )

    # ------------------------------------------------------------------
    # Form panel — Virtual consultation intake
    # ------------------------------------------------------------------

    def render_form_panel(self, section_id: str = "") -> str:
        sid = f' id="{esc(section_id)}"' if section_id else ""
        heading = esc(self.content.get("contactHeading", "Start Your Virtual Visit"))
        subheading = esc(self.content.get("contactSubheading", ""))
        details = self.content.get("contactDetails", [])
        marker = self.style.get("check_marker", "&#10003;")

        details_html = ""
        if details:
            items = "".join(
                f'<li class="flex items-start gap-3">'
                f'<span class="shrink-0 mt-0.5">{marker}</span>'
                f'<span class="text-slate-600 text-base">{esc(d)}</span></li>'
                for d in details
            )
            details_html = f'<ul class="mt-8 space-y-4">{items}</ul>'

        left_col = (
            f'<div class="flex flex-col justify-center">'
            f'<h2 class="{esc(self.style.get("heading_size", ""))} {esc(self.style.get("heading_weight", ""))} '
            f'{esc(self.style.get("heading_tracking", ""))} {esc(self.style.get("heading_color", ""))}">'
            f'{heading}</h2>'
        )
        if subheading:
            left_col += f'<p class="mt-4 text-slate-600 text-base leading-7">{subheading}</p>'
        left_col += details_html + '</div>'

        input_cls = "w-full px-4 py-2.5 text-sm outline-none rounded-xl border border-blue-100 focus:border-blue-400 focus:ring-1 focus:ring-blue-200 transition"
        primary_color = esc(self.style.get("primary_color", "#1d4ed8"))

        form_html = (
            f'<div class="rounded-2xl border border-blue-100/80 bg-white shadow-[0_8px_30px_rgba(29,78,216,0.06)] p-7">'
            f'<form onsubmit="return false;" class="flex flex-col gap-4">'
            f'<div><label class="block text-xs font-medium text-slate-400 mb-1">Full Name</label>'
            f'<input type="text" placeholder="Your full name" class="{input_cls}" /></div>'
            f'<div class="grid grid-cols-2 gap-3">'
            f'<div><label class="block text-xs font-medium text-slate-400 mb-1">Email</label>'
            f'<input type="email" placeholder="you@email.com" class="{input_cls}" /></div>'
            f'<div><label class="block text-xs font-medium text-slate-400 mb-1">Phone</label>'
            f'<input type="tel" placeholder="(555) 123-4567" class="{input_cls}" /></div></div>'
            f'<div><label class="block text-xs font-medium text-slate-400 mb-1">State of Residence</label>'
            f'<input type="text" placeholder="e.g. California" class="{input_cls}" /></div>'
            f'<div><label class="block text-xs font-medium text-slate-400 mb-1">Insurance Provider</label>'
            f'<input type="text" placeholder="e.g. Blue Cross, Medicaid, Self-pay" class="{input_cls}" /></div>'
            f'<div><label class="block text-xs font-medium text-slate-400 mb-1">Reason for Visit</label>'
            f'<textarea rows="3" placeholder="Briefly describe your concern..." class="{input_cls}"></textarea></div>'
            f'<button type="submit" class="w-full rounded-xl py-3 text-sm font-semibold text-white transition hover:opacity-90" '
            f'style="background-color:{primary_color}">Schedule My Consultation</button>'
            f'<p class="text-xs text-slate-400 mt-1 flex items-center gap-1.5">'
            f'<svg class="h-3.5 w-3.5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
            f'<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>'
            f'</svg>HIPAA-compliant &amp; encrypted</p>'
            f'</form></div>'
        )

        return (
            f'<section{sid} class="{esc(self.style.get("section_py", "py-16"))}">'
            f'<div class="{esc(self.style.get("container", ""))}">'
            f'<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">'
            f'{left_col}{form_html}'
            f'</div></div></section>'
        )

    # ------------------------------------------------------------------
    # Footer — medical/telehealth footer with compliance info
    # ------------------------------------------------------------------

    def render_footer(self) -> str:
        site_name = esc(self.content.get("siteName", ""))
        tagline = esc(self.content.get("footerTagline", ""))
        year = esc(self.content.get("copyrightYear", "2026"))
        columns = self.content.get("footerColumns", [])

        cols_html = ""
        for col in columns:
            title = esc(col.get("title", ""))
            links_html = "".join(
                f'<li><a href="{esc(l.get("href", "#"))}" class="text-sm text-slate-400 hover:text-white transition-colors">{esc(l.get("text", ""))}</a></li>'
                for l in col.get("links", [])
            )
            cols_html += (
                f'<div>'
                f'<h4 class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">{title}</h4>'
                f'<ul class="space-y-2.5">{links_html}</ul></div>'
            )

        return (
            f'<footer class="bg-slate-950 text-white">'
            f'<div class="mx-auto w-full max-w-7xl px-6 lg:px-8 py-14">'
            f'<div class="grid grid-cols-1 md:grid-cols-4 gap-10">'
            # Brand column
            f'<div>'
            f'<div class="flex items-center gap-2 mb-3">'
            f'<div class="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center">'
            f'<svg class="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
            f'<path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>'
            f'</svg></div>'
            f'<span class="text-lg font-bold">{site_name}</span></div>'
            f'<p class="text-sm text-slate-400 leading-relaxed">{tagline}</p>'
            f'<div class="mt-5 flex flex-wrap gap-2">'
            f'<span class="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-300">'
            f'<svg class="h-3 w-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
            f'<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>'
            f'</svg>HIPAA Compliant</span>'
            f'<span class="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-300">'
            f'<svg class="h-3 w-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
            f'<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>'
            f'</svg>DEA Licensed</span></div>'
            f'</div>'
            f'{cols_html}'
            f'</div></div>'
            # Bottom bar
            f'<div class="border-t border-slate-800">'
            f'<div class="mx-auto w-full max-w-7xl px-6 lg:px-8 py-5">'
            f'<div class="flex flex-col sm:flex-row items-center justify-between gap-4">'
            f'<p class="text-sm font-medium text-red-400 flex items-center gap-2">'
            f'<svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
            f'<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>'
            f'</svg>If this is an emergency, call 911</p>'
            f'<p class="text-xs text-slate-500">&copy; {year} {site_name}. All rights reserved. Not a substitute for emergency care.</p>'
            f'</div></div></div>'
            f'</footer>'
        )
