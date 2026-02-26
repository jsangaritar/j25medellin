import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export function formatDate(dateString: string, pattern = "d 'de' MMMM, yyyy") {
	return format(parseISO(dateString), pattern, { locale: es });
}

export function formatShortDate(dateString: string) {
	return format(parseISO(dateString), "d MMM", { locale: es });
}

export function formatDay(date: Date) {
	return format(date, "d", { locale: es });
}

export function formatMonthYear(date: Date) {
	return format(date, "MMMM yyyy", { locale: es });
}
