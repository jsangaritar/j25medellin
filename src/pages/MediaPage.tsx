import { Film } from 'lucide-react';
import { useState } from 'react';
import { ContentCard } from '@/components/features/media/ContentCard';
import { PageBanner } from '@/components/layout/PageBanner';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionHeader } from '@/components/ui/section-header';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMedia } from '@/hooks/useMedia';
import type { MediaType } from '@/types';

const TABS: { label: string; value: MediaType | 'ALL' }[] = [
  { label: 'Todo', value: 'ALL' },
  { label: 'Videos', value: 'VIDEO' },
  { label: 'Audios', value: 'AUDIO' },
  { label: 'Documentos', value: 'DOCUMENT' },
];

export function MediaPage() {
  const [activeTab, setActiveTab] = useState<MediaType | 'ALL'>('ALL');
  const { data: allMedia = [] } = useMedia();
  const { data: featuredMedia = [] } = useMedia({ featured: true });

  const filtered =
    activeTab === 'ALL'
      ? allMedia
      : allMedia.filter((m) => m.type === activeTab);

  return (
    <>
      <PageBanner
        tag="CONTENIDO"
        title="Media"
        subtitle="Videos, podcasts y recursos para tu crecimiento espiritual."
      />

      <section className="mx-auto max-w-[1440px] px-14 py-16 max-md:px-5 max-md:py-10">
        {allMedia.length === 0 ? (
          <EmptyState
            icon={Film}
            title="Sin contenido"
            description="Aún no hay contenido disponible. Vuelve pronto."
          />
        ) : (
          <div className="flex flex-col gap-12">
            {/* Featured */}
            {featuredMedia.length > 0 && (
              <div>
                <SectionHeader
                  label="DESTACADO"
                  title="Contenido destacado"
                  className="mb-8"
                />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {featuredMedia.map((item) => (
                    <ContentCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}

            {/* Filter tabs + grid */}
            <div>
              <div className="mb-8 flex items-end justify-between max-md:flex-col max-md:items-start max-md:gap-4">
                <SectionHeader label="EXPLORAR" title="Todo el contenido" />
                <Tabs
                  value={activeTab}
                  onValueChange={(v) => setActiveTab(v as MediaType | 'ALL')}
                >
                  <TabsList>
                    {TABS.map((tab) => (
                      <TabsTrigger key={tab.value} value={tab.value}>
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              {filtered.length === 0 ? (
                <EmptyState
                  icon={Film}
                  title="Sin resultados"
                  description="No hay contenido en esta categoría."
                />
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((item) => (
                    <ContentCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
