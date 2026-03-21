from __future__ import annotations
from .base import BaseRenderer, esc


class SaasRenderer(BaseRenderer):
    FAMILY = "saas"
    FONT = "Inter"
    BODY_BG = "linear-gradient(180deg, #f8fafc 0%, #ffffff 40%, #f1f5f9 100%)"

    @classmethod
    def get_style(cls, primary_color: str = "#2563eb", accent_color: str = "#f97316") -> dict[str, str]:
        base = {"family": cls.FAMILY, "primary_color": primary_color, "accent_color": accent_color}
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
        heading = esc(self.content.get("contactHeading", "Request a Demo"))
        subheading = esc(self.content.get("contactSubheading", ""))
        details = self.content.get("contactDetails", [])
        marker = self.style.get("check_marker", self.style.get("bullet_marker", "&#x2022;"))

        # --- Left column: heading + subheading + contact details ---
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

        # --- Right column: form panel ---
        panel_cls = "rounded-xl border border-slate-200 bg-slate-50 shadow-sm p-6"
        input_cls = "w-full px-4 py-2.5 text-sm outline-none rounded-lg border border-slate-200 bg-white focus:border-slate-400 transition"
        textarea_cls = input_cls
        field_gap = "gap-4"
        submit = (
            '<button type="submit" class="w-full py-2.5 px-6 text-sm font-medium text-white bg-slate-900 rounded-lg transition hover:bg-slate-800">'
            'Request Demo</button>'
        )

        muted = esc(self.style.get("muted_text", "text-slate-400"))
        form_html = (
            f'<div class="{esc(panel_cls)}">'
            f'<form onsubmit="return false;" class="flex flex-col {esc(field_gap)}">'
            f'<div>'
            f'<label class="block text-xs font-medium {muted} mb-1">Email</label>'
            f'<input type="email" placeholder="you@company.com" class="{esc(input_cls)}" />'
            f'</div>'
            f'<div>'
            f'<label class="block text-xs font-medium {muted} mb-1">Company</label>'
            f'<input type="text" placeholder="Your company" class="{esc(input_cls)}" />'
            f'</div>'
            f'<div>'
            f'<label class="block text-xs font-medium {muted} mb-1">Role / Title</label>'
            f'<input type="text" placeholder="e.g. Product Manager" class="{esc(input_cls)}" />'
            f'</div>'
            f'<div>'
            f'<label class="block text-xs font-medium {muted} mb-1">Message</label>'
            f'<textarea rows="4" placeholder="Tell us about your needs..." class="{esc(textarea_cls)}"></textarea>'
            f'</div>'
            f'<div>{submit}</div>'
            f'</form>'
            f'</div>'
        )

        # --- Assemble section ---
        sid = f' id="{esc(section_id)}"' if section_id else ""
        section_py = esc(self.style.get("section_py", "py-16"))
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
        section_py_sm = self.style.get("section_py_sm", "py-10")
        container = self.style.get("container", "mx-auto w-full max-w-7xl px-6 lg:px-8")

        site_name = esc(self.content.get("siteName", ""))
        tagline = esc(self.content.get("footerTagline", ""))
        year = esc(self.content.get("copyrightYear", "2026"))
        columns = self.content.get("footerColumns", [])

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
