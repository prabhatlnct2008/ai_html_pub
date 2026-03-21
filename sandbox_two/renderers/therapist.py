from __future__ import annotations

from .base import BaseRenderer, esc


class TherapistRenderer(BaseRenderer):
    """Calm, serene design family for therapists, counselors, and wellness professionals."""

    FAMILY = "therapist"
    FONT = "Inter"
    BODY_BG = "linear-gradient(180deg, #f0f7f4 0%, #ffffff 45%, #f5f0ff 100%)"

    @classmethod
    def get_style(cls, primary_color: str = "#5b8a72", accent_color: str = "#8b7cc8") -> dict[str, str]:
        base = {
            "family": cls.FAMILY,
            "primary_color": primary_color,
            "accent_color": accent_color,
        }
        return {
            **base,
            # Card tokens
            "card_border": "border border-sage-200/40",
            "card_bg": "bg-white/80",
            "card_radius": "rounded-2xl",
            "card_shadow": "shadow-[0_4px_30px_rgba(91,138,114,0.07)]",
            "card_padding": "p-8",
            # Heading tokens
            "heading_size": "text-3xl sm:text-4xl",
            "heading_weight": "font-medium",
            "heading_tracking": "tracking-tight",
            "heading_color": "text-slate-800",
            # Body text tokens
            "body_text": "text-slate-600",
            "body_size": "text-lg",
            "body_leading": "leading-loose",
            "muted_text": "text-slate-400",
            # Decorative tokens
            "eyebrow_style": "text-xs font-medium uppercase tracking-[0.18em] text-[#5b8a72]",
            "badge_style": "inline-block rounded-full bg-[#5b8a72]/10 px-3 py-0.5 text-xs font-medium text-[#5b8a72]",
            # Layout tokens
            "section_py": "py-24",
            "section_py_sm": "py-14",
            "container": "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
            "container_narrow": "mx-auto max-w-2xl px-4 sm:px-6",
            "gap": "gap-10",
            "gap_sm": "gap-5",
            # List markers
            "bullet_marker": "<span class='mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#5b8a72]'></span>",
            "check_marker": "<span class='text-[#5b8a72]'>&#10003;</span>",
            # Buttons
            "primary_btn": "inline-flex items-center justify-center rounded-full bg-[#5b8a72] px-7 py-3 text-sm font-medium text-white shadow-[0_2px_12px_rgba(91,138,114,0.25)] transition hover:bg-[#4a7a62]",
            "secondary_btn": "inline-flex items-center justify-center rounded-full border border-[#5b8a72]/30 bg-transparent px-7 py-3 text-sm font-medium text-[#5b8a72] transition hover:bg-[#5b8a72]/5",
            # Block tokens
            "dark_block": "bg-slate-800 text-white",
            "section_border": "border-slate-200/60",
        }

    # ------------------------------------------------------------------
    # Navbar
    # ------------------------------------------------------------------

    def render_navbar(self) -> str:
        brand = esc(self.content.get("business_name", "Serenity"))
        s = self.style
        return (
            '<header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md">'
            '  <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">'
            f'    <a href="#" class="text-lg font-medium tracking-tight text-slate-700">{brand}</a>'
            '    <nav class="hidden items-center gap-8 md:flex">'
            '      <a href="#about" class="text-sm text-slate-500 transition hover:text-slate-700">About</a>'
            '      <a href="#services" class="text-sm text-slate-500 transition hover:text-slate-700">Services</a>'
            '      <a href="#approach" class="text-sm text-slate-500 transition hover:text-slate-700">Approach</a>'
            f'      <a href="#intake" class="{esc(s.get("primary_btn", ""))}">Book a Session</a>'
            '    </nav>'
            '  </div>'
            '</header>'
        )

    # ------------------------------------------------------------------
    # Form panel — Intake form
    # ------------------------------------------------------------------

    def render_form_panel(self, section_id: str = "") -> str:
        s = self.style
        sid = f' id="{esc(section_id)}"' if section_id else ' id="intake"'

        input_cls = (
            "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 "
            "text-sm text-slate-700 placeholder-slate-400 outline-none transition "
            "focus:border-[#5b8a72] focus:ring-1 focus:ring-[#5b8a72]/30"
        )

        return (
            f'<section{sid} class="{esc(s.get("section_py", "py-24"))}">'
            f'  <div class="{esc(s.get("container_narrow", ""))}">'
            f'    <div class="{esc(s.get("card_bg", ""))} {esc(s.get("card_border", ""))} {esc(s.get("card_radius", ""))} {esc(s.get("card_shadow", ""))} p-8 sm:p-12">'
            f'      <h2 class="mb-2 text-center {esc(s.get("heading_size", ""))} {esc(s.get("heading_weight", ""))} {esc(s.get("heading_tracking", ""))} {esc(s.get("heading_color", ""))}">Begin Your Journey</h2>'
            f'      <p class="mb-10 text-center text-base {esc(s.get("muted_text", ""))}">Taking the first step is the hardest part. We&#x27;re here to help.</p>'
            '      <form class="space-y-6">'
            f'        <div><label class="mb-1.5 block text-sm font-medium text-slate-600">Name</label><input type="text" placeholder="Your full name" class="{input_cls}" /></div>'
            f'        <div><label class="mb-1.5 block text-sm font-medium text-slate-600">Email</label><input type="email" placeholder="you@example.com" class="{input_cls}" /></div>'
            f'        <div><label class="mb-1.5 block text-sm font-medium text-slate-600">Phone</label><input type="tel" placeholder="(555) 000-0000" class="{input_cls}" /></div>'
            f'        <div><label class="mb-1.5 block text-sm font-medium text-slate-600">What brings you here?</label>'
            f'          <textarea rows="4" placeholder="Share what&#x27;s on your mind &mdash; this is a safe space" class="{input_cls}"></textarea>'
            '        </div>'
            f'        <div><label class="mb-1.5 block text-sm font-medium text-slate-600">Preferred Schedule</label>'
            f'          <input type="text" placeholder="Morning / Afternoon / Evening" class="{input_cls}" />'
            '        </div>'
            f'        <button type="submit" class="w-full {esc(s.get("primary_btn", ""))} py-3.5 text-base">Request a Consultation</button>'
            f'        <p class="text-center text-xs {esc(s.get("muted_text", ""))}">All information is strictly confidential.</p>'
            '      </form>'
            '    </div>'
            '  </div>'
            '</section>'
        )

    # ------------------------------------------------------------------
    # Footer
    # ------------------------------------------------------------------

    def render_footer(self) -> str:
        s = self.style
        brand = esc(self.content.get("business_name", "Serenity"))
        tagline = esc(self.content.get("tagline", "A safe space for growth and healing"))
        phone = esc(self.content.get("phone", "(555) 123-4567"))
        year = "2026"

        return (
            '<footer class="bg-gradient-to-b from-[#f0f7f4] to-slate-100 pt-20 pb-10 text-slate-500">'
            '  <div class="mx-auto max-w-2xl px-4 text-center sm:px-6">'
            f'    <p class="mb-2 text-lg font-medium text-slate-700">{brand}</p>'
            f'    <p class="mb-8 text-sm text-slate-400">{tagline}</p>'
            '    <div class="mx-auto mb-8 h-px w-16 bg-slate-300/60"></div>'
            '    <p class="mb-4 text-xs tracking-wide text-slate-400">Licensed Clinical Psychologist &bull; LMFT &bull; APA Member</p>'
            '    <p class="mb-1 text-sm text-slate-500">Monday &ndash; Friday &middot; 9 AM &ndash; 6 PM</p>'
            f'    <p class="mb-8 text-sm text-[#5b8a72]">{phone}</p>'
            '    <div class="mx-auto mb-8 h-px w-16 bg-slate-300/60"></div>'
            '    <p class="mb-6 rounded-xl bg-[#5b8a72]/5 px-4 py-3 text-xs leading-relaxed text-[#5b8a72]">'
            '      If you are in crisis, please call the <strong>988 Suicide &amp; Crisis Lifeline</strong> by dialing <strong>988</strong>.'
            '    </p>'
            f'    <p class="text-xs text-slate-400">&copy; {year} {brand}. All rights reserved.</p>'
            '  </div>'
            '</footer>'
        )
