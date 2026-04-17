import { CalendarDays } from 'lucide-react';
import { EventCard } from '@/components/features/events/EventCard';
import { FeaturedEvent } from '@/components/features/events/FeaturedEvent';
import { PageBanner } from '@/components/layout/PageBanner';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionHeader } from '@/components/ui/section-header';
import { Skeleton } from '@/components/ui/skeleton';
import { useEvents } from '@/hooks/useEvents';
import { useSiteConfig } from '@/hooks/useSiteConfig';

export function EventosPage() {
  const { data: allEvents = [], isLoading } = useEvents();
  const { data: config } = useSiteConfig();

  // Only show current/future events that have images on the public page
  const now = new Date();
  const events = allEvents.filter(
    (e) => e.imageUrl && new Date(e.endDate ?? e.date) >= now,
  );

  const explicitFeatured = events.find((e) => e.featured);
  const featured =
    explicitFeatured ??
    events
      .filter((e) => new Date(e.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .at(0);
  const upcoming = events
    .filter((e) => e.id !== featured?.id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <>
      <PageBanner
        title="Eventos"
        subtitle="Próximos eventos y encuentros de la comunidad J+."
      />

      <section className="mx-auto max-w-[1440px] px-14 py-16 max-md:px-5 max-md:py-10">
        {isLoading ? (
          <div className="flex flex-col gap-12">
            <Skeleton className="h-[300px] rounded-2xl" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={`skel-${i}`} className="h-[340px] rounded-xl" />
              ))}
            </div>
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="Sin eventos"
            description="No hay eventos programados por ahora. Vuelve pronto para ver las novedades."
          />
        ) : (
          <div className="flex flex-col gap-12">
            {featured && (
              <FeaturedEvent
                event={featured}
                whatsappNumber={config?.whatsappNumber ?? ''}
              />
            )}
            {upcoming.length > 0 && (
              <div>
                <SectionHeader
                  label="PRÓXIMOS"
                  title="Más eventos"
                  className="mb-8"
                />
                <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {upcoming.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
}
