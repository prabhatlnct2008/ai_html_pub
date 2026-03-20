#!/usr/bin/env python3.11

from __future__ import annotations

import argparse
import json
import re
import textwrap
from pathlib import Path
from typing import Any

import generate_html as core


GUIDE_SYSTEM = """You are a senior frontend design-system engineer and Tailwind implementation guide writer.

Your task:
- For one section type and one variant, produce 2 or 3 strong Tailwind implementation examples.
- Focus on how to make the section look intentional, polished, and commercially effective.
- Use Tailwind utility classes directly in the code examples.
- The examples should be realistic section-level markup, not toy snippets.

Rules:
- Return JSON only.
- Each example must be visually distinct.
- Explain why the Tailwind choices are effective.
- Keep examples framework-agnostic HTML snippets with Tailwind classes.
- Favor clear hierarchy, spacing, contrast, responsiveness, and good CTA emphasis.
- Avoid generic filler explanations.

Return JSON with:
{
  "sectionType": "...",
  "variant": "...",
  "examples": [
    {
      "title": "...",
      "whenToUse": "...",
      "whyItWorks": "...",
      "tailwindNotes": ["...", "..."],
      "htmlSnippet": "<section ...>...</section>"
    }
  ]
}
"""


def parse_registry(markdown_text: str) -> list[dict[str, Any]]:
    sections: list[dict[str, Any]] = []
    current: dict[str, Any] | None = None
    lines = markdown_text.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if line.startswith("### `") and line.endswith("`"):
            if current:
                sections.append(current)
            current = {"sectionType": line.split("`")[1], "variants": [], "requiredFields": []}
        elif current and line == "Variants:":
            i += 1
            while i < len(lines) and lines[i].strip().startswith("- "):
                current["variants"].append(lines[i].strip()[2:].strip("`"))
                i += 1
            i -= 1
        elif current and line == "Required fields:":
            i += 1
            while i < len(lines) and lines[i].strip().startswith("- "):
                current["requiredFields"].append(lines[i].strip()[2:].strip("`"))
                i += 1
            i -= 1
        i += 1
    if current:
        sections.append(current)
    return [section for section in sections if section.get("variants")]


def build_user_prompt(section_type: str, variant: str, required_fields: list[str]) -> str:
    return f"""Create a Tailwind implementation guide entry for this section variant.

Section Type: {section_type}
Variant: {variant}
Required Fields: {", ".join(required_fields) or "Use the variant in a realistic way"}

Requirements:
- Give 2 or 3 implementation examples.
- Show how the section can look great using Tailwind classes.
- The examples should be suitable for a real landing page or marketing site.
- Make spacing, typography, CTA treatment, surface styling, and responsive behavior intentional.
- If the section has repeated content blocks, show a good card/grid/list treatment.
- If it is a navigation, hero, CTA, FAQ, or footer variant, make sure the layout reflects that purpose strongly.
"""


def validate_guide_response(raw: Any, section_type: str, variant: str) -> dict[str, Any]:
    if not isinstance(raw, dict):
        raise ValueError("Guide response must be a JSON object.")
    examples = []
    for item in core.normalize_list(raw.get("examples")):
        if not isinstance(item, dict):
            continue
        snippet = str(item.get("htmlSnippet") or "").strip()
        if not snippet:
            raise ValueError(f"Missing htmlSnippet for {section_type}/{variant}.")
        examples.append(
            {
                "title": str(item.get("title") or f"{section_type} / {variant} example").strip(),
                "whenToUse": str(item.get("whenToUse") or "Use when this variant fits the page hierarchy and offer.").strip(),
                "whyItWorks": str(item.get("whyItWorks") or "Creates stronger hierarchy and more intentional Tailwind-driven layout.").strip(),
                "tailwindNotes": [str(v).strip() for v in core.normalize_list(item.get("tailwindNotes")) if str(v).strip()],
                "htmlSnippet": snippet,
            }
        )
    if len(examples) < 2:
        raise ValueError(f"Need at least 2 examples for {section_type}/{variant}.")
    return {
        "sectionType": str(raw.get("sectionType") or section_type).strip(),
        "variant": str(raw.get("variant") or variant).strip(),
        "examples": examples[:3],
    }


def render_markdown_entry(entry: dict[str, Any]) -> str:
    lines = [f"## `{entry['sectionType']}` / `{entry['variant']}`", ""]
    for idx, example in enumerate(entry["examples"], start=1):
        lines.extend(
            [
                f"### Example {idx}: {example['title']}",
                "",
                f"**When To Use**: {example['whenToUse']}",
                "",
                f"**Why It Works**: {example['whyItWorks']}",
                "",
                "**Tailwind Notes**:",
            ]
        )
        for note in example["tailwindNotes"]:
            lines.append(f"- {note}")
        lines.extend(
            [
                "",
                "```html",
                example["htmlSnippet"],
                "```",
                "",
            ]
        )
    return "\n".join(lines).rstrip() + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate a Tailwind variant guide from the section registry.")
    parser.add_argument(
        "--registry",
        default="sandbox/unit_cli_html_generator/section_variant_registry.md",
        help="Path to the markdown section registry.",
    )
    parser.add_argument(
        "--output",
        default="sandbox/unit_cli_html_generator/tailwind_variant_guide.md",
        help="Output markdown file.",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=0,
        help="Optional limit on number of section variants to process (0 = all).",
    )
    args = parser.parse_args()

    api_key = core.load_env_var("OPENAI_API_KEY")
    if not api_key:
        print("OPENAI_API_KEY not found in environment, .env.local, or .env")
        return 1

    registry_path = Path(args.registry)
    output_path = Path(args.output)
    sections = parse_registry(registry_path.read_text(encoding="utf-8"))
    variant_jobs: list[tuple[str, str, list[str]]] = []
    for section in sections:
        for variant in section["variants"]:
            variant_jobs.append((section["sectionType"], variant, section["requiredFields"]))
    if args.limit > 0:
        variant_jobs = variant_jobs[: args.limit]

    output_path.parent.mkdir(parents=True, exist_ok=True)
    prompt_log: list[dict[str, Any]] = []
    markdown_parts = [
        "# Tailwind Variant Guide",
        "",
        "Generated with `gpt-4o-mini` from the section registry.",
        "",
    ]

    for index, (section_type, variant, required_fields) in enumerate(variant_jobs, start=1):
        print(f"[{index}/{len(variant_jobs)}] {section_type} / {variant}")
        response = core.phase_chat_json(
            api_key,
            f"tailwind_guide:{section_type}:{variant}",
            GUIDE_SYSTEM,
            build_user_prompt(section_type, variant, required_fields),
            lambda raw, st=section_type, v=variant: validate_guide_response(raw, st, v),
            temperature=0.45,
            max_tokens=2600,
            retries=1,
            prompt_log=prompt_log,
        )
        markdown_parts.append(render_markdown_entry(response))
        output_path.write_text("\n".join(markdown_parts).rstrip() + "\n", encoding="utf-8")

    prompt_log_path = output_path.with_suffix(".prompts.json")
    prompt_log_path.write_text(json.dumps(prompt_log, indent=2), encoding="utf-8")

    print(
        textwrap.dedent(
            f"""
            Done.
            Guide:   {output_path}
            Prompts: {prompt_log_path}
            """
        ).strip()
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
