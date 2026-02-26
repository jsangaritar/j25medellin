import { Link } from 'react-router-dom';
import type { MediaContent } from '../../../types';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:1337';

interface ContentCardProps {
  content: MediaContent;
}

const typeColors: Record<string, string> = {
  VIDEO: 'text-accent-bright',
  AUDIO: 'text-[#F59E0B]',
  DOCUMENT: 'text-[#7C3AED]',
};

const typeLabels: Record<string, string> = {
  VIDEO: 'VIDEO',
  AUDIO: 'AUDIO',
  DOCUMENT: 'DOCUMENTO',
};

function getDetailPath(content: MediaContent): string {
  switch (content.type) {
    case 'VIDEO':
      return `/media/video/${content.slug}`;
    case 'AUDIO':
      return `/media/audio/${content.slug}`;
    case 'DOCUMENT':
      return `/media/documento/${content.slug}`;
  }
}

function getMetaText(content: MediaContent): string {
  const parts: string[] = [];
  if (content.episodeCount) {
    parts.push(`${content.episodeCount} episodios`);
  }
  if (content.platform) {
    parts.push(content.platform);
  }
  return parts.join(' \u00B7 ');
}

export function ContentCard({ content }: ContentCardProps) {
  const imageUrl = content.thumbnailImage?.url
    ? `${API_BASE}${content.thumbnailImage.url}`
    : undefined;
  const detailPath = getDetailPath(content);

  return (
    <Link
      to={detailPath}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-card transition-colors hover:border-text-dim md:block"
    >
      {/* Desktop: vertical card */}
      <div className="hidden md:block">
        {imageUrl && (
          <div className="h-[200px] w-full overflow-hidden">
            <img
              src={imageUrl}
              alt={content.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
        )}
        <div className="flex flex-col gap-2 p-5">
          <span
            className={`text-[9px] font-bold tracking-wider ${typeColors[content.type]}`}
          >
            {typeLabels[content.type]}
          </span>
          <h3 className="text-[15px] font-semibold text-text-primary">
            {content.title}
          </h3>
          {content.description && (
            <p className="text-[13px] leading-[1.4] text-text-secondary line-clamp-2">
              {content.description}
            </p>
          )}
          {getMetaText(content) && (
            <span className="text-[11px] text-text-muted">
              {getMetaText(content)}
            </span>
          )}
        </div>
      </div>

      {/* Mobile: list item */}
      <div className="flex items-center gap-3.5 border-b border-border px-0 py-4 md:hidden">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={content.title}
            className="h-14 w-14 shrink-0 rounded-[10px] object-cover"
          />
        )}
        <div className="flex min-w-0 flex-col gap-1">
          <span
            className={`text-[9px] font-bold tracking-wider ${typeColors[content.type]}`}
          >
            {typeLabels[content.type]}
          </span>
          <h3 className="truncate text-sm font-semibold text-text-primary">
            {content.title}
          </h3>
          {getMetaText(content) && (
            <span className="text-[11px] text-text-muted">
              {getMetaText(content)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
