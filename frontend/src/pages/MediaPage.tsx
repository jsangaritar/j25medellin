import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ContentCard } from '../components/features/media/ContentCard';
import { PageBanner } from '../components/layout/PageBanner';
import { FilterBar } from '../components/ui/FilterBar';
import { useMedia } from '../hooks/useMedia';
import type { MediaContent, MediaType } from '../types';
import { getStrapiMediaUrl } from '../utils/media';

const TABS = [
  { key: 'all', label: 'Todos' },
  { key: 'VIDEO', label: 'Videos' },
  { key: 'AUDIO', label: 'Audios' },
  { key: 'DOCUMENT', label: 'Documentos' },
];

const typeColors: Record<string, string> = {
  VIDEO: 'bg-accent-dim text-accent-bright',
  AUDIO: 'bg-[#F59E0B]/10 text-[#F59E0B]',
  DOCUMENT: 'bg-[#7C3AED]/10 text-[#7C3AED]',
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

export function MediaPage() {
  const [activeTab, setActiveTab] = useState('all');
  const typeFilter = activeTab === 'all' ? undefined : (activeTab as MediaType);
  const { data: contents, isLoading } = useMedia({ type: typeFilter });
  const { data: featuredContents } = useMedia({
    featured: true,
    pageSize: 1,
  });

  const featured = featuredContents?.[0];
  const recentItems =
    contents?.filter((c) => c.id !== featured?.id).slice(0, 4) ?? [];
  const gridItems = contents?.filter((c) => c.id !== featured?.id) ?? [];

  return (
    <>
      <PageBanner
        tag="MEDIA"
        title="Media"
        subtitle="Videos, audios y documentos para fortalecer tu fe y crecimiento."
      />

      <FilterBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Featured section */}
      {featured && activeTab === 'all' && (
        <section className="px-5 py-8 lg:px-14 lg:py-12">
          <h3 className="mb-5 font-display text-lg font-bold text-text-primary lg:mb-8 lg:text-[22px] lg:tracking-[-0.3px]">
            Destacado
          </h3>

          {/* Desktop: featured card + sidebar */}
          <div className="hidden gap-6 lg:flex">
            <FeaturedCard content={featured} />
            <div className="flex w-[380px] shrink-0 flex-col gap-4">
              <h4 className="font-display text-base font-bold text-text-primary">
                Recientes
              </h4>
              {recentItems.map((item) => (
                <SidebarItem key={item.id} content={item} />
              ))}
            </div>
          </div>

          {/* Mobile: just featured card */}
          <div className="lg:hidden">
            <FeaturedCard content={featured} />
          </div>
        </section>
      )}

      {/* Content grid */}
      <section className="border-t border-border px-5 py-8 md:px-10 md:py-10 lg:px-14 lg:py-12">
        <h3 className="mb-5 font-display text-lg font-bold text-text-primary lg:mb-8 lg:text-[22px] lg:tracking-[-0.3px]">
          Todo el contenido
        </h3>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-[300px] animate-pulse rounded-2xl bg-bg-card"
              />
            ))}
          </div>
        ) : gridItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {gridItems.map((item) => (
              <ContentCard key={item.id} content={item} />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center font-body text-text-muted">
            No hay contenido disponible por el momento.
          </p>
        )}
      </section>
    </>
  );
}

function FeaturedCard({ content }: { content: MediaContent }) {
  const imageUrl = getStrapiMediaUrl(content.thumbnailImage);
  const detailPath = getDetailPath(content);

  return (
    <Link
      to={detailPath}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-card transition-colors hover:border-text-dim lg:flex-1"
    >
      {imageUrl && (
        <div className="h-[200px] w-full overflow-hidden lg:h-[320px]">
          <img
            src={imageUrl}
            alt={content.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-col gap-3 p-5 lg:px-6 lg:py-5">
        <span
          className={`inline-flex self-start rounded-lg px-2.5 py-[3px] text-[9px] font-bold tracking-wider ${typeColors[content.type]}`}
        >
          {typeLabels[content.type]}
        </span>
        <h3 className="font-display text-[17px] font-bold text-text-primary lg:text-xl lg:tracking-[-0.3px]">
          {content.title}
        </h3>
        {content.description && (
          <p className="text-[13px] leading-[1.5] text-text-secondary lg:text-sm">
            {content.description}
          </p>
        )}
        {getMetaText(content) && (
          <span className="text-[11px] text-text-muted">
            {getMetaText(content)}
          </span>
        )}
      </div>
    </Link>
  );
}

function SidebarItem({ content }: { content: MediaContent }) {
  const imageUrl = getStrapiMediaUrl(content.thumbnailImage);
  const detailPath = getDetailPath(content);

  return (
    <Link
      to={detailPath}
      className="flex items-center gap-3.5 rounded-xl border border-border bg-bg-card p-3.5 transition-colors hover:border-text-dim"
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={content.title}
          className="h-16 w-16 shrink-0 rounded-lg object-cover"
        />
      )}
      <div className="flex min-w-0 flex-col gap-1">
        <span
          className={`text-[9px] font-bold tracking-wider ${content.type === 'VIDEO' ? 'text-accent-bright' : content.type === 'AUDIO' ? 'text-[#F59E0B]' : 'text-[#7C3AED]'}`}
        >
          {typeLabels[content.type]}
        </span>
        <h4 className="truncate text-sm font-semibold text-text-primary">
          {content.title}
        </h4>
        {getMetaText(content) && (
          <span className="text-[11px] text-text-muted">
            {getMetaText(content)}
          </span>
        )}
      </div>
    </Link>
  );
}
