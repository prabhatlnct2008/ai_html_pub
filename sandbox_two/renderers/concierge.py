from __future__ import annotations
from .base import BaseRenderer, esc


class ConciergeRenderer(BaseRenderer):
    FAMILY = "concierge"
    FONT = "Inter"
    BODY_BG = "linear-gradient(180deg, #fffdf8 0%, #fff8f1 30%, #ffffff 100%)"

    @classmethod
    def get_style(cls, primary_color: str = "#2563eb", accent_color: str = "#f97316") -> dict[str, str]:
        base = {"family": cls.FAMILY, "primary_color": primary_color, "accent_color": accent_color}
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

    def render_navbar(self) -> str:
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

    def render_form_panel(self, section_id: str = "") -> str:
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

        # --- Right column: form panel ---
        accent = esc(self.style.get("accent_color", "#f97316"))
        panel_cls = "rounded-2xl border border-rose-100/60 bg-white shadow-[0_20px_50px_rgba(190,24,93,0.06)] p-7"
        input_cls = "w-full px-4 py-2.5 text-sm outline-none rounded-xl border border-rose-100 focus:border-rose-300 transition"
        textarea_cls = input_cls
        field_gap = "gap-4"
        submit = (
            f'<button type="submit" class="w-full py-2.5 px-6 text-sm font-medium text-white rounded-xl transition hover:opacity-90" '
            f'style="background-color:{accent}">Send Message</button>'
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
            f'<label class="block text-xs font-medium {muted} mb-1">Phone</label>'
            f'<input type="tel" placeholder="(555) 123-4567" class="{esc(input_cls)}" />'
            f'</div>'
            f'<div>'
            f'<label class="block text-xs font-medium {muted} mb-1">Message</label>'
            f'<textarea rows="4" placeholder="How can we help?" class="{esc(textarea_cls)}"></textarea>'
            f'</div>'
            f'<div>{submit}</div>'
            f'</form>'
            f'</div>'
        )

        # --- Assemble section ---
        sid = f' id="{esc(section_id)}"' if section_id else ""
        section_py = esc(self.style.get("section_py", "py-20"))
        container = esc(self.style.get("container", "mx-auto w-full max-w-7xl px-6 lg:px-8"))

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
        section_py_sm = self.style.get("section_py_sm", "py-14")
        container = self.style.get("container", "mx-auto w-full max-w-7xl px-6 lg:px-8")

        site_name = esc(self.content.get("siteName", ""))
        tagline = esc(self.content.get("footerTagline", ""))
        year = esc(self.content.get("copyrightYear", "2026"))
        columns = self.content.get("footerColumns", [])

        wrapper_cls = "rounded-[2rem] bg-[#24161d] text-[#fff7f6] p-8 lg:p-10"
        name_cls = "text-2xl font-semibold"
        tagline_cls = "mt-2 text-sm text-white/60 leading-relaxed"
        title_cls = "uppercase tracking-wide text-white/50 text-sm font-medium mb-3"
        link_cls = "text-white/70 hover:text-white transition-colors text-sm"
        copyright_cls = "mt-10 text-white/40 text-sm"

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
