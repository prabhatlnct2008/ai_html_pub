#!/usr/bin/env python3.11

from __future__ import annotations

import argparse
import json
import textwrap
from pathlib import Path
from typing import Any

import generate_html as core


BUSINESS_GROUPS: dict[str, list[str]] = {
    "Healthcare, wellness, therapy, and rehabilitation": [
        "General physician clinics",
        "Multi-specialty clinics",
        "Dental clinics",
        "Orthopedic clinics",
        "Physiotherapy clinics",
        "Sports injury rehab centers",
        "Chiropractors",
        "Dermatology / skin clinics",
        "Cosmetic dermatology clinics",
        "Hair transplant clinics",
        "ENT clinics",
        "Eye clinics / ophthalmologists",
        "Pediatric clinics",
        "Gynecology clinics",
        "IVF / fertility clinics",
        "Psychiatry practices",
        "Psychologists / therapists / counselors",
        "Speech therapy centers",
        "Occupational therapy centers",
        "Nutritionists / dieticians",
        "Diagnostic labs",
        "Imaging centers / MRI / ultrasound centers",
        "Home nursing / home healthcare providers",
        "Elder care / assisted home care services",
        "Alternative medicine clinics (Ayurveda / Homeopathy / Acupuncture)",
    ],
    "Pet and animal care": [
        "Pet clinics",
        "Veterinary hospitals",
        "Veterinary doctors / independent vets",
        "Mobile pet grooming businesses",
        "Pet grooming salons",
        "Pet boarding / pet hostels",
        "Pet training and obedience schools",
        "Pet day care centers",
        "Pet shops",
        "Pet food and accessories stores",
        "Pet behavior consultants",
        "Pet physiotherapy / rehabilitation services",
    ],
    "Beauty, grooming, aesthetics, and personal care": [
        "Unisex salons",
        "Premium hair salons",
        "Nail studios",
        "Lash and brow studios",
        "Bridal makeup artists",
        "Makeup academies / beauty training studios",
        "Spas and wellness spas",
        "Aesthetic clinics",
        "Laser hair removal clinics",
        "Slimming centers / body contouring centers",
        "Tattoo studios",
    ],
    "Fitness, sports, and movement": [
        "Gyms",
        "Boutique fitness studios",
        "Yoga studios",
        "Pilates studios",
        "Zumba / dance fitness studios",
        "Martial arts / self-defense academies",
        "Personal trainers",
        "Swimming coaches / swim academies",
        "Tennis / badminton coaching centers",
        "Meditation and breathwork centers",
    ],
    "Education, training, and child development": [
        "Preschools",
        "Daycare centers",
        "Tuition centers",
        "Coaching institutes for school subjects",
        "NEET / JEE coaching centers",
        "IELTS / TOEFL / PTE coaching institutes",
        "Spoken English and communication institutes",
        "Study abroad counseling firms",
        "Skill development institutes",
        "Music schools",
        "Dance schools",
        "Art and craft academies",
        "Coding academies / computer training centers",
        "Special education / learning support centers",
        "Child therapy and development centers",
    ],
    "Travel, tours, visa, and mobility": [
        "Domestic tour operators",
        "International travel agencies",
        "Honeymoon planners",
        "Luxury travel planners",
        "Group tour organizers",
        "Corporate travel management companies",
        "Visa processing agencies",
        "Immigration consultants",
        "Passport assistance services",
        "Study visa consultants",
        "Travel insurance consultants",
        "Hotel and itinerary booking specialists",
        "Pilgrimage / religious tour organizers",
        "Tempo traveller / bus rental businesses",
        "Cab rental and airport transfer services",
    ],
    "Religious, ceremonial, and event-linked services": [
        "Pandits for puja and rituals",
        "Wedding pandits / ceremony specialists",
        "Astrologers",
        "Vastu consultants",
        "Spiritual counselors",
        "Wedding planners",
        "Event planners",
        "Decor and floral styling businesses",
        "Caterers",
        "Banquet / party venue businesses",
        "Photography and videography studios",
        "Invitation / gifting / return-gift businesses",
    ],
    "Professional, legal, property, and business services": [
        "Law firms",
        "Independent advocates",
        "Chartered accountants",
        "Tax consultants / GST consultants",
        "Company registration consultants",
        "Trademark / IP consultants",
        "Recruitment agencies",
        "Staffing and manpower firms",
        "Domestic help / nanny / caregiver agencies",
        "Real estate brokers",
        "Luxury property consultants",
        "Commercial property consultants",
        "Property management firms",
        "Interior designers",
        "Architects",
        "Home renovation contractors",
        "Modular kitchen businesses",
        "Custom furniture studios",
        "Packers and movers",
        "Security and housekeeping service providers",
    ],
    "Retail, product, and local commerce brands": [
        "Boutiques and designer wear stores",
        "Ethnic wear stores",
        "Jewelry stores",
        "Optical stores",
        "Pharmacy chains / medical stores",
        "Gourmet food stores",
        "Bakery brands",
        "Cloud kitchens",
        "Restaurants and cafes",
        "Organic / specialty grocery stores",
        "Gift shops",
        "Home decor stores",
        "Mattress / furnishing sellers",
        "Curtain / blinds / wallpaper stores",
        "Electronics and appliance retailers",
    ],
}


PLAYBOOK_SYSTEM = """You are a senior website strategist and business-site architecture planner.

Your task:
- For one business type, generate a RAG-ready website playbook in the same style and structure as the provided examples.
- Think commercially, not generically.
- Provide both architecture options and two strong homepage design directions.
- Make the output useful for downstream retrieval, planning, design, and copywriting.

Rules:
- Return JSON only.
- Stay specific to the business category.
- Focus on buyer behavior, conversion logic, architecture choices, and design direction.
- Do not write shallow filler.
- The output should be strong enough to use as a retrieval document for future website generation.

Return JSON with this exact structure:
{
  "businessTypeLabel": "...",
  "businessNameExample": "...",
  "markdown": "full markdown playbook in the example format"
}
"""


def business_jobs() -> list[tuple[str, str]]:
    jobs: list[tuple[str, str]] = []
    for group, items in BUSINESS_GROUPS.items():
        for item in items:
            jobs.append((group, item))
    return jobs


def build_user_prompt(group: str, business: str, examples_markdown: str) -> str:
    return f"""Use the examples below as style and structure references.

EXAMPLE_REFERENCE
{examples_markdown}

Now create one new playbook for this business:

BUSINESS_GROUP: {group}
BUSINESS_TO_GENERATE: {business}

Requirements:
- Preserve the broad structure and depth of the examples.
- Make the business commercially realistic.
- Include:
  - BUSINESS_PROFILE
  - OFFER_STRUCTURE
  - TARGET_AUDIENCE
  - BUYER_BEHAVIOR
  - SITE_ARCHITECTURE_OPTION_A
  - SITE_ARCHITECTURE_OPTION_B
  - HOMEPAGE_IDEATION_OPTION_1
  - HOMEPAGE_IDEATION_OPTION_2
  - RECOMMENDED_FINAL_DIRECTION
  - RAG_READY_SUMMARY
- Treat the business name as a representative example brand for that category.
- Use markdown-style headings and lists inside the markdown output.
- Make the page architecture options specific to this business, not generic SMB advice.
"""


def validate_playbook_response(raw: Any, business: str) -> dict[str, Any]:
    if not isinstance(raw, dict):
        raise ValueError("Playbook response must be a JSON object.")
    markdown = str(raw.get("markdown") or "").strip()
    if not markdown:
        raise ValueError(f"Missing markdown output for {business}.")
    required_markers = [
        "BUSINESS_PROFILE",
        "OFFER_STRUCTURE",
        "TARGET_AUDIENCE",
        "BUYER_BEHAVIOR",
        "SITE_ARCHITECTURE_OPTION_A",
        "SITE_ARCHITECTURE_OPTION_B",
        "HOMEPAGE_IDEATION_OPTION_1",
        "HOMEPAGE_IDEATION_OPTION_2",
        "RECOMMENDED_FINAL_DIRECTION",
        "RAG_READY_SUMMARY",
    ]
    missing = [marker for marker in required_markers if marker not in markdown]
    if missing:
        raise ValueError(f"Missing required sections for {business}: {', '.join(missing)}")
    return {
        "businessTypeLabel": str(raw.get("businessTypeLabel") or business).strip(),
        "businessNameExample": str(raw.get("businessNameExample") or business).strip(),
        "markdown": markdown,
    }


def render_entry(group: str, business: str, entry: dict[str, Any]) -> str:
    lines = [
        f"# {business}",
        "",
        f"BUSINESS_GROUP: {group}",
        "",
        entry["markdown"].strip(),
        "",
    ]
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate a business playbook guide for RAG using gpt-4o-mini.")
    parser.add_argument(
        "--examples",
        default="sandbox/unit_cli_html_generator/business_playbook_examples.md",
        help="Examples markdown file used as the few-shot prompt.",
    )
    parser.add_argument(
        "--output",
        default="sandbox/unit_cli_html_generator/business_playbook_guide.md",
        help="Output markdown file.",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=0,
        help="Optional limit on business categories to process (0 = all).",
    )
    args = parser.parse_args()

    api_key = core.load_env_var("OPENAI_API_KEY")
    if not api_key:
        print("OPENAI_API_KEY not found in environment, .env.local, or .env")
        return 1

    examples_path = Path(args.examples)
    output_path = Path(args.output)
    examples_markdown = examples_path.read_text(encoding="utf-8")
    jobs = business_jobs()
    if args.limit > 0:
        jobs = jobs[: args.limit]

    output_path.parent.mkdir(parents=True, exist_ok=True)
    prompt_log: list[dict[str, Any]] = []
    markdown_parts = [
        "# Business Playbook Guide",
        "",
        "Generated with `gpt-4o-mini` using the local business playbook examples as few-shot guidance.",
        "",
    ]

    for index, (group, business) in enumerate(jobs, start=1):
        print(f"[{index}/{len(jobs)}] {business}")
        response = core.phase_chat_json(
            api_key,
            f"business_playbook:{business}",
            PLAYBOOK_SYSTEM,
            build_user_prompt(group, business, examples_markdown),
            lambda raw, b=business: validate_playbook_response(raw, b),
            temperature=0.55,
            max_tokens=5200,
            retries=1,
            prompt_log=prompt_log,
        )
        markdown_parts.append(render_entry(group, business, response))
        output_path.write_text("\n".join(markdown_parts).rstrip() + "\n", encoding="utf-8")

    prompt_log_path = output_path.with_suffix(".prompts.json")
    prompt_log_path.write_text(json.dumps(prompt_log, indent=2), encoding="utf-8")

    print(
        textwrap.dedent(
            f"""
            Done.
            Guide:   {output_path}
            Prompts: {prompt_log_path}
            Businesses: {len(jobs)}
            """
        ).strip()
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
