import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { CalendarEvent } from '../../../types';
import {
  buildCalendarGrid,
  getNextMonth,
  getPrevMonth,
  WEEKDAY_LABELS,
} from '../../../utils/calendar';
import { formatMonthYear } from '../../../utils/dates';
import { CalendarCell } from './CalendarCell';

interface MonthlyCalendarProps {
  events: CalendarEvent[];
}

export function MonthlyCalendar({ events }: MonthlyCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());

  const grid = useMemo(
    () => buildCalendarGrid(currentMonth, events),
    [currentMonth, events],
  );

  const monthLabel = formatMonthYear(currentMonth);
  const capitalizedLabel =
    monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

  // Group grid into weeks of 7
  const weeks: (typeof grid)[] = [];
  for (let i = 0; i < grid.length; i += 7) {
    weeks.push(grid.slice(i, i + 7));
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header — outside the card */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-bright" />
            <span className="font-body text-[10px] font-bold tracking-[2px] text-accent-bright lg:text-[11px]">
              CALENDARIO
            </span>
          </div>
          {/* Month title — visible on md+ */}
          <h3 className="hidden font-display text-[22px] font-bold tracking-[-0.3px] text-text-primary md:block lg:text-[28px] lg:tracking-[-0.5px]">
            {capitalizedLabel}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentMonth(getPrevMonth(currentMonth))}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-bg-card text-text-secondary hover:bg-bg-elevated lg:h-9 lg:w-9"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => setCurrentMonth(getNextMonth(currentMonth))}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-bg-card text-text-secondary hover:bg-bg-elevated lg:h-9 lg:w-9"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Mobile: month title below tag, above card */}
      <h3 className="-mt-2 font-display text-[22px] font-bold tracking-[-0.3px] text-text-primary md:hidden">
        {capitalizedLabel}
      </h3>

      {/* Calendar card */}
      <div className="overflow-hidden rounded-[14px] border border-border bg-bg-card">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-border py-2.5 lg:py-3">
          {WEEKDAY_LABELS.map((label) => (
            <span
              key={label}
              className="text-center font-body text-[10px] font-bold tracking-[1px] text-text-muted"
            >
              {label}
            </span>
          ))}
        </div>

        {/* Week rows */}
        {weeks.map((week, weekIndex) => (
          <div
            key={week[0].date.toISOString()}
            className={`grid grid-cols-7 ${weekIndex < weeks.length - 1 ? 'border-b border-border' : ''}`}
          >
            {week.map((day) => {
              const dayNum = day.isCurrentMonth ? day.date.getDate() : null;
              return (
                <CalendarCell
                  key={day.date.toISOString()}
                  day={dayNum}
                  isCurrentMonth={day.isCurrentMonth}
                  isToday={day.isToday}
                  events={day.events}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
