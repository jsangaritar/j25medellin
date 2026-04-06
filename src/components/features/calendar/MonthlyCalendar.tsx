import { isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { SectionHeader } from '@/components/ui/section-header';
import { Skeleton } from '@/components/ui/skeleton';
import type { CalendarEvent } from '@/types';
import {
  buildCalendarGrid,
  getNextMonth,
  getPreviousMonth,
} from '@/utils/calendar';
import { capitalizeFirst, formatMonthYear } from '@/utils/dates';
import { CalendarCell } from './CalendarCell';

const DAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

interface MonthlyCalendarProps {
  events: CalendarEvent[];
  isLoading?: boolean;
}

export function MonthlyCalendar({
  events,
  isLoading = false,
}: MonthlyCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();
  const grid = buildCalendarGrid(currentMonth, events);

  return (
    <div>
      {/* Header */}
      <div className="mb-10 flex items-end justify-between max-md:mb-6">
        <SectionHeader
          label="CALENDARIO"
          title={capitalizeFirst(formatMonthYear(currentMonth))}
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setCurrentMonth(getPreviousMonth(currentMonth))}
            className="flex size-10 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:border-text-muted hover:text-text-primary"
            aria-label="Mes anterior"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => setCurrentMonth(getNextMonth(currentMonth))}
            className="flex size-10 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:border-text-muted hover:text-text-primary"
            aria-label="Mes siguiente"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {DAY_LABELS.map((label) => (
          <div
            key={label}
            className="text-center font-body text-xs font-medium uppercase tracking-wider text-text-dim"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton key={`skel-${i}`} className="h-12 max-md:h-10" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {grid.map((day) => (
            <CalendarCell
              key={day.date.toISOString()}
              day={day}
              isToday={isSameDay(day.date, today)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
