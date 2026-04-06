import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import type { CalendarEvent } from '@/types';

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  events: CalendarEvent[];
}

export function buildCalendarGrid(
  month: Date,
  events: CalendarEvent[],
): CalendarDay[] {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  return days.map((date) => ({
    date,
    isCurrentMonth: isSameMonth(date, month),
    events: events.filter((event) => {
      const eventStart = new Date(event.start);
      return isSameDay(date, eventStart);
    }),
  }));
}

export function getPreviousMonth(date: Date): Date {
  return subMonths(date, 1);
}

export function getNextMonth(date: Date): Date {
  return addMonths(date, 1);
}
