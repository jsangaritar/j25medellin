import { ImageOff } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onError' | 'alt'> {
  alt: string;
  /** Custom fallback content shown when src is missing or fails to load */
  fallback?: ReactNode;
}

export function OptimizedImage({
  alt,
  className,
  fallback,
  src,
  ...props
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="flex size-full items-center justify-center bg-bg-elevated">
        {fallback ?? <ImageOff className="size-8 text-text-dim" />}
      </div>
    );
  }

  return (
    <div className="relative size-full overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-bg-elevated" />
      )}
      <img
        {...props}
        src={src}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0',
          className,
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
