import { CalendarDays, Clock, MapPin } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionHeader } from '@/components/ui/section-header';
import type { CalendarEvent } from '@/types';
import { isUpcoming } from '@/utils/dates';

interface UpcomingHighlightsProps {
  events: CalendarEvent[];
}

export function UpcomingHighlights({ events }: UpcomingHighlightsProps) {
  const upcoming = events
    .filter((e) => isUpcoming(e.start))
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 4);

  return (
    <div>
      <SectionHeader
        label="Próximamente"
        title="Próximos eventos"
        className="mb-6"
      />

      {upcoming.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Sin eventos próximos"
          description="No hay eventos programados por ahora. Vuelve pronto."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {upcoming.map((event) => {
            const date = new Date(event.start);
            const dayName = date.toLocaleDateString('es-CO', {
              weekday: 'long',
            });
            const time = date.toLocaleTimeString('es-CO', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            });

            return (
              <div
                key={event.id}
                className="flex gap-4 rounded-xl border border-border-light bg-bg-card p-4"
              >
                <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-lg bg-bg-elevated">
                  <span className="font-display text-lg font-bold leading-none text-text-primary">
                    {date.getDate()}
                  </span>
                  <span className="text-[10px] uppercase text-text-muted">
                    {date.toLocaleDateString('es-CO', { month: 'short' })}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate font-body text-sm font-semibold text-text-primary">
                    {event.title}
                  </h4>
                  <div className="mt-1 flex items-center gap-3 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {capitalizeFirst(dayName)} · {time}
                    </span>
                    {event.description && (
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3" />
                        {event.description}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
