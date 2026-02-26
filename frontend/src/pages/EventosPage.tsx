import { EventCard } from '../components/features/events/EventCard';
import { FeaturedEvent } from '../components/features/events/FeaturedEvent';
import { PageBanner } from '../components/layout/PageBanner';
import { useEvents, useFeaturedEvents } from '../hooks/useEvents';
import { useSiteConfig } from '../hooks/useSiteConfig';

export function EventosPage() {
  const { data: config } = useSiteConfig();
  const { data: featuredEvents } = useFeaturedEvents();
  const { data: events, isLoading } = useEvents();

  const featured = featuredEvents?.[0];
  const upcomingEvents = events?.filter((e) => !e.featured) ?? [];

  return (
    <>
      <PageBanner
        tag="EVENTOS"
        title="Eventos"
        subtitle="Conferencias, retiros, talleres y encuentros de comunidad."
      />

      {/* Featured event */}
      {featured && (
        <FeaturedEvent
          event={featured}
          whatsappNumber={config?.whatsappNumber}
        />
      )}

      {/* Upcoming events grid */}
      <section className="px-5 py-8 md:px-10 md:py-10 lg:px-14 lg:py-12">
        <h3 className="mb-6 font-display text-[22px] font-bold tracking-[-0.3px] text-text-primary lg:mb-8">
          Próximos Eventos
        </h3>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-[300px] animate-pulse rounded-2xl bg-bg-card"
              />
            ))}
          </div>
        ) : upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center font-body text-text-muted">
            No hay eventos próximos por el momento.
          </p>
        )}
      </section>
    </>
  );
}
