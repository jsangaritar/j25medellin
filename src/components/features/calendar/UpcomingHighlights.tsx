import { CalendarDays } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionHeader } from '@/components/ui/section-header';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { Event } from '@/types';
import { isUpcoming } from '@/utils/dates';

interface UpcomingHighlightsProps {
  events: Event[];
  isLoading?: boolean;
}

export function UpcomingHighlights({
  events,
  isLoading = false,
}: UpcomingHighlightsProps) {
  const upcoming = events
    .filter((e) => isUpcoming(e.date))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  return (
    <div>
      <SectionHeader
        label="Próximamente"
        title="Próximos eventos"
        className="mb-6"
      />

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={`skel-${i}`} className="h-[76px] rounded-xl" />
          ))}
        </div>
      ) : upcoming.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Sin eventos próximos"
          description="No hay eventos programados por ahora. Vuelve pronto."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {upcoming.map((event) => {
            const date = new Date(event.date);
            const type = event.eventType ?? 'j+';
            const isJPlus = type === 'j+';
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
                className={cn(
                  'flex gap-4 rounded-xl border border-border-light bg-bg-card p-4',
                  isJPlus
                    ? 'border-l-2 border-l-accent-bright'
                    : 'border-l-2 border-l-text-muted',
                )}
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
                  <p className="mt-1 text-xs text-text-muted">
                    {capitalizeFirst(dayName)} · {time}
                    {event.location && ` · ${event.location}`}
                  </p>
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
