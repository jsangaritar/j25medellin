import { Clock, MapPin } from "lucide-react";
import type React from "react";
import { forwardRef, useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import type { Event } from "@/types";
import type { CalendarDay } from "@/utils/calendar";
import {
  capitalizeFirst,
  formatDayNumber,
  formatEventTime,
} from "@/utils/dates";

interface CalendarCellProps {
  day: CalendarDay;
  isToday: boolean;
}

function EventDetailsContent({ day }: { day: CalendarDay }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-body text-xs font-medium uppercase tracking-wider text-text-muted">
        {capitalizeFirst(
          day.date.toLocaleDateString("es-CO", {
            weekday: "long",
            day: "numeric",
            month: "long",
          }),
        )}
      </p>
      <div className="flex flex-col gap-2">
        {day.events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  const type = event.eventType ?? "j+";
  const isJPlus = type === "j+";

  return (
    <div className="flex gap-3 rounded-lg border border-border bg-[#2a2a2a] p-3">
      <div
        className={cn(
          "mt-0.5 w-0.5 shrink-0 self-stretch rounded-full",
          isJPlus ? "bg-accent-bright" : "bg-text-muted",
        )}
      />
      <div className="min-w-0 flex-1">
        {isJPlus && event.imageUrl && (
          <div className="mb-2 aspect-[16/9]">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="h-full w-full rounded object-cover"
            />
          </div>
        )}
        <p className="font-body text-sm font-semibold text-text-primary">
          {event.title}
        </p>
        <div className="mt-1.5 flex flex-col gap-1">
          <span className="flex items-center gap-1.5 text-xs text-text-muted">
            <Clock
              className={cn(
                "size-3 shrink-0",
                isJPlus ? "text-accent-muted" : "text-text-dim",
              )}
            />
            {formatEventTime(event.date)}
            {event.endDate && ` – ${formatEventTime(event.endDate)}`}
          </span>
          {event.location && (
            <span className="flex items-center gap-1.5 text-xs text-text-muted">
              <MapPin
                className={cn(
                  "size-3 shrink-0",
                  isJPlus ? "text-accent-muted" : "text-text-dim",
                )}
              />
              <span className="truncate">{event.location}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

const CellContent = forwardRef<
  HTMLDivElement | HTMLButtonElement,
  {
    day: CalendarDay;
    isToday: boolean;
    hasEvents: boolean;
    onClick?: () => void;
  } & React.ComponentPropsWithoutRef<"div">
>(function CellContent({ day, isToday, hasEvents, onClick, ...rest }, ref) {
  const classes = cn(
    "group flex h-12 flex-col items-center justify-center rounded-lg text-sm transition-all duration-200 max-md:h-10 max-md:text-xs",
    !day.isCurrentMonth && "text-text-dim",
    day.isCurrentMonth && !hasEvents && "text-text-muted",
    day.isCurrentMonth &&
      hasEvents &&
      "cursor-pointer border border-transparent text-text-primary hover:border-border hover:bg-bg-elevated",
    isToday && "bg-bg-elevated font-semibold",
    isToday && hasEvents && "hover:ring-1 hover:ring-accent-bright/30",
    hasEvents && "active:scale-95 active:bg-bg-elevated",
  );

  const inner = (
    <>
      <span
        className={cn(
          hasEvents &&
            "transition-colors duration-200 group-hover:text-accent-bright",
        )}
      >
        {formatDayNumber(day.date)}
      </span>
      {hasEvents && (
        <div className="mt-0.5 flex gap-0.5 transition-transform duration-200 group-hover:scale-150">
          {day.events.slice(0, 3).map((event) => (
            <span
              key={event.id}
              className={cn(
                "size-1 rounded-full transition-colors duration-200",
                (event.eventType ?? "j+") === "j+"
                  ? "bg-accent-bright"
                  : "bg-text-muted",
              )}
            />
          ))}
        </div>
      )}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        onClick={onClick}
        {...(rest as React.ComponentPropsWithoutRef<"button">)}
      >
        {inner}
      </button>
    );
  }

  return (
    <div ref={ref as React.Ref<HTMLDivElement>} className={classes} {...rest}>
      {inner}
    </div>
  );
});

export function CalendarCell({ day, isToday }: CalendarCellProps) {
  const hasEvents = day.events.length > 0;
  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);

  if (!hasEvents) {
    return <CellContent day={day} isToday={isToday} hasEvents={false} />;
  }

  if (isMobile) {
    return (
      <>
        <CellContent
          day={day}
          isToday={isToday}
          hasEvents
          onClick={() => setSheetOpen(true)}
        />
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent
            side="bottom"
            className="rounded-t-2xl border-border bg-bg-elevated"
          >
            <SheetHeader>
              <SheetTitle className="text-text-primary">
                {capitalizeFirst(
                  day.date.toLocaleDateString("es-CO", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  }),
                )}
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-2 px-4 pb-6">
              {day.events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <HoverCard openDelay={200} closeDelay={150}>
      <HoverCardTrigger asChild>
        <CellContent day={day} isToday={isToday} hasEvents />
      </HoverCardTrigger>
      <HoverCardContent
        side="top"
        align="center"
        sideOffset={8}
        className="w-72 border-border bg-bg-elevated p-4 shadow-[0_8px_30px_rgba(0,0,0,0.5),0_0_1px_rgba(74,222,128,0.1)]"
      >
        <EventDetailsContent day={day} />
      </HoverCardContent>
    </HoverCard>
  );
}
