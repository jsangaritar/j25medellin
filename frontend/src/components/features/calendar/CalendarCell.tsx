import type { CalendarEvent } from "../../../types";

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
			<div className="flex h-[72px] w-full flex-col items-center gap-1 p-2 md:h-[48px]" />
		);
	}

	return (
		<div className="flex h-[72px] w-full flex-col items-center gap-1 p-2 md:h-[48px]">
			{isToday ? (
				<span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-bright font-body text-[13px] font-medium text-bg-primary md:h-6 md:w-6 md:text-xs">
					{day}
				</span>
			) : (
				<span
					className={`font-body text-[13px] font-medium md:text-xs ${
						isCurrentMonth ? "text-text-primary" : "text-text-dim"
					}`}
				>
					{day}
				</span>
			)}
			{/* Desktop: event chip */}
			{events.length > 0 && !isToday && (
				<div className="hidden w-full rounded-lg px-2 py-1 md:block">
					<div
						className="h-1.5 w-1.5 rounded-full"
						style={{ backgroundColor: "#4ADE80" }}
					/>
				</div>
			)}
			{/* Mobile: event dot */}
			{events.length > 0 && !isToday && (
				<div className="h-1.5 w-1.5 rounded-full bg-accent-bright md:hidden" />
			)}
		</div>
	);
}
