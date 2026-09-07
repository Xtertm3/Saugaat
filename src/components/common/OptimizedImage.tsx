import React, { useState } from 'react';
import { getOptimizedImageUrl, type ImageOptimizeOptions } from '../../utils/imageOptimizer';

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  targetWidth?: number;
  targetQuality?: number;
  priority?: boolean;
  fallbackSrc?: string;
  aspectRatio?: string;
  fit?: ImageOptimizeOptions['fit'];
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  targetWidth = 500,
  targetQuality = 75,
  priority = false,
  fallbackSrc = 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format,compress&fit=crop&q=75&w=500&fm=webp',
  aspectRatio,
  fit = 'crop',
  className = '',
  style = {},
  onLoad,
  onError,
  ...props
}) => {
  const [, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const optimizedSrc = hasError
    ? fallbackSrc
    : getOptimizedImageUrl(src, {
        width: targetWidth,
        quality: targetQuality,
        fit,
      });

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError) {
      setHasError(true);
    }
    if (onError) onError(e);
  };

  return (
    <div
      className={`optimized-image-wrapper ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        aspectRatio: aspectRatio || undefined,
        backgroundColor: 'rgba(243, 244, 246, 0.4)',
        ...style,
      }}
    >
      <img
        src={optimizedSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        // @ts-expect-error fetchpriority is a valid HTML attribute in modern browsers
        fetchpriority={priority ? 'high' : 'auto'}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          width: '100%',
          height: '100%',
          objectFit: (style.objectFit as React.CSSProperties['objectFit']) || 'cover',
          opacity: 1,
          display: 'block',
        }}
        {...props}
      />
    </div>
  );
};

