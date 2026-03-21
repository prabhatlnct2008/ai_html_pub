from __future__ import annotations

from .base import BaseRenderer, esc


class RehabRenderer(BaseRenderer):
    """Warm, luxurious, nature-inspired design for rehab centers and addiction treatment facilities."""

    FAMILY = "rehab"
    FONT = "Inter"
    BODY_BG = "linear-gradient(180deg, #faf9f7 0%, #ffffff 40%, #f5f3ef 100%)"

    @classmethod
    def get_style(cls, primary_color: str = "#3d6b5e", accent_color: str = "#b8860b") -> dict[str, str]:
        base = {"family": cls.FAMILY, "primary_color": primary_color, "accent_color": accent_color}
        return {
            **base,
            "card_border": "border border-stone-200/70",
            "card_bg": "bg-white",
            "card_radius": "rounded-2xl",
            "card_shadow": "shadow-[0_8px_30px_rgba(61,107,94,0.06)]",
            "card_padding": "p-6",
            "heading_size": "text-3xl lg:text-4xl",
            "heading_weight": "font-semibold",
            "heading_tracking": "tracking-[-0.03em]",
            "heading_color": "text-stone-900",
            "body_text": "text-stone-600",
            "body_size": "text-base",
            "body_leading": "leading-7",
            "muted_text": "text-stone-400",
            "eyebrow_style": "mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#3d6b5e]",
            "badge_style": "rounded-full border border-stone-200 bg-stone-50 px-3.5 py-1.5 text-xs font-medium text-stone-700",
            "section_py": "py-20",
            "section_py_sm": "py-12",
            "container": "mx-auto w-full max-w-7xl px-6 lg:px-8",
            "container_narrow": "mx-auto w-full max-w-3xl px-6 lg:px-8",
            "gap": "gap-7",
            "gap_sm": "gap-4",
            "bullet_marker": "<span class='mt-1 h-2 w-2 shrink-0 rounded-full bg-[#3d6b5e]'></span>",
            "check_marker": "<span class='text-[#3d6b5e]'>&#10003;</span>",
            "primary_btn": f"inline-flex items-center justify-center rounded-xl bg-[{primary_color}] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90",
            "secondary_btn": f"inline-flex items-center justify-center rounded-xl border border-[{primary_color}]/30 bg-transparent px-7 py-3.5 text-sm font-semibold text-stone-800 transition hover:bg-[{primary_color}]/5",
            "dark_block": "rounded-2xl bg-stone-900 text-stone-50",
            "section_border": "border-stone-200/60",
        }

    # ------------------------------------------------------------------
    # Navbar — serene, luxury feel
    # ------------------------------------------------------------------

    def render_navbar(self) -> str:
        site_name = esc(self.content.get("siteName", ""))
        nav_links = self.content.get("navLinks", [])[:5]
        nav_cta = esc(self.content.get("navCta", "Get Help Now"))
        primary_color = esc(self.style.get("primary_color", "#3d6b5e"))

        def link_href(text):
            return "#" + text.lower().strip().replace(" ", "-")

        links_html = ""
        for link in nav_links:
            links_html += (
                f'<a href="{esc(link_href(link))}" '
                f'class="text-stone-500 hover:text-stone-800 transition-colors duration-200 text-sm font-medium">'
                f'{esc(link)}</a>'
            )

        # Leaf/nature icon
        leaf_icon = (
            '<svg class="h-5 w-5 text-[#3d6b5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">'
            '<path stroke-linecap="round" stroke-linejoin="round" '
            'd="M12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9z"/>'
            '<path stroke-linecap="round" stroke-linejoin="round" d="M12 8v8m-4-4h8"/>'
            '</svg>'
        )

        return (
            f'<nav class="sticky top-0 z-50 bg-[#faf9f7]/95 backdrop-blur-lg border-b border-stone-200/60">'
            f'<div class="mx-auto w-full max-w-7xl px-6 lg:px-8 flex items-center justify-between py-4">'
            f'<div class="flex items-center gap-2">'
            f'{leaf_icon}'
            f'<a href="#" class="text-lg font-semibold text-stone-800 tracking-tight">{site_name}</a>'
            f'</div>'
            f'<div class="hidden md:flex items-center gap-8">{links_html}</div>'
            f'<div class="flex items-center gap-3">'
            f'<a href="tel:+1800RECOVER" class="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-stone-800 transition">'
            f'<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
            f'<path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>'
            f'</svg>24/7 Helpline</a>'
            f'<a href="#contact" class="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90" '
            f'style="background-color:{primary_color}">{nav_cta}</a>'
            f'</div>'
            f'</div></nav>'
        )

    # ------------------------------------------------------------------
    # Form panel — Confidential assessment intake
    # ------------------------------------------------------------------

    def render_form_panel(self, section_id: str = "") -> str:
        sid = f' id="{esc(section_id)}"' if section_id else ""
        heading = esc(self.content.get("contactHeading", "Begin Your Recovery Journey"))
        subheading = esc(self.content.get("contactSubheading", ""))
        details = self.content.get("contactDetails", [])
        marker = self.style.get("check_marker", "&#10003;")
        primary_color = esc(self.style.get("primary_color", "#3d6b5e"))

        details_html = ""
        if details:
            items = "".join(
                f'<li class="flex items-start gap-3">'
                f'<span class="shrink-0 mt-0.5">{marker}</span>'
                f'<span class="text-stone-600 text-base">{esc(d)}</span></li>'
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
            left_col += f'<p class="mt-4 text-stone-600 text-base leading-7">{subheading}</p>'

        # Reassurance box
        left_col += (
            f'<div class="mt-8 rounded-xl border border-[#3d6b5e]/20 bg-[#3d6b5e]/5 p-5">'
            f'<p class="text-sm font-semibold text-stone-800 mb-2">What happens next?</p>'
            f'<ol class="space-y-2 text-sm text-stone-600">'
            f'<li class="flex items-start gap-2"><span class="font-semibold text-[#3d6b5e]">1.</span> A counselor calls you within 30 minutes</li>'
            f'<li class="flex items-start gap-2"><span class="font-semibold text-[#3d6b5e]">2.</span> We verify your insurance coverage</li>'
            f'<li class="flex items-start gap-2"><span class="font-semibold text-[#3d6b5e]">3.</span> We create a personalized treatment plan</li>'
            f'</ol></div>'
        )
        left_col += details_html + '</div>'

        input_cls = "w-full px-4 py-2.5 text-sm outline-none rounded-xl border border-stone-200 focus:border-[#3d6b5e] focus:ring-1 focus:ring-[#3d6b5e]/20 transition"

        form_html = (
            f'<div class="rounded-2xl border border-stone-200/70 bg-white shadow-[0_8px_30px_rgba(61,107,94,0.06)] p-7">'
            f'<p class="mb-5 text-center text-xs font-semibold uppercase tracking-wider text-[#3d6b5e]">Confidential Assessment</p>'
            f'<form onsubmit="return false;" class="flex flex-col gap-4">'
            f'<div class="grid grid-cols-2 gap-3">'
            f'<div><label class="block text-xs font-medium text-stone-400 mb-1">First Name</label>'
            f'<input type="text" placeholder="First name" class="{input_cls}" /></div>'
            f'<div><label class="block text-xs font-medium text-stone-400 mb-1">Last Name</label>'
            f'<input type="text" placeholder="Last name" class="{input_cls}" /></div></div>'
            f'<div><label class="block text-xs font-medium text-stone-400 mb-1">Phone</label>'
            f'<input type="tel" placeholder="Best number to reach you" class="{input_cls}" /></div>'
            f'<div><label class="block text-xs font-medium text-stone-400 mb-1">Email</label>'
            f'<input type="email" placeholder="you@email.com" class="{input_cls}" /></div>'
            f'<div><label class="block text-xs font-medium text-stone-400 mb-1">Insurance Provider</label>'
            f'<input type="text" placeholder="e.g. Blue Cross, Aetna, Self-pay" class="{input_cls}" /></div>'
            f'<div><label class="block text-xs font-medium text-stone-400 mb-1">Tell Us About Your Situation</label>'
            f'<textarea rows="3" placeholder="Anything you&#x27;d like us to know (substance, duration, previous treatment)..." class="{input_cls}"></textarea></div>'
            f'<button type="submit" class="w-full rounded-xl py-3.5 text-sm font-semibold text-white transition hover:opacity-90" '
            f'style="background-color:{primary_color}">Request Free Assessment</button>'
            f'<p class="text-xs text-stone-400 text-center flex items-center justify-center gap-1.5">'
            f'<svg class="h-3.5 w-3.5 text-[#3d6b5e] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
            f'<path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>'
            f'</svg>100% confidential. We never share your information.</p>'
            f'</form></div>'
        )

        return (
            f'<section{sid} class="{esc(self.style.get("section_py", "py-20"))}">'
            f'<div class="{esc(self.style.get("container", ""))}">'
            f'<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">'
            f'{left_col}{form_html}'
            f'</div></div></section>'
        )

    # ------------------------------------------------------------------
    # Footer — warm, supportive, always-available
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
                f'<li><a href="{esc(l.get("href", "#"))}" class="text-sm text-stone-400 hover:text-white transition-colors">{esc(l.get("text", ""))}</a></li>'
                for l in col.get("links", [])
            )
            cols_html += (
                f'<div>'
                f'<h4 class="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-4">{title}</h4>'
                f'<ul class="space-y-2.5">{links_html}</ul></div>'
            )

        return (
            f'<footer class="bg-stone-900 text-stone-100">'
            # Helpline banner
            f'<div class="bg-[#3d6b5e] py-4">'
            f'<div class="mx-auto w-full max-w-7xl px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-center gap-3 text-center">'
            f'<svg class="h-5 w-5 text-white/80 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
            f'<path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>'
            f'</svg>'
            f'<p class="text-sm font-medium text-white">Need help now? Call our 24/7 confidential helpline: '
            f'<a href="tel:+18001234567" class="underline underline-offset-2 font-bold">1-800-123-4567</a></p>'
            f'</div></div>'
            # Main footer
            f'<div class="mx-auto w-full max-w-7xl px-6 lg:px-8 py-14">'
            f'<div class="grid grid-cols-1 md:grid-cols-4 gap-10">'
            # Brand
            f'<div>'
            f'<p class="text-lg font-semibold text-white mb-2">{site_name}</p>'
            f'<p class="text-sm text-stone-400 leading-relaxed">{tagline}</p>'
            f'<div class="mt-5 space-y-2">'
            f'<div class="flex items-center gap-2 text-sm text-stone-300">'
            f'<span class="text-[#7cb59d]">&#10003;</span> Licensed &amp; Accredited</div>'
            f'<div class="flex items-center gap-2 text-sm text-stone-300">'
            f'<span class="text-[#7cb59d]">&#10003;</span> Joint Commission Certified</div>'
            f'<div class="flex items-center gap-2 text-sm text-stone-300">'
            f'<span class="text-[#7cb59d]">&#10003;</span> Insurance Accepted</div>'
            f'</div></div>'
            f'{cols_html}'
            f'</div></div>'
            # Copyright
            f'<div class="border-t border-stone-800">'
            f'<div class="mx-auto w-full max-w-7xl px-6 lg:px-8 py-5">'
            f'<div class="flex flex-col sm:flex-row items-center justify-between gap-3">'
            f'<p class="text-xs text-stone-500">&copy; {year} {site_name}. All rights reserved.</p>'
            f'<p class="text-xs text-stone-500">SAMHSA Helpline: 1-800-662-4357</p>'
            f'</div></div></div>'
            f'</footer>'
        )
