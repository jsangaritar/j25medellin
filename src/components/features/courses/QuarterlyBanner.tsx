import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "lucide-react";
import type { Topic } from "@/types";
import { capitalizeFirst } from "@/utils/dates";

interface QuarterlyBannerProps {
  topic: Topic;
}

function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const sameYear = start.getFullYear() === end.getFullYear();

  const startStr = capitalizeFirst(
    format(start, sameYear ? "d 'de' MMM" : "d 'de' MMM, yyyy", {
      locale: es,
    }),
  );
  const endStr = capitalizeFirst(
    format(end, "d 'de' MMM, yyyy", { locale: es }),
  );
  return `${startStr} — ${endStr}`;
}

export function QuarterlyBanner({ topic }: QuarterlyBannerProps) {
  return (
    <div className="rounded-2xl border border-border-light bg-bg-card p-8 max-md:p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-accent-bright" />
        <span className="font-body text-xs font-semibold uppercase tracking-wider text-accent-bright">
          {topic.tag}
        </span>
      </div>
      <div className="mb-4 flex flex-col gap-1">
        <h2 className="font-display text-2xl font-bold text-text-primary lg:text-3xl">
          {topic.title}
        </h2>
        {topic.startDate && topic.endDate && (
          <div className="flex items-center gap-1.5 ">
            <Calendar className="size-4" />
            <span className="font-body text-xs font-medium">
              {formatDateRange(topic.startDate, topic.endDate)}
            </span>
          </div>
        )}
      </div>
      <p className="whitespace-pre-line font-body text-sm leading-relaxed text-text-secondary">
        {topic.description}
      </p>
    </div>
  );
}
