import { ChevronRight } from 'lucide-react';
import type { CalendarEvent } from '../../../types';
import { formatShortDate } from '../../../utils/dates';

const COLOR_CYCLE = [
  { bg: 'rgba(74, 222, 128, 0.1)', text: '#4ADE80' },
  { bg: 'rgba(245, 158, 11, 0.1)', text: '#FBBF24' },
  { bg: 'rgba(124, 58, 237, 0.1)', text: '#A78BFA' },
];

interface UpcomingHighlightsProps {
  events: CalendarEvent[];
}

export function UpcomingHighlights({ events }: UpcomingHighlightsProps) {
  const upcoming = events
    .filter((e) => new Date(e.start) >= new Date())
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 3);

  if (upcoming.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      <h4 className="font-display text-base font-bold text-text-primary lg:hidden">
        Proximamente
      </h4>
      {upcoming.map((event, index) => {
        const color = COLOR_CYCLE[index % COLOR_CYCLE.length];
        const date = new Date(event.start);
        const day = date.getDate();
        const monthLabel = formatShortDate(event.start)
          .split(' ')
          .pop()
          ?.toUpperCase();

        return (
          <div
            key={event.id}
            className="flex items-center gap-3 rounded-xl border border-border bg-bg-card p-3.5 lg:gap-3.5 lg:p-4"
          >
            {/* Date badge */}
            <div
              className="flex h-[42px] w-[42px] flex-shrink-0 flex-col items-center justify-center rounded-[10px] lg:h-12 lg:w-12"
              style={{ backgroundColor: color.bg }}
            >
              <span
                className="font-display text-[15px] font-extrabold lg:text-lg"
                style={{ color: color.text }}
              >
                {day}
              </span>
              <span
                className="font-body text-[7px] font-bold tracking-[1px] lg:text-[8px]"
                style={{ color: color.text }}
              >
                {monthLabel}
              </span>
            </div>

            {/* Event info */}
            <div className="flex min-w-0 flex-1 flex-col gap-0.5 lg:gap-1">
              <span className="truncate font-body text-[13px] font-semibold text-text-primary lg:text-sm">
                {event.title}
              </span>
              <span className="truncate font-body text-[11px] text-text-muted lg:text-xs">
                {event.description ?? ''}
              </span>
            </div>

            {/* Arrow (mobile only) */}
            <ChevronRight
              size={14}
              className="flex-shrink-0 text-text-dim lg:hidden"
            />
          </div>
        );
      })}
    </div>
  );
}
