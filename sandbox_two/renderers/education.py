from __future__ import annotations

from .base import BaseRenderer, esc


class EducationRenderer(BaseRenderer):
    """Structured, credible, academic design family for courses, academies, and tutoring."""

    FAMILY = "education"
    FONT = "Inter"
    BODY_BG = "linear-gradient(180deg, #f8fafc 0%, #ffffff 35%, #eef2ff 100%)"

    @classmethod
    def get_style(cls, primary_color: str = "#4f46e5", accent_color: str = "#6366f1") -> dict[str, str]:
        base = {
            "family": cls.FAMILY,
            "primary_color": primary_color,
            "accent_color": accent_color,
        }
        return {
            **base,
            # Card tokens
            "card_border": "border border-indigo-100/70",
            "card_bg": "bg-white",
            "card_radius": "rounded-xl",
            "card_shadow": "shadow-[0_12px_36px_rgba(79,70,229,0.06)]",
            "card_padding": "p-6",
            # Heading tokens
            "heading_size": "text-3xl lg:text-4xl",
            "heading_weight": "font-bold",
            "heading_tracking": "tracking-tight",
            "heading_color": "text-indigo-950",
            # Body text tokens
            "body_text": "text-slate-600",
            "body_size": "text-base",
            "body_leading": "leading-7",
            "muted_text": "text-slate-400",
            # Decorative tokens
            "eyebrow_style": "mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600",
            "badge_style": "inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-100",
            # Layout tokens
            "section_py": "py-20",
            "section_py_sm": "py-12",
            "container": "mx-auto w-full max-w-7xl px-6 lg:px-8",
            "container_narrow": "mx-auto w-full max-w-3xl px-6 lg:px-8",
            "gap": "gap-6",
            "gap_sm": "gap-4",
            # List markers
            "bullet_marker": "<span class='mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-400'></span>",
            "check_marker": "<span class='text-indigo-500 font-semibold'>&#10003;</span>",
            # Buttons
            "primary_btn": f"inline-flex items-center justify-center rounded-lg bg-[{primary_color}] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90",
            "secondary_btn": "inline-flex items-center justify-center rounded-lg border border-indigo-200 bg-white px-6 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50",
            # Block tokens
            "dark_block": "rounded-2xl bg-indigo-950 text-white",
            "section_border": "border-indigo-100",
        }

    # ------------------------------------------------------------------
    # Navbar — clean academic nav
    # ------------------------------------------------------------------

    def render_navbar(self) -> str:
        brand = esc(self.content.get("business_name", "Academy"))
        s = self.style
        primary = esc(s.get("primary_color", "#4f46e5"))

        return (
            '<nav class="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-indigo-100/60">'
            '  <div class="mx-auto w-full max-w-7xl px-6 lg:px-8 flex items-center justify-between py-4">'
            f'    <a href="#" class="text-lg font-bold text-indigo-950 tracking-tight">{brand}</a>'
            '    <div class="hidden md:flex items-center gap-8">'
            '      <a href="#courses" class="text-sm font-medium text-slate-600 hover:text-indigo-700 transition-colors duration-200">Courses</a>'
            '      <a href="#about" class="text-sm font-medium text-slate-600 hover:text-indigo-700 transition-colors duration-200">About</a>'
            '      <a href="#faculty" class="text-sm font-medium text-slate-600 hover:text-indigo-700 transition-colors duration-200">Faculty</a>'
            '    </div>'
            '    <div class="flex items-center gap-4">'
            '      <a href="#signin" class="text-sm font-medium text-slate-600 hover:text-indigo-700 transition-colors duration-200">Sign In</a>'
            f'      <a href="#enroll" class="inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90" style="background-color:{primary}">Enroll Now</a>'
            '    </div>'
            '  </div>'
            '</nav>'
        )

    # ------------------------------------------------------------------
    # Form panel — enrollment inquiry
    # ------------------------------------------------------------------

    def render_form_panel(self, section_id: str = "") -> str:
        s = self.style
        sid = f' id="{esc(section_id)}"' if section_id else ' id="enroll"'
        primary = esc(s.get("primary_color", "#4f46e5"))

        input_cls = (
            "w-full rounded-lg border border-indigo-200 bg-white px-4 py-2.5 "
            "text-sm text-slate-900 placeholder-slate-400 outline-none transition "
            "focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        )
        textarea_cls = input_cls
        label_cls = f"mb-1.5 block text-sm font-medium {esc(s.get('body_text', 'text-slate-600'))}"

        return (
            f'<section{sid} class="{esc(s.get("section_py", "py-20"))}">'
            f'  <div class="{esc(s.get("container_narrow", ""))}">'
            f'    <div class="{esc(s.get("card_bg", ""))} {esc(s.get("card_border", ""))} {esc(s.get("card_radius", ""))} {esc(s.get("card_shadow", ""))} p-8 sm:p-10">'
            f'      <h2 class="mb-2 text-center {esc(s.get("heading_size", ""))} {esc(s.get("heading_weight", ""))} {esc(s.get("heading_tracking", ""))} {esc(s.get("heading_color", ""))}">Enrollment Inquiry</h2>'
            f'      <p class="mb-8 text-center {esc(s.get("muted_text", ""))} text-sm">Complete the form below to begin your enrollment process.</p>'
            '      <form class="space-y-5">'
            f'        <div><label class="{label_cls}">Full Name</label><input type="text" placeholder="Your full name" class="{input_cls}" /></div>'
            f'        <div><label class="{label_cls}">Email</label><input type="email" placeholder="you@example.com" class="{input_cls}" /></div>'
            f'        <div><label class="{label_cls}">Phone</label><input type="tel" placeholder="(555) 123-4567" class="{input_cls}" /></div>'
            f'        <div><label class="{label_cls}">Course of Interest</label><input type="text" placeholder="Select a program..." class="{input_cls}" /></div>'
            f'        <div><label class="{label_cls}">Current Experience Level</label><input type="text" placeholder="Beginner / Intermediate / Advanced" class="{input_cls}" /></div>'
            f'        <div><label class="{label_cls}">Message</label><textarea rows="4" placeholder="Tell us about your goals and any questions you have..." class="{textarea_cls}"></textarea></div>'
            f'        <button type="submit" class="w-full rounded-lg py-3 px-6 text-sm font-semibold text-white transition hover:opacity-90" style="background-color:{primary}">Submit Enrollment Inquiry</button>'
            f'        <p class="text-center text-xs {esc(s.get("muted_text", ""))}">Our admissions team responds within 24-48 hours</p>'
            '      </form>'
            '    </div>'
            '  </div>'
            '</section>'
        )

    # ------------------------------------------------------------------
    # Footer — academic/institutional
    # ------------------------------------------------------------------

    def render_footer(self) -> str:
        s = self.style
        brand = esc(self.content.get("business_name", "Academy"))
        year = "2026"

        return (
            '<footer class="bg-indigo-950 text-white pt-16 pb-0">'
            f'  <div class="{esc(s.get("container", ""))}">'
            '    <div class="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">'
            # Column 1 — Brand + accreditation badges
            '      <div>'
            f'        <p class="mb-3 text-xl font-bold tracking-tight">{brand}</p>'
            '        <p class="mb-5 text-sm text-indigo-200/60 leading-relaxed">Empowering learners through rigorous, accessible education.</p>'
            '        <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-indigo-300/50">Accreditations</p>'
            '        <div class="flex gap-2">'
            '          <span class="h-8 w-14 rounded bg-indigo-900/60 border border-indigo-800/40"></span>'
            '          <span class="h-8 w-14 rounded bg-indigo-900/60 border border-indigo-800/40"></span>'
            '          <span class="h-8 w-14 rounded bg-indigo-900/60 border border-indigo-800/40"></span>'
            '        </div>'
            '      </div>'
            # Column 2 — Programs
            '      <div>'
            '        <h4 class="mb-4 text-sm font-semibold uppercase tracking-wider text-indigo-300/60">Programs</h4>'
            '        <ul class="space-y-2.5 text-sm">'
            '          <li><a href="#" class="text-indigo-200/70 transition hover:text-white">Undergraduate</a></li>'
            '          <li><a href="#" class="text-indigo-200/70 transition hover:text-white">Graduate</a></li>'
            '          <li><a href="#" class="text-indigo-200/70 transition hover:text-white">Professional Certificates</a></li>'
            '          <li><a href="#" class="text-indigo-200/70 transition hover:text-white">Online Courses</a></li>'
            '          <li><a href="#" class="text-indigo-200/70 transition hover:text-white">Summer Programs</a></li>'
            '        </ul>'
            '      </div>'
            # Column 3 — Resources
            '      <div>'
            '        <h4 class="mb-4 text-sm font-semibold uppercase tracking-wider text-indigo-300/60">Resources</h4>'
            '        <ul class="space-y-2.5 text-sm">'
            '          <li><a href="#" class="text-indigo-200/70 transition hover:text-white">Student Portal</a></li>'
            '          <li><a href="#" class="text-indigo-200/70 transition hover:text-white">Library</a></li>'
            '          <li><a href="#" class="text-indigo-200/70 transition hover:text-white">FAQ</a></li>'
            '          <li><a href="#" class="text-indigo-200/70 transition hover:text-white">Blog</a></li>'
            '        </ul>'
            '      </div>'
            # Column 4 — Contact
            '      <div>'
            '        <h4 class="mb-4 text-sm font-semibold uppercase tracking-wider text-indigo-300/60">Contact</h4>'
            '        <ul class="space-y-2.5 text-sm text-indigo-200/70">'
            '          <li>123 University Avenue<br/>Suite 400, Academic City</li>'
            '          <li>(555) 234-5678</li>'
            '          <li>admissions@academy.edu</li>'
            '        </ul>'
            '      </div>'
            '    </div>'
            # Bottom row — accreditation note + copyright
            '    <div class="mt-12 flex flex-col items-center justify-between gap-3 border-t border-indigo-800/40 py-6 sm:flex-row">'
            '      <p class="text-xs text-indigo-300/40">Accredited by the National Board of Education [placeholder]</p>'
            f'      <p class="text-xs text-indigo-300/40">&copy; {year} {brand}. All rights reserved.</p>'
            '    </div>'
            '  </div>'
            '</footer>'
        )
