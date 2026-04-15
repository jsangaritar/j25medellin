import { ArrowLeft, Download, ExternalLink } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ContentCard } from '@/components/features/media/ContentCard';
import { MediaDetailSkeleton } from '@/components/features/media/MediaDetailSkeleton';
import { MediaNotFound } from '@/components/features/media/MediaNotFound';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Tag } from '@/components/ui/tag';
import { useMedia, useMediaBySlug } from '@/hooks/useMedia';

export function DocumentDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: item, isLoading } = useMediaBySlug(slug);
  const { data: allMedia = [] } = useMedia({ type: 'DOCUMENT' });

  if (isLoading) return <MediaDetailSkeleton />;

  if (!item) return <MediaNotFound />;

  const related = allMedia.filter((m) => m.id !== item.id).slice(0, 3);

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
          {/* Document preview */}
          <div className="mb-6 overflow-hidden rounded-xl border border-border-light bg-bg-card">
            {item.thumbnailUrl && (
              <OptimizedImage
                src={item.thumbnailUrl}
                alt={item.title}
                className="aspect-[4/3] w-full object-cover"
              />
            )}
            <div className="flex items-center justify-center gap-3 border-t border-border-light p-4">
              {item.fileUrl && (
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg bg-accent-bright px-4 py-2.5 font-body text-sm font-semibold text-bg-primary transition-opacity hover:opacity-90"
                >
                  <Download className="size-4" />
                  Descargar PDF
                </a>
              )}
              {item.fileUrl && (
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 font-body text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
                >
                  <ExternalLink className="size-4" />
                  Abrir
                </a>
              )}
            </div>
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
        </div>

        {/* Related sidebar */}
        {related.length > 0 && (
          <aside>
            <h3 className="mb-4 font-body text-sm font-semibold text-text-muted">
              Documentos relacionados
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
