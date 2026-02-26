import type { CalendarEvent } from '../../../types';

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
      <div className="flex h-[56px] w-full flex-col items-center gap-1 py-2 lg:h-[72px]" />
    );
  }

  return (
    <div className="flex h-[56px] w-full flex-col items-center gap-1 py-2 lg:h-[72px]">
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
      {events.length > 0 && !isToday && (
        <div className="h-1.5 w-1.5 rounded-full bg-accent-bright" />
      )}
    </div>
  );
}
