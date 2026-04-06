import { format, isAfter } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatMonthYear(date: Date): string {
  return format(date, 'MMMM yyyy', { locale: es });
}

export function formatEventDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, "d 'de' MMMM, yyyy", { locale: es });
}

export function formatEventTime(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'h:mm a', { locale: es });
}

export function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'EEE · h:mm a · d MMM', { locale: es });
}

export function formatDayNumber(date: Date): string {
  return format(date, 'd');
}

export function isUpcoming(dateString: string): boolean {
  return isAfter(new Date(dateString), new Date());
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
