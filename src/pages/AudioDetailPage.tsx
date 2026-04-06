import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ContentCard } from '@/components/features/media/ContentCard';
import { MediaDetailSkeleton } from '@/components/features/media/MediaDetailSkeleton';
import { MediaNotFound } from '@/components/features/media/MediaNotFound';
import { Tag } from '@/components/ui/tag';
import { useMedia, useMediaBySlug } from '@/hooks/useMedia';

export function AudioDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: item, isLoading } = useMediaBySlug(slug);
  const { data: allMedia = [] } = useMedia({ type: 'AUDIO' });

  if (isLoading) return <MediaDetailSkeleton />;

  if (!item) return <MediaNotFound />;

  const related = allMedia.filter((m) => m.id !== item.id).slice(0, 4);

  return (
    <section className="mx-auto max-w-[1440px] px-14 py-10 max-md:px-5">
      <Link
        to="/media"
        className="mb-6 inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text-primary"
      >
        <ArrowLeft className="size-4" />
        Volver a Media
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px]">
        <div>
          {/* Audio embed */}
          <div className="mb-6 overflow-hidden rounded-xl bg-bg-card">
            {item.thumbnailUrl && (
              <img
                src={item.thumbnailUrl}
                alt={item.title}
                className="aspect-video w-full object-cover"
              />
            )}
            {item.externalUrl && (
              <div className="p-4">
                <iframe
                  src={item.externalUrl
                    .replace(
                      'open.spotify.com/episode/',
                      'open.spotify.com/embed/episode/',
                    )
                    .replace(
                      'open.spotify.com/show/',
                      'open.spotify.com/embed/show/',
                    )}
                  title={item.title}
                  className="h-[152px] w-full rounded-xl"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {item.tags.map((tag) => (
              <Tag key={tag} variant="accent">
                {tag}
              </Tag>
            ))}
          </div>
          <h1 className="mb-3 font-display text-2xl font-bold text-text-primary">
            {item.title}
          </h1>
          <p className="text-sm leading-relaxed text-text-secondary">
            {item.description}
          </p>
          {item.episodeCount && (
            <p className="mt-2 text-xs text-text-muted">
              {item.episodeCount} episodios
            </p>
          )}
        </div>

        {/* Related sidebar */}
        {related.length > 0 && (
          <aside>
            <h3 className="mb-4 font-body text-sm font-semibold text-text-muted">
              Más episodios
            </h3>
            <div className="flex flex-col gap-4">
              {related.map((r) => (
                <ContentCard key={r.id} item={r} />
              ))}
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}
