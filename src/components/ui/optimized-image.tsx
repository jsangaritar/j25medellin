import { ImageOff } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps
  extends Omit<
    React.ImgHTMLAttributes<HTMLImageElement>,
    'onError' | 'alt' | 'className'
  > {
  alt: string;
  /** Classes applied to the wrapper (layout, sizing, positioning, rounding) */
  className?: string;
  /** Classes applied to the inner <img> (object-fit, etc.) */
  imgClassName?: string;
  /** Custom fallback content shown when src is missing or fails to load */
  fallback?: ReactNode;
}

export function OptimizedImage({
  alt,
  className,
  imgClassName,
  fallback,
  src,
  ...props
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-bg-elevated',
          className,
        )}
      >
        {fallback ?? <ImageOff className="size-8 text-text-dim" />}
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-bg-elevated" />
      )}
      <img
        {...props}
        src={src}
        alt={alt}
        className={cn(
          'size-full transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0',
          imgClassName,
        )}
        loading={props.loading ?? 'lazy'}
        decoding={props.decoding ?? 'async'}
        referrerPolicy={props.referrerPolicy ?? 'no-referrer'}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  );
}
