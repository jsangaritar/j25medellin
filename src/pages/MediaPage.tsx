import { Film } from 'lucide-react';
import { useState } from 'react';
import { ContentCard } from '@/components/features/media/ContentCard';
import { PageBanner } from '@/components/layout/PageBanner';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionHeader } from '@/components/ui/section-header';
import { Skeleton } from '@/components/ui/skeleton';
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
  const { data: allMedia = [], isLoading } = useMedia();
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
        {isLoading ? (
          <div className="flex flex-col gap-12">
            <div>
              <Skeleton className="mb-8 h-10 w-60" />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton
                    key={`feat-${i}`}
                    className="h-[280px] rounded-xl"
                  />
                ))}
              </div>
            </div>
            <div>
              <Skeleton className="mb-8 h-10 w-60" />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton
                    key={`grid-${i}`}
                    className="h-[260px] rounded-xl"
                  />
                ))}
              </div>
            </div>
          </div>
        ) : allMedia.length === 0 ? (
          <EmptyState
            icon={Film}
            title="Sin contenido"
            description="Aún no hay contenido disponible. Vuelve pronto."
          />
        ) : (
          <div className="flex flex-col gap-12">
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

            <div>
              <div className="mb-8 flex items-end justify-between max-md:flex-col max-md:items-start max-md:gap-4">
                <SectionHeader label="EXPLORAR" title="Todo el contenido" />
                <Tabs
                  value={activeTab}
                  onValueChange={(v) => setActiveTab(v as MediaType | 'ALL')}
                >
                  <TabsList className="gap-1 rounded-xl bg-bg-elevated p-1">
                    {TABS.map((tab) => (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="rounded-lg px-4 py-2 text-xs font-medium text-text-muted transition-colors hover:text-text-primary data-[state=active]:bg-accent-bright data-[state=active]:text-bg-primary data-[state=active]:shadow-none"
                      >
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
