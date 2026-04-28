import { IMAGE_BASE_URL } from "./api-config";

/**
 * Get image URL with proper handling for different URL types
 */
export function getImageUrl(imagePath: string | undefined): string {
  if (!imagePath) return "";
  if (imagePath.startsWith("/images/products/")) {
    return imagePath.replace("/images/products/", "/images/");
  }
  if (imagePath.startsWith("/images/")) return imagePath;
  if (imagePath.startsWith("/")) return imagePath;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;
  return `${IMAGE_BASE_URL}${imagePath}`;
}

/**
 * Get localized content from a content record
 */
export function getLocalizedContent<T extends { name?: string; description?: string }>(
  content: Record<string, T> | undefined,
  locale: string,
  fallbackId: string
): { name: string; description: string } {
  const localized = content?.[locale] || content?.en || Object.values(content || {})[0];
  return {
    name: localized?.name || fallbackId,
    description: localized?.description || "",
  };
}

/**
 * Get localized blog content
 */
export function getLocalizedBlogContent(
  content: Record<string, { title?: string; excerpt?: string; content?: string }> | undefined,
  locale: string,
  fallbackSlug: string
): { title: string; excerpt: string; content: string } {
  const localized = content?.[locale] || content?.en || Object.values(content || {})[0];
  return {
    title: localized?.title || fallbackSlug,
    excerpt: localized?.excerpt || "",
    content: localized?.content || "",
  };
}