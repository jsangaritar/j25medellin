import {
	addMonths,
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	isSameDay,
	isSameMonth,
	parseISO,
	startOfMonth,
	startOfWeek,
	subMonths,
} from "date-fns";
import type { CalendarEvent } from "../types";

export interface CalendarDay {
	date: Date;
	isCurrentMonth: boolean;
	isToday: boolean;
	events: CalendarEvent[];
}

/**
 * Build the 6-row calendar grid for a given month.
 * Weeks start on Monday (weekStartsOn: 1).
 */
export function buildCalendarGrid(
	month: Date,
	events: CalendarEvent[],
): CalendarDay[] {
	const today = new Date();
	const monthStart = startOfMonth(month);
	const monthEnd = endOfMonth(month);
	const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
	const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

	const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

	return days.map((date) => ({
		date,
		isCurrentMonth: isSameMonth(date, month),
		isToday: isSameDay(date, today),
		events: events.filter((event) => {
			const eventDate = parseISO(event.start);
			return isSameDay(eventDate, date);
		}),
	}));
}

export function getNextMonth(date: Date) {
	return addMonths(date, 1);
}

export function getPrevMonth(date: Date) {
	return subMonths(date, 1);
}

export const WEEKDAY_LABELS = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];
