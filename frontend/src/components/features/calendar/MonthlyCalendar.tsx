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

const MOBILE_WEEKDAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

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

  return (
    <div className="overflow-hidden rounded-[14px] border border-border bg-bg-card">
      {/* Header */}
      <div className="flex items-end justify-between px-4 pt-4 md:px-0 md:pt-0">
        <div className="flex flex-col gap-1.5">
          {/* Label tag */}
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-bright" />
            <span className="font-body text-[10px] font-bold tracking-[2px] text-accent-bright lg:text-[11px]">
              CALENDARIO
            </span>
          </div>
          <h3 className="font-display text-[22px] font-bold tracking-[-0.3px] text-text-primary lg:text-[28px] lg:tracking-[-0.5px]">
            {capitalizedLabel}
          </h3>
        </div>
        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentMonth(getPrevMonth(currentMonth))}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-bg-card text-text-secondary hover:bg-bg-elevated lg:h-9 lg:w-9"
          >
            <ChevronLeft size={14} className="lg:hidden" />
            <ChevronLeft size={16} className="hidden lg:block" />
          </button>
          {/* Mobile month label between arrows */}
          <span className="font-body text-[13px] font-semibold text-text-primary md:hidden">
            {capitalizedLabel}
          </span>
          <button
            type="button"
            onClick={() => setCurrentMonth(getNextMonth(currentMonth))}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-bg-card text-text-secondary hover:bg-bg-elevated lg:h-9 lg:w-9"
          >
            <ChevronRight size={14} className="lg:hidden" />
            <ChevronRight size={16} className="hidden lg:block" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="mt-4 grid grid-cols-7 border-b border-border px-0 py-2.5 lg:py-3">
        {WEEKDAY_LABELS.map((label) => (
          <span
            key={label}
            className="hidden text-center font-body text-[10px] font-bold tracking-[1px] text-text-muted lg:block"
          >
            {label}
          </span>
        ))}
        {MOBILE_WEEKDAY_LABELS.map((label, i) => (
          <span
            key={`m-${WEEKDAY_LABELS[i]}`}
            className="text-center font-body text-[11px] font-bold text-text-muted lg:hidden"
          >
            {label}
          </span>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {grid.map((day) => {
          const dayNum = day.isCurrentMonth ? day.date.getDate() : null;
          return (
            <div
              key={day.date.toISOString()}
              className="border-b border-border last:[&:nth-child(7n)]:border-b-0 last:[&:nth-child(7n-1)]:border-b-0 last:[&:nth-child(7n-2)]:border-b-0 last:[&:nth-child(7n-3)]:border-b-0 last:[&:nth-child(7n-4)]:border-b-0 last:[&:nth-child(7n-5)]:border-b-0 last:[&:nth-child(7n-6)]:border-b-0"
            >
              <CalendarCell
                day={dayNum}
                isCurrentMonth={day.isCurrentMonth}
                isToday={day.isToday}
                events={day.events}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
