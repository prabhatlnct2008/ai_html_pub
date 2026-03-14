import type { SectionType, Asset } from "@/lib/page/schema";
import { getPlaceholderUrl, type PlaceholderCategory } from "@/lib/assets/placeholders";
import { v4 as uuid } from "uuid";

// Asset planner: for each section, determine what image slots exist
// and create placeholder assets for them.

interface SectionPlan {
  type: SectionType;
  description: string;
}

export function planAssets(
  sectionSequence: SectionPlan[],
  businessName: string
): Asset[] {
  const assets: Asset[] = [];

  for (const section of sectionSequence) {
    switch (section.type) {
      case "hero": {
        assets.push({
          id: uuid(),
          kind: "image",
          source: "placeholder",
          url: getPlaceholderUrl("hero", 800, 600, `${businessName}`),
          alt: `${businessName} hero image`,
        });
        break;
      }
      case "services":
      case "features": {
        // Create placeholder for each potential card (3 cards)
        for (let i = 0; i < 3; i++) {
          assets.push({
            id: uuid(),
            kind: "image",
            source: "placeholder",
            url: getPlaceholderUrl("feature", 400, 300, `${section.type} ${i + 1}`),
            alt: `${section.type} image ${i + 1}`,
          });
        }
        break;
      }
      case "testimonials": {
        for (let i = 0; i < 3; i++) {
          assets.push({
            id: uuid(),
            kind: "image",
            source: "placeholder",
            url: getPlaceholderUrl("testimonial", 100, 100, `Person ${i + 1}`),
            alt: `Testimonial avatar ${i + 1}`,
          });
        }
        break;
      }
      // Other sections don't need asset slots in v1
    }
  }

  return assets;
}
