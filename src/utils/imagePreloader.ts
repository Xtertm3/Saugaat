import { getOptimizedImageUrl, type ImageOptimizeOptions } from './imageOptimizer';

/**
 * In-memory set of preloaded image URLs to prevent duplicate preloads
 */
const preloadedUrls = new Set<string>();

/**
 * Preloads a single image URL into browser memory cache.
 */
export function preloadImage(src: string, options?: ImageOptimizeOptions): void {
  if (!src) return;
  const optimizedUrl = getOptimizedImageUrl(src, options);
  
  if (preloadedUrls.has(optimizedUrl)) return;
  preloadedUrls.add(optimizedUrl);

  const img = new Image();
  img.src = optimizedUrl;
}

/**
 * Preloads an array of image URLs into browser memory cache.
 */
export function preloadImages(srcs: (string | undefined | null)[], options?: ImageOptimizeOptions): void {
  srcs.forEach((src) => {
    if (src) preloadImage(src, options);
  });
}

/**
 * Preloads all hero carousel slide images and top catalog images.
 */
export function preloadCatalogImages(
  products?: Array<{ product_images?: Array<{ image_url: string }> }>,
  categories?: Array<{ image_url?: string }>
): void {
  if (categories) {
    categories.forEach((cat) => {
      if (cat.image_url) {
        preloadImage(cat.image_url, { width: 300, quality: 75 });
      }
    });
  }

  if (products) {
    products.forEach((product) => {
      if (product.product_images && product.product_images.length > 0) {
        product.product_images.forEach((img, idx) => {
          // Priority preload first image for grid
          if (idx === 0) {
            preloadImage(img.image_url, { width: 500, quality: 75 });
          }
        });
      }
    });
  }
}
