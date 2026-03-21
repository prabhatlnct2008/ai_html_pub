from __future__ import annotations

from .base import BaseRenderer, esc


class CafeRenderer(BaseRenderer):
    """Warm, earthy design family for restaurants, cafes, and bakeries."""

    FAMILY = "cafe"
    FONT = "Inter"
    BODY_BG = "linear-gradient(180deg, #fdf8f0 0%, #ffffff 40%, #fdf4e8 100%)"

    @classmethod
    def get_style(cls, primary_color: str = "#d97706", accent_color: str = "#92400e") -> dict[str, str]:
        base = {
            "family": cls.FAMILY,
            "primary_color": primary_color,
            "accent_color": accent_color,
        }
        return {
            **base,
            # Card tokens
            "card_border": "border border-amber-200/80",
            "card_bg": "bg-[#fffbf5]",
            "card_radius": "rounded-2xl",
            "card_shadow": "shadow-[0_4px_24px_rgba(180,130,60,0.08)]",
            "card_padding": "p-6",
            # Heading tokens
            "heading_size": "text-3xl sm:text-4xl",
            "heading_weight": "font-bold",
            "heading_tracking": "tracking-tight",
            "heading_color": "text-amber-900",
            # Body text tokens
            "body_text": "text-amber-800/70",
            "body_size": "text-base",
            "body_leading": "leading-relaxed",
            "muted_text": "text-amber-700/50",
            # Decorative tokens
            "eyebrow_style": "text-xs font-semibold uppercase tracking-[0.15em] text-amber-600",
            "badge_style": "inline-block rounded-full bg-amber-100 px-3 py-0.5 text-xs font-semibold text-amber-700",
            # Layout tokens
            "section_py": "py-16",
            "section_py_sm": "py-10",
            "container": "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
            "container_narrow": "mx-auto max-w-3xl px-4 sm:px-6",
            "gap": "gap-8",
            "gap_sm": "gap-4",
            # List markers
            "bullet_marker": "<span class='mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-500'></span>",
            "check_marker": "<span class='text-amber-600'>&#10003;</span>",
            # Buttons
            "primary_btn": "inline-flex items-center justify-center rounded-xl bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-500",
            "secondary_btn": "inline-flex items-center justify-center rounded-xl border border-amber-300 bg-transparent px-6 py-3 text-sm font-semibold text-amber-800 transition hover:border-amber-400 hover:bg-amber-50",
            # Block tokens
            "dark_block": "bg-amber-950 text-amber-50",
            "section_border": "border-amber-200/60",
        }

    # ------------------------------------------------------------------
    # Navbar
    # ------------------------------------------------------------------

    def render_navbar(self) -> str:
        brand = esc(self.content.get("business_name", "Cafe"))
        s = self.style
        return (
            '<header class="sticky top-0 z-50 border-b border-amber-200/60 bg-[#fdf8f0]/95 backdrop-blur">'
            '  <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">'
            '    <nav class="hidden items-center gap-5 md:flex">'
            '      <a href="#menu" class="text-sm font-medium text-amber-800/70 transition hover:text-amber-900">Menu</a>'
            '      <a href="#about" class="text-sm font-medium text-amber-800/70 transition hover:text-amber-900">About</a>'
            '    </nav>'
            f'    <a href="#" class="text-xl font-bold tracking-tight text-amber-900">{brand}</a>'
            '    <div class="hidden items-center gap-3 md:flex">'
            f'      <a href="#order" class="{esc(s.get("secondary_btn", ""))}">Order Online</a>'
            f'      <a href="#reservation" class="{esc(s.get("primary_btn", ""))}">Reserve a Table</a>'
            '    </div>'
            '  </div>'
            '</header>'
        )

    # ------------------------------------------------------------------
    # Form panel — Reservation
    # ------------------------------------------------------------------

    def render_form_panel(self, section_id: str = "") -> str:
        s = self.style
        sid = f' id="{esc(section_id)}"' if section_id else ' id="reservation"'

        input_cls = (
            "w-full rounded-xl border border-amber-200 bg-white px-4 py-3 "
            "text-sm text-amber-900 placeholder-amber-400 outline-none transition "
            "focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
        )

        return (
            f'<section{sid} class="{esc(s.get("section_py", "py-16"))}">'
            f'  <div class="{esc(s.get("container_narrow", ""))}">'
            f'    <div class="{esc(s.get("card_bg", ""))} {esc(s.get("card_border", ""))} {esc(s.get("card_radius", ""))} {esc(s.get("card_shadow", ""))} p-8 sm:p-10">'
            f'      <h2 class="mb-2 text-center {esc(s.get("heading_size", ""))} {esc(s.get("heading_weight", ""))} {esc(s.get("heading_tracking", ""))} {esc(s.get("heading_color", ""))}">Reserve Your Table</h2>'
            f'      <p class="mb-8 text-center {esc(s.get("muted_text", ""))}">Join us for a memorable dining experience.</p>'
            '      <form class="space-y-5">'
            f'        <div><label class="mb-1 block text-sm font-semibold text-amber-800">Name</label><input type="text" placeholder="Your full name" class="{input_cls}" /></div>'
            f'        <div><label class="mb-1 block text-sm font-semibold text-amber-800">Email</label><input type="email" placeholder="you@example.com" class="{input_cls}" /></div>'
            '        <div class="grid grid-cols-2 gap-4">'
            f'          <div><label class="mb-1 block text-sm font-semibold text-amber-800">Date</label><input type="date" class="{input_cls}" /></div>'
            f'          <div><label class="mb-1 block text-sm font-semibold text-amber-800">Time</label><input type="time" class="{input_cls}" /></div>'
            '        </div>'
            f'        <div><label class="mb-1 block text-sm font-semibold text-amber-800">Party Size</label><input type="number" placeholder="2" min="1" max="20" class="{input_cls}" /></div>'
            f'        <div><label class="mb-1 block text-sm font-semibold text-amber-800">Special Requests</label><textarea rows="3" placeholder="Allergies, celebrations, seating preferences..." class="{input_cls}"></textarea></div>'
            f'        <button type="submit" class="w-full {esc(s.get("primary_btn", ""))} py-3.5 text-base">Reserve My Table</button>'
            f'        <p class="text-center text-xs {esc(s.get("muted_text", ""))}">We&#x27;ll confirm your reservation within 1 hour.</p>'
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
        brand = esc(self.content.get("business_name", "Cafe"))
        address = esc(self.content.get("address", "123 Main Street, Anytown"))
        year = "2026"

        return (
            '<footer class="border-t border-amber-200/40 bg-amber-950 pt-16 pb-10 text-amber-200/80">'
            f'  <div class="{esc(s.get("container", ""))}">'
            '    <div class="grid gap-10 md:grid-cols-3">'
            # Column 1 — Brand + address
            '      <div>'
            f'        <p class="mb-3 text-xl font-bold tracking-tight text-amber-50">{brand}</p>'
            '        <p class="mb-1 text-xs font-semibold uppercase tracking-wider text-amber-400/70">Visit Us</p>'
            f'        <p class="text-sm leading-relaxed text-amber-200/60">{address}</p>'
            '      </div>'
            # Column 2 — Hours
            '      <div>'
            '        <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-amber-400/70">Hours</p>'
            '        <ul class="space-y-1.5 text-sm">'
            '          <li class="flex justify-between"><span>Mon &ndash; Fri</span><span class="text-amber-100">7 AM &ndash; 9 PM</span></li>'
            '          <li class="flex justify-between"><span>Saturday</span><span class="text-amber-100">8 AM &ndash; 10 PM</span></li>'
            '          <li class="flex justify-between"><span>Sunday</span><span class="text-amber-100">8 AM &ndash; 8 PM</span></li>'
            '        </ul>'
            '      </div>'
            # Column 3 — Menu links + social
            '      <div>'
            '        <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-amber-400/70">Menu</p>'
            '        <ul class="mb-6 space-y-1.5 text-sm">'
            '          <li><a href="#" class="transition hover:text-amber-50">Breakfast</a></li>'
            '          <li><a href="#" class="transition hover:text-amber-50">Lunch</a></li>'
            '          <li><a href="#" class="transition hover:text-amber-50">Dinner</a></li>'
            '          <li><a href="#" class="transition hover:text-amber-50">Drinks</a></li>'
            '        </ul>'
            '        <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-400/70">Follow Us</p>'
            '        <div class="flex gap-3">'
            '          <a href="#" class="text-sm text-amber-300 transition hover:text-amber-50">Instagram</a>'
            '          <a href="#" class="text-sm text-amber-300 transition hover:text-amber-50">Facebook</a>'
            '          <a href="#" class="text-sm text-amber-300 transition hover:text-amber-50">Yelp</a>'
            '        </div>'
            '      </div>'
            '    </div>'
            # Bottom copyright
            '    <div class="mt-12 border-t border-amber-800/40 pt-6">'
            f'      <p class="text-center text-xs text-amber-400/50">&copy; {year} {brand}. All rights reserved.</p>'
            '    </div>'
            '  </div>'
            '</footer>'
        )
