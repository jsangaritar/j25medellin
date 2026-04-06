import { cn } from '@/lib/utils';
import type { CalendarDay } from '@/utils/calendar';
import { formatDayNumber } from '@/utils/dates';

interface CalendarCellProps {
  day: CalendarDay;
  isToday: boolean;
}

export function CalendarCell({ day, isToday }: CalendarCellProps) {
  const hasEvents = day.events.length > 0;

  return (
    <div
      className={cn(
        'flex h-12 flex-col items-center justify-center rounded-lg text-sm max-md:h-10 max-md:text-xs',
        !day.isCurrentMonth && 'text-text-dim',
        day.isCurrentMonth && !hasEvents && 'text-text-muted',
        day.isCurrentMonth && hasEvents && 'text-text-primary',
        isToday && 'bg-bg-elevated font-semibold',
      )}
    >
      <span>{formatDayNumber(day.date)}</span>
      {hasEvents && (
        <div className="mt-0.5 flex gap-0.5">
          {day.events.slice(0, 3).map((event) => (
            <span
              key={event.id}
              className="size-1 rounded-full bg-accent-bright"
            />
          ))}
        </div>
      )}
    </div>
  );
}
