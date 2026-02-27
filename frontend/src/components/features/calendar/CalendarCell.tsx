import type { CalendarEvent } from '../../../types';

const PILL_COLORS = [
  { bg: 'rgba(74, 222, 128, 0.1)', text: '#4ADE80' },
  { bg: 'rgba(245, 158, 11, 0.1)', text: '#F59E0B' },
];

interface CalendarCellProps {
  day: number | null;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

export function CalendarCell({
  day,
  isCurrentMonth,
  isToday,
  events,
}: CalendarCellProps) {
  if (day === null) {
    return (
      <div className="flex h-[56px] w-full flex-col items-center gap-1 py-2 lg:h-[72px] lg:items-stretch lg:px-0" />
    );
  }

  return (
    <div className="flex h-[56px] w-full flex-col items-center gap-1 py-2 lg:h-[72px] lg:gap-1 lg:px-1">
      {isToday ? (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-bright font-body text-[13px] font-medium text-bg-primary lg:h-7 lg:w-7">
          {day}
        </span>
      ) : (
        <span
          className={`font-body text-[13px] font-medium ${
            isCurrentMonth ? 'text-text-primary' : 'text-text-dim'
          }`}
        >
          {day}
        </span>
      )}

      {/* Mobile: dot indicator */}
      {events.length > 0 && (
        <div className="h-1.5 w-1.5 rounded-full bg-accent-bright lg:hidden" />
      )}

      {/* Desktop: pill badges with event title */}
      {events.length > 0 && (
        <div className="hidden w-full flex-col gap-0.5 lg:flex">
          {events.slice(0, 2).map((event, i) => {
            const color = PILL_COLORS[i % PILL_COLORS.length];
            return (
              <div
                key={event.id}
                className="w-full truncate rounded-lg px-2 py-1 font-body text-[11px] font-bold leading-tight"
                style={{ backgroundColor: color.bg, color: color.text }}
              >
                {event.title}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
