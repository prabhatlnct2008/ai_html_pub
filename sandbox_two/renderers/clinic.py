from __future__ import annotations
from .base import BaseRenderer, esc


class ClinicRenderer(BaseRenderer):
    FAMILY = "clinic"
    FONT = "Inter"
    BODY_BG = "linear-gradient(180deg, #f0fafb 0%, #ffffff 42%, #f8fafc 100%)"

    @classmethod
    def get_style(cls, primary_color="#0d9488", accent_color="#f97316") -> dict[str, str]:
        base = {"family": cls.FAMILY, "primary_color": primary_color, "accent_color": accent_color}
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

    def render_navbar(self) -> str:
        site_name = esc(self.content.get("siteName", ""))
        nav_links = self.content.get("navLinks", [])[:5]
        nav_cta = esc(self.content.get("navCta", "Get Started"))
        primary_color = esc(self.style.get("primary_color", "#0d9488"))

        def link_href(text):
            return "#" + text.lower().strip().replace(" ", "-")

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
            f'style="background-color:{primary_color}">{nav_cta}</a>'
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
                f'<span class="{esc(self.style.get("body_text", "text-slate-600"))} {esc(self.style.get("body_size", "text-base"))}">{esc(d)}</span>'
                f'</li>'
                for d in details
            )
            details_html = f'<ul class="mt-8 space-y-4">{items}</ul>'

        left_col = (
            f'<div class="flex flex-col justify-center">'
            f'<h2 class="{esc(self.style.get("heading_size", "text-4xl"))} {esc(self.style.get("heading_weight", "font-semibold"))} '
            f'{esc(self.style.get("heading_tracking", "tracking-tight"))} {esc(self.style.get("heading_color", "text-slate-950"))}">'
            f'{heading}</h2>'
        )
        if subheading:
            left_col += (
                f'<p class="mt-4 {esc(self.style.get("body_text", "text-slate-600"))} '
                f'{esc(self.style.get("body_size", "text-base"))} {esc(self.style.get("body_leading", "leading-7"))}">'
                f'{subheading}</p>'
            )
        left_col += details_html + '</div>'

        # --- Right column: clinic form (teal-accented inputs) ---
        panel_cls = "rounded-xl border border-slate-200 bg-white shadow-sm p-6"
        input_cls = "w-full px-4 py-2.5 text-sm outline-none rounded-lg border border-slate-200 focus:border-teal-400 transition"
        textarea_cls = input_cls
        field_gap = "gap-4"
        submit = (
            '<button type="submit" class="w-full py-2.5 px-6 text-sm font-medium text-white bg-teal-600 rounded-lg transition hover:bg-teal-700">'
            'Send Message</button>'
        )

        muted = esc(self.style.get("muted_text", "text-slate-500"))

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
            f'<label class="block text-xs font-medium {muted} mb-1">Insurance Provider</label>'
            f'<input type="text" placeholder="e.g. Blue Cross, Aetna" class="{esc(input_cls)}" />'
            f'</div>'
            f'<div>'
            f'<label class="block text-xs font-medium {muted} mb-1">Describe Your Concern</label>'
            f'<textarea rows="4" placeholder="Tell us about your symptoms or concerns..." class="{esc(textarea_cls)}"></textarea>'
            f'</div>'
            f'<div>{submit}</div>'
            f'<p class="text-xs text-slate-400 mt-1 flex items-center gap-1.5">'
            f'<svg class="h-3.5 w-3.5 text-teal-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
            f'<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />'
            f'</svg>'
            f'Your information is protected by HIPAA</p>'
            f'</form>'
            f'</div>'
        )

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
        site_name = esc(self.content.get("siteName", ""))
        year = "2025"

        return (
            f'<footer class="bg-slate-900 text-white">'
            # Top row: 3 columns
            f'<div class="mx-auto w-full max-w-7xl px-6 lg:px-8 py-14">'
            f'<div class="grid grid-cols-1 md:grid-cols-3 gap-10">'
            # Column 1: Clinic info + hours
            f'<div>'
            f'<h3 class="text-base font-semibold text-white">{site_name}</h3>'
            f'<p class="mt-3 text-sm text-slate-400 leading-relaxed">Providing compassionate, patient-centered care for you and your family.</p>'
            f'<div class="mt-5">'
            f'<p class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Office Hours</p>'
            f'<p class="text-sm text-slate-300">Mon &ndash; Fri: 8:00 AM &ndash; 6:00 PM</p>'
            f'<p class="text-sm text-slate-300">Sat: 9:00 AM &ndash; 1:00 PM</p>'
            f'<p class="text-sm text-slate-400">Sun: Closed</p>'
            f'</div>'
            f'</div>'
            # Column 2: Quick links
            f'<div>'
            f'<h3 class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">Quick Links</h3>'
            f'<ul class="space-y-2.5">'
            f'<li><a href="#services" class="text-sm text-slate-300 hover:text-white transition-colors duration-200">Services</a></li>'
            f'<li><a href="#about" class="text-sm text-slate-300 hover:text-white transition-colors duration-200">About Us</a></li>'
            f'<li><a href="#contact" class="text-sm text-slate-300 hover:text-white transition-colors duration-200">Contact</a></li>'
            f'<li><a href="#faq" class="text-sm text-slate-300 hover:text-white transition-colors duration-200">FAQ</a></li>'
            f'<li><a href="#privacy" class="text-sm text-slate-300 hover:text-white transition-colors duration-200">Privacy Policy</a></li>'
            f'</ul>'
            f'</div>'
            # Column 3: Credentials / Certifications
            f'<div>'
            f'<h3 class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">Credentials &amp; Certifications</h3>'
            f'<ul class="space-y-2.5">'
            f'<li class="flex items-center gap-2 text-sm text-slate-300">'
            f'<span class="text-teal-400">&#10003;</span> Board Certified Physicians</li>'
            f'<li class="flex items-center gap-2 text-sm text-slate-300">'
            f'<span class="text-teal-400">&#10003;</span> HIPAA Compliant</li>'
            f'<li class="flex items-center gap-2 text-sm text-slate-300">'
            f'<span class="text-teal-400">&#10003;</span> Joint Commission Accredited</li>'
            f'<li class="flex items-center gap-2 text-sm text-slate-300">'
            f'<span class="text-teal-400">&#10003;</span> AMA Member Practice</li>'
            f'</ul>'
            f'</div>'
            f'</div>'
            f'</div>'
            # Bottom row: emergency banner + copyright
            f'<div class="border-t border-slate-800">'
            f'<div class="mx-auto w-full max-w-7xl px-6 lg:px-8 py-5">'
            f'<div class="flex flex-col sm:flex-row items-center justify-between gap-4">'
            f'<p class="text-sm font-medium text-red-400 flex items-center gap-2">'
            f'<svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
            f'<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />'
            f'</svg>'
            f'If this is an emergency, call 911</p>'
            f'<p class="text-xs text-slate-500">&copy; {year} {site_name}. All rights reserved.</p>'
            f'</div>'
            f'</div>'
            f'</div>'
            f'</footer>'
        )
