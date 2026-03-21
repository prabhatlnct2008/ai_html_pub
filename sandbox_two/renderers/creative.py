from __future__ import annotations

from .base import BaseRenderer, esc


class CreativeRenderer(BaseRenderer):
    """Visual-forward, minimal, artistic design family for designers, photographers, and agencies."""

    FAMILY = "creative"
    FONT = "Inter"
    BODY_BG = "#ffffff"

    @classmethod
    def get_style(cls, primary_color: str = "#0a0a0a", accent_color: str = "#ff3366") -> dict[str, str]:
        base = {
            "family": cls.FAMILY,
            "primary_color": primary_color,
            "accent_color": accent_color,
        }
        return {
            **base,
            # Card tokens — intentionally bare, no border, no shadow
            "card_border": "",
            "card_bg": "bg-stone-50",
            "card_radius": "rounded-none",
            "card_shadow": "",
            "card_padding": "p-8",
            # Heading tokens — large, bold, minimal
            "heading_size": "text-4xl lg:text-5xl",
            "heading_weight": "font-semibold",
            "heading_tracking": "tracking-[-0.03em]",
            "heading_color": "text-stone-950",
            # Body text tokens
            "body_text": "text-stone-500",
            "body_size": "text-base",
            "body_leading": "leading-7",
            "muted_text": "text-stone-400",
            # Decorative tokens
            "eyebrow_style": "mb-4 text-xs font-medium uppercase tracking-[0.2em] text-stone-400",
            "badge_style": "inline-block text-xs font-medium uppercase tracking-[0.15em] text-stone-500",
            # Layout tokens — generous whitespace
            "section_py": "py-28",
            "section_py_sm": "py-16",
            "container": "mx-auto w-full max-w-7xl px-6 lg:px-8",
            "container_narrow": "mx-auto w-full max-w-2xl px-6 lg:px-8",
            "gap": "gap-8",
            "gap_sm": "gap-4",
            # List markers
            "bullet_marker": "<span class='text-stone-300'>&mdash;</span>",
            "check_marker": "<span class='text-stone-400'>&#10003;</span>",
            # Buttons — accent color only on primary CTA
            "primary_btn": f"inline-flex items-center justify-center bg-[{accent_color}] px-7 py-3 text-sm font-medium text-white transition hover:opacity-90",
            "secondary_btn": "inline-flex items-center justify-center border border-stone-200 bg-white px-7 py-3 text-sm font-medium text-stone-900 transition hover:bg-stone-50",
            # Block tokens
            "dark_block": "bg-stone-950 text-white",
            "section_border": "border-stone-100",
        }

    # ------------------------------------------------------------------
    # Navbar — ultra-minimal, logo + hamburger only
    # ------------------------------------------------------------------

    def render_navbar(self) -> str:
        brand = esc(self.content.get("business_name", "Studio"))

        return (
            '<nav class="sticky top-0 z-50 bg-white">'
            '  <div class="mx-auto w-full max-w-7xl px-6 lg:px-8 flex items-center justify-between py-6">'
            f'    <a href="#" class="text-lg font-semibold text-stone-950 tracking-[-0.02em]">{brand}</a>'
            '    <button type="button" class="flex flex-col items-end gap-[5px] p-1" aria-label="Menu">'
            '      <span class="block h-[2px] w-6 bg-stone-900"></span>'
            '      <span class="block h-[2px] w-5 bg-stone-900"></span>'
            '      <span class="block h-[2px] w-6 bg-stone-900"></span>'
            '    </button>'
            '  </div>'
            '</nav>'
        )

    # ------------------------------------------------------------------
    # Form panel — project inquiry, clean and sparse
    # ------------------------------------------------------------------

    def render_form_panel(self, section_id: str = "") -> str:
        s = self.style
        sid = f' id="{esc(section_id)}"' if section_id else ' id="inquiry"'

        input_cls = (
            "w-full border-0 border-b border-stone-200 bg-transparent px-0 py-3 "
            "text-sm text-stone-900 placeholder-stone-400 outline-none transition "
            "focus:border-stone-900"
        )
        textarea_cls = (
            "w-full border-0 border-b border-stone-200 bg-transparent px-0 py-3 "
            "text-sm text-stone-900 placeholder-stone-400 outline-none transition "
            "focus:border-stone-900 resize-none"
        )
        label_cls = "mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-stone-400"

        return (
            f'<section{sid} class="{esc(s.get("section_py", "py-28"))}">'
            f'  <div class="{esc(s.get("container_narrow", ""))}">'
            f'    <h2 class="mb-12 {esc(s.get("heading_size", ""))} {esc(s.get("heading_weight", ""))} {esc(s.get("heading_tracking", ""))} {esc(s.get("heading_color", ""))}">Start a project</h2>'
            '    <form class="space-y-8">'
            f'      <div><label class="{label_cls}">Name</label><input type="text" placeholder="Your name" class="{input_cls}" /></div>'
            f'      <div><label class="{label_cls}">Email</label><input type="email" placeholder="you@example.com" class="{input_cls}" /></div>'
            f'      <div><label class="{label_cls}">Project Type</label><input type="text" placeholder="Branding / Web Design / Photography / Other" class="{input_cls}" /></div>'
            f'      <div><label class="{label_cls}">Budget Range</label><input type="text" placeholder="$5k-$10k / $10k-$25k / $25k+" class="{input_cls}" /></div>'
            f'      <div><label class="{label_cls}">Tell us about your project</label><textarea rows="5" placeholder="Describe your vision, goals, and timeline..." class="{textarea_cls}"></textarea></div>'
            '      <div>'
            '        <button type="submit" class="bg-stone-950 px-8 py-3 text-sm font-medium text-white transition hover:bg-stone-800">Send Inquiry</button>'
            '      </div>'
            '    </form>'
            '  </div>'
            '</section>'
        )

    # ------------------------------------------------------------------
    # Footer — ultra-minimal, one line
    # ------------------------------------------------------------------

    def render_footer(self) -> str:
        s = self.style
        brand = esc(self.content.get("business_name", "Studio"))
        year = "2026"

        return (
            '<footer class="bg-stone-950">'
            f'  <div class="{esc(s.get("container", ""))}">'
            '    <div class="flex items-center justify-between py-8">'
            f'      <p class="text-sm text-white/40">&copy; {year} {brand}</p>'
            '      <div class="flex items-center gap-3">'
            '        <span class="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-[10px] text-white/50 transition hover:border-white/50 hover:text-white" aria-label="Instagram">IG</span>'
            '        <span class="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-[10px] text-white/50 transition hover:border-white/50 hover:text-white" aria-label="Dribbble">Dr</span>'
            '        <span class="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-[10px] text-white/50 transition hover:border-white/50 hover:text-white" aria-label="Behance">Be</span>'
            '      </div>'
            '    </div>'
            '  </div>'
            '</footer>'
        )
