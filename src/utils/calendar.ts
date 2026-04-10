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
import type { Event } from '@/types';

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  events: Event[];
}

export function buildCalendarGrid(month: Date, events: Event[]): CalendarDay[] {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  return days.map((date) => ({
    date,
    isCurrentMonth: isSameMonth(date, month),
    events: events.filter((event) => {
      const eventDate = new Date(event.date);
      return isSameDay(date, eventDate);
    }),
  }));
}

export function getPreviousMonth(date: Date): Date {
  return subMonths(date, 1);
}

export function getNextMonth(date: Date): Date {
  return addMonths(date, 1);
}
