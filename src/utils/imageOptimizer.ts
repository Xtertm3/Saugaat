/**
 * Utility functions for optimizing image URLs (Unsplash, local assets, etc.)
 */

export interface ImageOptimizeOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'jpg' | 'png';
  fit?: 'crop' | 'clip' | 'max' | 'fill';
}

/**
 * Optimizes an image URL by applying format, resolution, and quality parameters.
 * Automatically transforms Unsplash URLs to serve WebP at requested resolution.
 */
export function getOptimizedImageUrl(
  src: string | undefined | null,
  options: ImageOptimizeOptions = {}
): string {
  if (!src) {
    return 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format,compress&fit=crop&q=68&w=500&fm=webp';
  }

  const {
    width = 400,
    quality = 68,
    format = 'webp',
    fit = 'crop',
  } = options;

  // Optimize Unsplash URLs for maximum speed & minimal byte footprint
  if (src.includes('images.unsplash.com')) {
    try {
      const url = new URL(src);
      url.searchParams.set('auto', 'format,compress');
      url.searchParams.set('fit', fit);
      url.searchParams.set('q', quality.toString());
      url.searchParams.set('w', width.toString());
      url.searchParams.set('fm', format);
      if (options.height) {
        url.searchParams.set('h', options.height.toString());
      }
      return url.toString();
    } catch {
      return src;
    }
  }

  // Local cushion images optimization (WebP version)
  if (src.startsWith('/cushions/') && (src.endsWith('.jpg') || src.endsWith('.png'))) {
    return src.replace(/\.(jpg|png)$/, '.webp');
  }

  if (src === '/logo.png') {
    return '/logo.webp';
  }

  return src;
}

