import { ExternalLink, Share2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { ContentCard } from '../components/features/media/ContentCard';
import { useMedia, useMediaBySlug } from '../hooks/useMedia';
import { getStrapiMediaUrl } from '../utils/media';

export function VideoDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: video, isLoading } = useMediaBySlug(slug);
  const { data: related } = useMedia({ type: 'VIDEO', pageSize: 4 });

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-[300px] bg-bg-card lg:h-[560px]" />
        <div className="px-5 py-8 lg:px-14 lg:py-12">
          <div className="h-8 w-2/3 rounded bg-bg-card" />
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <p className="px-5 py-16 text-center font-body text-text-muted">
        Video no encontrado.
      </p>
    );
  }

  const thumbnailUrl = getStrapiMediaUrl(video.thumbnailImage);
  const relatedItems = related?.filter((r) => r.slug !== slug).slice(0, 4);

  return (
    <>
      {/* Video player / thumbnail area */}
      <div className="relative h-[220px] w-full overflow-hidden bg-bg-card lg:h-[560px]">
        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt={video.title}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {/* Content area */}
      <div className="flex flex-col gap-8 px-5 py-8 lg:flex-row lg:gap-12 lg:px-14 lg:py-12">
        {/* Main content */}
        <div className="flex flex-1 flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className="font-body text-[10px] font-bold tracking-wider text-accent-bright">
              VIDEO
            </span>
            <h1 className="font-display text-2xl font-extrabold tracking-[-0.5px] text-text-primary lg:text-[28px]">
              {video.title}
            </h1>
          </div>
          {video.description && (
            <p className="font-body text-[15px] leading-[1.6] text-text-secondary">
              {video.description}
            </p>
          )}
          <div className="flex gap-3">
            {video.externalUrl && (
              <a
                href={video.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-[10px] bg-accent-bright px-5 py-3 font-body text-sm font-semibold text-bg-primary transition-colors hover:bg-accent-muted"
              >
                <ExternalLink size={16} />
                Ver en {video.platform ?? 'YouTube'}
              </a>
            )}
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-[10px] border border-border px-5 py-3 font-body text-sm font-medium text-text-secondary transition-colors hover:border-text-muted"
            >
              <Share2 size={16} />
              Compartir
            </button>
          </div>
        </div>

        {/* Related sidebar */}
        {relatedItems && relatedItems.length > 0 && (
          <div className="flex flex-col gap-4 lg:w-[380px]">
            <h3 className="font-display text-lg font-bold text-text-primary">
              Más videos
            </h3>
            {relatedItems.map((item) => (
              <ContentCard key={item.id} content={item} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
