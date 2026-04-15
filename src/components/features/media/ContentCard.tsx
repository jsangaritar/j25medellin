import { FileText, Headphones, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
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
  const Icon = getMediaIcon(item.type);
  const route = getMediaRoute(item);

  return (
    <Link
      to={route}
      className="group overflow-hidden rounded-xl border border-border-light bg-bg-card transition-colors hover:border-border"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video">
        {item.thumbnailUrl ? (
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            className="size-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-bg-elevated">
            <Icon className="size-10 text-text-dim" />
          </div>
        )}
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
        <p className="line-clamp-2 text-xs text-text-secondary">
          {item.description}
        </p>
        {item.episodeCount && (
          <span className="text-xs text-text-muted">
            {item.episodeCount} episodios
          </span>
        )}
      </div>
    </Link>
  );
}
