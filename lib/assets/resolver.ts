import type { Asset } from "@/lib/page/schema";
import { getPlaceholderUrl, type PlaceholderCategory } from "./placeholders";

/**
 * Resolve an asset by ID from the assets array.
 */
export function resolveAsset(
  assetId: string | undefined,
  assets: Asset[]
): Asset | undefined {
  if (!assetId) return undefined;
  return assets.find((a) => a.id === assetId);
}

/**
 * Resolve an asset URL by ID, falling back to placeholder if not found.
 */
export function resolveAssetUrl(
  assetId: string | undefined,
  assets: Asset[],
  placeholderCategory: PlaceholderCategory = "general",
  width = 800,
  height = 600
): string {
  const asset = resolveAsset(assetId, assets);
  if (asset) return asset.url;
  return getPlaceholderUrl(placeholderCategory, width, height);
}

/**
 * Resolve asset alt text, with fallback.
 */
export function resolveAssetAlt(
  assetId: string | undefined,
  assets: Asset[],
  fallback = "Image"
): string {
  const asset = resolveAsset(assetId, assets);
  return asset?.alt || fallback;
}
