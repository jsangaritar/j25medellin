import { useState } from 'react';
import { ContentCard } from '../components/features/media/ContentCard';
import { PageBanner } from '../components/layout/PageBanner';
import { FilterBar } from '../components/ui/FilterBar';
import { useMedia } from '../hooks/useMedia';
import type { MediaType } from '../types';

const TABS = [
  { key: 'all', label: 'Todos' },
  { key: 'VIDEO', label: 'Videos' },
  { key: 'AUDIO', label: 'Audios' },
  { key: 'DOCUMENT', label: 'Documentos' },
];

export function MediaPage() {
  const [activeTab, setActiveTab] = useState('all');
  const typeFilter = activeTab === 'all' ? undefined : (activeTab as MediaType);
  const { data: contents, isLoading } = useMedia({ type: typeFilter });

  return (
    <>
      <PageBanner
        tag="CONTENIDO 25+"
        title="Contenido"
        subtitle="Videos, audios y documentos para tu crecimiento espiritual."
      />

      <FilterBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <section className="px-5 py-8 md:px-10 md:py-10 lg:px-14 lg:py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-[300px] animate-pulse rounded-[14px] bg-bg-card"
              />
            ))}
          </div>
        ) : contents && contents.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {contents.map((item) => (
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
