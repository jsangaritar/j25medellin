import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ContentCard } from '@/components/features/media/ContentCard';
import { MediaDetailSkeleton } from '@/components/features/media/MediaDetailSkeleton';
import { MediaNotFound } from '@/components/features/media/MediaNotFound';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Tag } from '@/components/ui/tag';
import { useMedia, useMediaBySlug } from '@/hooks/useMedia';
import { getRelatedMedia, getRelatedMediaLabel } from '@/utils/media';

export function VideoDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: item, isLoading } = useMediaBySlug(slug);
  const { data: allMedia = [] } = useMedia();

  if (isLoading) return <MediaDetailSkeleton />;

  if (!item) return <MediaNotFound />;

  const related = getRelatedMedia(item, allMedia, 3);

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
          {/* Video embed */}
          <div className="mb-6 aspect-video overflow-hidden rounded-xl bg-bg-elevated">
            {item.externalUrl ? (
              <iframe
                src={item.externalUrl
                  .replace('watch?v=', 'embed/')
                  .replace('youtu.be/', 'youtube.com/embed/')}
                title={item.title}
                className="size-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : item.thumbnailUrl ? (
              <OptimizedImage
                src={item.thumbnailUrl}
                alt={item.title}
                className="size-full"
                imgClassName="object-cover"
              />
            ) : null}
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
          <p className="whitespace-pre-line text-sm leading-relaxed text-text-secondary">
            {item.description}
          </p>
        </div>

        {/* Related sidebar */}
        {related.length > 0 && (
          <aside>
            <h3 className="mb-4 font-body text-sm font-semibold text-text-muted">
              {getRelatedMediaLabel(item.type)}
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
