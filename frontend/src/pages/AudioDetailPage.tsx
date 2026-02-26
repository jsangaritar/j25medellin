import { ExternalLink, Share2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useMedia, useMediaBySlug } from '../hooks/useMedia';
import { getStrapiMediaUrl } from '../utils/media';

export function AudioDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: audio, isLoading } = useMediaBySlug(slug);
  const { data: related } = useMedia({ type: 'AUDIO', pageSize: 5 });

  if (isLoading) {
    return (
      <div className="animate-pulse px-5 py-8 lg:px-14 lg:py-14">
        <div className="h-[200px] w-full rounded-2xl bg-bg-card lg:h-[260px]" />
      </div>
    );
  }

  if (!audio) {
    return (
      <p className="px-5 py-16 text-center font-body text-text-muted">
        Audio no encontrado.
      </p>
    );
  }

  const thumbnailUrl = getStrapiMediaUrl(audio.thumbnailImage);
  const relatedItems = related?.filter((r) => r.slug !== slug).slice(0, 4);

  return (
    <div className="flex flex-col gap-8 px-5 py-8 md:px-10 md:py-10 lg:flex-row lg:gap-14 lg:px-14 lg:py-14">
      {/* Main content */}
      <div className="flex flex-1 flex-col gap-8">
        {/* Player card */}
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-bg-card p-6 lg:flex-row lg:gap-8 lg:p-8">
          {thumbnailUrl && (
            <img
              src={thumbnailUrl}
              alt={audio.title}
              className="h-[200px] w-[200px] shrink-0 rounded-xl object-cover"
            />
          )}
          <div className="flex flex-col gap-4">
            <span className="font-body text-[10px] font-bold tracking-wider text-[#F59E0B]">
              AUDIO
            </span>
            <h1 className="font-display text-2xl font-extrabold tracking-[-0.5px] text-text-primary lg:text-[28px]">
              {audio.title}
            </h1>
            {audio.platform && (
              <span className="font-body text-sm text-text-muted">
                {audio.platform}
                {audio.episodeCount ? ` · ${audio.episodeCount} episodios` : ''}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        {audio.description && (
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-lg font-bold text-text-primary">
              Descripción
            </h3>
            <p className="font-body text-[15px] leading-[1.6] text-text-secondary">
              {audio.description}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {audio.externalUrl && (
            <a
              href={audio.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[10px] bg-accent-bright px-5 py-3 font-body text-sm font-semibold text-bg-primary transition-colors hover:bg-accent-muted"
            >
              <ExternalLink size={16} />
              Escuchar en {audio.platform ?? 'Spotify'}
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
        <div className="flex flex-col gap-5 lg:w-[380px]">
          <h3 className="font-display text-lg font-bold text-text-primary">
            Más episodios
          </h3>
          {relatedItems.map((item, index) => (
            <a
              key={item.id}
              href={`/media/audio/${item.slug}`}
              className="flex items-center gap-3.5 rounded-xl border border-border bg-bg-card p-3.5 transition-colors hover:border-text-dim"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-accent-dim font-display text-sm font-bold text-accent-bright">
                {index + 1}
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <span className="truncate font-body text-sm font-semibold text-text-primary">
                  {item.title}
                </span>
                {item.platform && (
                  <span className="font-body text-[11px] text-text-muted">
                    {item.platform}
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
