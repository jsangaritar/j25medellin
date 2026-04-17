import { FileText, Headphones, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Tag } from '@/components/ui/tag';
import type { MediaContent } from '@/types';

function getMediaIcon(type: string) {
  switch (type) {
    case 'VIDEO':
      return Play;
    case 'AUDIO':
      return Headphones;
    default:
      return FileText;
  }
}

function getMediaRoute(item: MediaContent): string {
  switch (item.type) {
    case 'VIDEO':
      return `/media/video/${item.slug}`;
    case 'AUDIO':
      return `/media/audio/${item.slug}`;
    case 'DOCUMENT':
      return `/media/documento/${item.slug}`;
  }
}

interface ContentCardProps {
  item: MediaContent;
}

export function ContentCard({ item }: ContentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const descRef = useRef<HTMLParagraphElement>(null);
  const Icon = getMediaIcon(item.type);
  const route = getMediaRoute(item);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-check overflow when description changes
  useEffect(() => {
    const el = descRef.current;
    if (el) setOverflows(el.scrollHeight > el.clientHeight);
  }, [item.description]);

  return (
    <Link
      to={route}
      className="group overflow-hidden rounded-xl border border-border-light bg-bg-card transition-colors hover:border-border"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video">
        <OptimizedImage
          src={item.thumbnailUrl}
          alt={item.title}
          className="size-full"
          imgClassName="object-cover"
          fallback={<Icon className="size-10 text-text-dim" />}
        />
        {/* Type badge */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-bg-primary/80 px-2 py-1 backdrop-blur-sm">
          <Icon className="size-3.5 text-accent-bright" />
          <span className="text-xs font-medium text-text-primary">
            {item.platform ?? item.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-4">
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        <h3 className="font-body text-sm font-semibold text-text-primary group-hover:text-accent-bright">
          {item.title}
        </h3>
        {item.description && (
          <div>
            <p
              ref={descRef}
              className={`whitespace-pre-line text-xs text-text-secondary ${expanded ? '' : 'line-clamp-2'}`}
            >
              {item.description}
            </p>
            {(overflows || expanded) && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setExpanded((v) => !v);
                }}
                className="mt-1 text-xs font-medium text-accent-bright hover:underline"
              >
                {expanded ? 'Ver menos' : 'Ver más'}
              </button>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
