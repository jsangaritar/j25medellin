import { CalendarDays } from 'lucide-react';
import { EventCard } from '@/components/features/events/EventCard';
import { FeaturedEvent } from '@/components/features/events/FeaturedEvent';
import { PageBanner } from '@/components/layout/PageBanner';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionHeader } from '@/components/ui/section-header';
import { useEvents } from '@/hooks/useEvents';
import { useSiteConfig } from '@/hooks/useSiteConfig';

export function EventosPage() {
  const { data: events = [] } = useEvents();
  const { data: config } = useSiteConfig();

  const featured = events.find((e) => e.featured);
  const upcoming = events.filter((e) => !e.featured);

  return (
    <>
      <PageBanner
        tag="EVENTOS"
        title="Eventos"
        subtitle="Próximos eventos y encuentros de la comunidad J+."
      />

      <section className="mx-auto max-w-[1440px] px-14 py-16 max-md:px-5 max-md:py-10">
        {events.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="Sin eventos"
            description="No hay eventos programados por ahora. Vuelve pronto para ver las novedades."
          />
        ) : (
          <div className="flex flex-col gap-12">
            {/* Featured event */}
            {featured && (
              <FeaturedEvent
                event={featured}
                whatsappNumber={config?.whatsappNumber ?? ''}
              />
            )}

            {/* Upcoming events grid */}
            {upcoming.length > 0 && (
              <div>
                <SectionHeader
                  label="PRÓXIMOS"
                  title="Más eventos"
                  className="mb-8"
                />
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
