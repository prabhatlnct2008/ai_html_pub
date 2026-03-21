from __future__ import annotations

from .base import BaseRenderer, esc


class SportsRenderer(BaseRenderer):
    """Bold, high-energy design family for gyms, sports clubs, and athletic brands."""

    FAMILY = "sports"
    FONT = "Inter"
    BODY_BG = "linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)"

    @classmethod
    def get_style(cls, primary_color: str = "#f97316", accent_color: str = "#f59e0b") -> dict[str, str]:
        base = {
            "family": cls.FAMILY,
            "primary_color": primary_color,
            "accent_color": accent_color,
        }
        return {
            **base,
            # Card tokens
            "card_border": "border border-slate-700/60",
            "card_bg": "bg-slate-800",
            "card_radius": "rounded-lg",
            "card_shadow": "shadow-[0_8px_30px_rgba(0,0,0,0.35)]",
            "card_padding": "p-6",
            # Heading tokens
            "heading_size": "text-3xl sm:text-4xl",
            "heading_weight": "font-extrabold",
            "heading_tracking": "tracking-tight",
            "heading_color": "text-white",
            # Body text tokens
            "body_text": "text-slate-300",
            "body_size": "text-base",
            "body_leading": "leading-relaxed",
            "muted_text": "text-slate-400",
            # Decorative tokens
            "eyebrow_style": "text-xs font-bold uppercase tracking-[0.18em] text-orange-400",
            "badge_style": "inline-block rounded bg-orange-500/20 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-orange-400",
            # Layout tokens
            "section_py": "py-16",
            "section_py_sm": "py-10",
            "container": "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
            "container_narrow": "mx-auto max-w-3xl px-4 sm:px-6",
            "gap": "gap-8",
            "gap_sm": "gap-4",
            # List markers
            "bullet_marker": "text-orange-400",
            "check_marker": "text-orange-400",
            # Buttons
            "primary_btn": "inline-flex items-center justify-center rounded-lg bg-orange-500 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)] transition hover:bg-orange-400",
            "secondary_btn": "inline-flex items-center justify-center rounded-lg border border-slate-600 bg-transparent px-6 py-3 text-sm font-bold uppercase tracking-wider text-slate-200 transition hover:border-slate-400 hover:text-white",
            # Block tokens
            "dark_block": "bg-slate-900 text-white",
            "section_border": "border-slate-700/50",
        }

    # ------------------------------------------------------------------
    # Navbar
    # ------------------------------------------------------------------

    def render_navbar(self) -> str:
        brand = esc(self.content.get("business_name", "ATHLETIC"))
        s = self.style
        return (
            '<header class="sticky top-0 z-50 border-b border-slate-700/60 bg-slate-900/95 backdrop-blur">'
            '  <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">'
            f'    <a href="#" class="text-lg font-extrabold uppercase tracking-[0.12em] text-white">{brand}</a>'
            '    <nav class="hidden items-center gap-6 md:flex">'
            '      <a href="#programs" class="text-sm font-semibold uppercase tracking-wider text-slate-300 transition hover:text-white">Programs</a>'
            '      <a href="#schedule" class="text-sm font-semibold uppercase tracking-wider text-slate-300 transition hover:text-white">Schedule</a>'
            '      <a href="#coaches" class="text-sm font-semibold uppercase tracking-wider text-slate-300 transition hover:text-white">Coaches</a>'
            '      <a href="#pricing" class="text-sm font-semibold uppercase tracking-wider text-slate-300 transition hover:text-white">Pricing</a>'
            f'      <a href="#membership" class="{esc(s.get("primary_btn", ""))}">Join Now</a>'
            '    </nav>'
            '  </div>'
            '</header>'
        )

    # ------------------------------------------------------------------
    # Form panel — Membership inquiry
    # ------------------------------------------------------------------

    def render_form_panel(self, section_id: str = "") -> str:
        s = self.style
        sid = f' id="{esc(section_id)}"' if section_id else ' id="membership"'
        brand = esc(self.content.get("business_name", "ATHLETIC"))

        input_cls = (
            "w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-3 "
            "text-sm text-white placeholder-slate-400 outline-none transition "
            "focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        )

        return (
            f'<section{sid} class="{esc(s.get("section_py", "py-16"))}">'
            f'  <div class="{esc(s.get("container_narrow", ""))}">'
            f'    <div class="{esc(s.get("card_bg", ""))} {esc(s.get("card_border", ""))} {esc(s.get("card_radius", ""))} {esc(s.get("card_shadow", ""))} {esc(s.get("card_padding", ""))} p-8 sm:p-10">'
            f'      <h2 class="mb-2 text-center {esc(s.get("heading_size", ""))} {esc(s.get("heading_weight", ""))} {esc(s.get("heading_tracking", ""))} {esc(s.get("heading_color", ""))}">Start Your Journey</h2>'
            f'      <p class="mb-8 text-center {esc(s.get("muted_text", ""))}">Fill out the form below and a coach will reach out within 24 hours.</p>'
            '      <form class="space-y-5">'
            f'        <div><label class="mb-1 block text-sm font-semibold text-slate-300">Name</label><input type="text" placeholder="Your full name" class="{input_cls}" /></div>'
            f'        <div><label class="mb-1 block text-sm font-semibold text-slate-300">Email</label><input type="email" placeholder="you@example.com" class="{input_cls}" /></div>'
            f'        <div><label class="mb-1 block text-sm font-semibold text-slate-300">Phone</label><input type="tel" placeholder="(555) 000-0000" class="{input_cls}" /></div>'
            f'        <div><label class="mb-1 block text-sm font-semibold text-slate-300">What\'s Your Fitness Goal?</label>'
            f'          <input type="text" placeholder="e.g. Lose weight, Build muscle, Train for a marathon" class="{input_cls}" />'
            '        </div>'
            f'        <button type="submit" class="w-full {esc(s.get("primary_btn", ""))} py-3.5 text-base">Get Started Free</button>'
            f'        <p class="text-center text-xs {esc(s.get("muted_text", ""))}">Start your free trial today &mdash; no credit card required.</p>'
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
        brand = esc(self.content.get("business_name", "ATHLETIC"))
        year = "2026"

        return (
            '<footer class="relative overflow-hidden border-t border-slate-700/50 bg-slate-900 pt-16 pb-0 text-slate-300">'
            f'  <div class="{esc(s.get("container", ""))}">'
            '    <div class="grid gap-10 md:grid-cols-2">'
            # Left column — brand + social
            '      <div>'
            f'        <p class="mb-4 text-xl font-extrabold uppercase tracking-[0.1em] text-white">{brand}</p>'
            f'        <p class="mb-6 max-w-xs text-sm {esc(s.get("muted_text", ""))}">Push limits. Break records. Become unstoppable.</p>'
            '        <p class="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Follow us</p>'
            '        <div class="flex gap-3">'
            '          <span class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-orange-400 transition hover:bg-orange-500 hover:text-white" aria-label="Instagram">IG</span>'
            '          <span class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-orange-400 transition hover:bg-orange-500 hover:text-white" aria-label="YouTube">YT</span>'
            '          <span class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-orange-400 transition hover:bg-orange-500 hover:text-white" aria-label="TikTok">TT</span>'
            '        </div>'
            '      </div>'
            # Right column — quick links in 2 sub-columns
            '      <div class="grid grid-cols-2 gap-6">'
            '        <div>'
            '          <p class="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Programs</p>'
            '          <ul class="space-y-2 text-sm">'
            '            <li><a href="#" class="transition hover:text-white">Strength</a></li>'
            '            <li><a href="#" class="transition hover:text-white">HIIT</a></li>'
            '            <li><a href="#" class="transition hover:text-white">Yoga</a></li>'
            '            <li><a href="#" class="transition hover:text-white">Boxing</a></li>'
            '          </ul>'
            '        </div>'
            '        <div>'
            '          <p class="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Company</p>'
            '          <ul class="space-y-2 text-sm">'
            '            <li><a href="#" class="transition hover:text-white">About</a></li>'
            '            <li><a href="#" class="transition hover:text-white">Coaches</a></li>'
            '            <li><a href="#" class="transition hover:text-white">Pricing</a></li>'
            '            <li><a href="#" class="transition hover:text-white">Contact</a></li>'
            '          </ul>'
            '        </div>'
            '      </div>'
            '    </div>'
            '  </div>'
            # Bottom copyright bar with diagonal accent stripe
            '  <div class="relative mt-12">'
            '    <div class="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600" style="clip-path: polygon(0 0, 100% 40%, 100% 100%, 0% 100%);"></div>'
            '    <div class="relative z-10 bg-slate-950/90 px-6 py-5">'
            f'      <p class="text-center text-xs text-slate-400">&copy; {year} {brand}. All rights reserved.</p>'
            '    </div>'
            '  </div>'
            '</footer>'
        )
