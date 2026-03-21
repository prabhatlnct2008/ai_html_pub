from __future__ import annotations
from .base import BaseRenderer, esc


class EditorialRenderer(BaseRenderer):
    FAMILY = "editorial"
    FONT = "Playfair Display"
    BODY_BG = "linear-gradient(180deg, #f7f1e8 0%, #ffffff 38%, #f6f3ee 100%)"

    @classmethod
    def get_style(cls, primary_color="#2563eb", accent_color="#f97316") -> dict[str, str]:
        base = {"family": cls.FAMILY, "primary_color": primary_color, "accent_color": accent_color}
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

    def render_navbar(self) -> str:
        site_name = esc(self.content.get("siteName", ""))
        nav_links = self.content.get("navLinks", [])[:5]
        nav_cta = esc(self.content.get("navCta", "Get Started"))

        def link_href(text):
            return "#" + text.lower().strip().replace(" ", "-")

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

    def render_form_panel(self, section_id="") -> str:
        sid = f' id="{esc(section_id)}"' if section_id else ""
        heading = esc(self.content.get("contactHeading", "Get in Touch"))
        subheading = esc(self.content.get("contactSubheading", ""))
        details = self.content.get("contactDetails", [])
        marker = self.style.get("check_marker", self.style.get("bullet_marker", "&#x2022;"))

        # --- Left column: heading + subheading + contact details ---
        details_html = ""
        if details:
            items = "".join(
                f'<li class="flex items-start gap-3">'
                f'<span class="shrink-0 mt-0.5">{marker}</span>'
                f'<span class="{esc(self.style.get("body_text", "text-stone-600"))} {esc(self.style.get("body_size", "text-base"))}">{esc(d)}</span>'
                f'</li>'
                for d in details
            )
            details_html = f'<ul class="mt-8 space-y-4">{items}</ul>'

        left_col = (
            f'<div class="flex flex-col justify-center">'
            f'<h2 class="{esc(self.style.get("heading_size", "text-4xl"))} {esc(self.style.get("heading_weight", "font-semibold"))} '
            f'{esc(self.style.get("heading_tracking", "tracking-tight"))} {esc(self.style.get("heading_color", "text-stone-950"))}">'
            f'{heading}</h2>'
        )
        if subheading:
            left_col += (
                f'<p class="mt-4 {esc(self.style.get("body_text", "text-stone-600"))} '
                f'{esc(self.style.get("body_size", "text-base"))} {esc(self.style.get("body_leading", "leading-7"))}">'
                f'{subheading}</p>'
            )
        left_col += details_html + '</div>'

        # --- Right column: editorial form (minimal, underline inputs) ---
        panel_cls = "p-0"
        input_cls = "w-full px-0 py-2.5 text-sm outline-none border-0 border-b border-stone-200 bg-transparent focus:border-stone-400 transition"
        field_gap = "gap-6"
        submit = (
            '<button type="submit" class="inline-block text-sm font-medium text-stone-900 underline underline-offset-4 '
            'decoration-stone-400 hover:decoration-stone-900 transition mt-2">Send Message</button>'
        )

        muted = esc(self.style.get("muted_text", "text-stone-400"))

        form_html = (
            f'<div class="{esc(panel_cls)}">'
            f'<form onsubmit="return false;" class="flex flex-col {esc(field_gap)}">'
            f'<div>'
            f'<label class="block text-xs font-medium {muted} mb-1">Name</label>'
            f'<input type="text" placeholder="Your name" class="{esc(input_cls)}" />'
            f'</div>'
            f'<div>'
            f'<label class="block text-xs font-medium {muted} mb-1">Email</label>'
            f'<input type="email" placeholder="you@example.com" class="{esc(input_cls)}" />'
            f'</div>'
            f'<div>'
            f'<label class="block text-xs font-medium {muted} mb-1">Message</label>'
            f'<textarea rows="4" placeholder="How can we help?" class="{esc(input_cls)}"></textarea>'
            f'</div>'
            f'<div>{submit}</div>'
            f'</form>'
            f'</div>'
        )

        section_py = esc(self.style.get("section_py", "py-24"))
        container = esc(self.style.get("container", "mx-auto w-full max-w-6xl px-8 lg:px-10"))

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

    def render_footer(self) -> str:
        site_name = esc(self.content.get("siteName", ""))
        year = "2025"

        return (
            f'<footer class="bg-[#1f1812] text-[#f9f4ea]">'
            f'<div class="mx-auto w-full max-w-6xl px-8 lg:px-10 py-16">'
            # Brand name centered
            f'<div class="text-center">'
            f'<a href="#" class="text-lg font-normal tracking-tight text-[#f9f4ea]">{site_name}</a>'
            f'</div>'
            # Sparse horizontal links
            f'<div class="mt-8 flex items-center justify-center gap-1 text-xs tracking-[0.14em] uppercase text-[#b8a98a]">'
            f'<a href="#about" class="hover:text-[#f9f4ea] transition-colors duration-200 px-3">About</a>'
            f'<span class="text-[#5a4d3b]">|</span>'
            f'<a href="#services" class="hover:text-[#f9f4ea] transition-colors duration-200 px-3">Services</a>'
            f'<span class="text-[#5a4d3b]">|</span>'
            f'<a href="#contact" class="hover:text-[#f9f4ea] transition-colors duration-200 px-3">Contact</a>'
            f'<span class="text-[#5a4d3b]">|</span>'
            f'<a href="#privacy" class="hover:text-[#f9f4ea] transition-colors duration-200 px-3">Privacy</a>'
            f'</div>'
            # Thin divider
            f'<div class="mt-8 border-t border-[#3a2f23]"></div>'
            # Copyright
            f'<p class="mt-6 text-center text-xs text-[#7a6b56]">'
            f'&copy; {year} {site_name}. All rights reserved.</p>'
            f'</div>'
            f'</footer>'
        )
