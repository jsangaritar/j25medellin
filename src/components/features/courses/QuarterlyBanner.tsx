import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Info, MapPin } from 'lucide-react';
import { CourseCard } from '@/components/features/courses/CourseCard';
import type { Course, Topic } from '@/types';
import { capitalizeFirst } from '@/utils/dates';

interface QuarterlyBannerProps {
  topic: Topic;
  onRegister?: (course: Course) => void;
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

export function QuarterlyBanner({ topic, onRegister }: QuarterlyBannerProps) {
  const courses = topic.courses ?? [];
  const showNotice =
    topic.status === 'ACTIVE' || topic.status === 'COMING_SOON';
  const modalityLabel = [topic.modality, topic.location]
    .filter(Boolean)
    .join(' en ');

  return (
    <div className="rounded-2xl border border-border-light bg-bg-surface p-8 max-md:p-5">
      {/* Tag */}
      <div className="mb-3 flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-accent-bright" />
        <span className="font-body text-xs font-semibold uppercase tracking-wider text-accent-bright">
          {topic.tag}
        </span>
      </div>

      {/* Title */}
      <h2 className="mb-2 font-display text-2xl font-bold text-text-primary lg:text-3xl">
        {topic.title}
      </h2>

      {/* Metadata row: dates + modality */}
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {topic.startDate && topic.endDate && (
          <span className="flex items-center gap-1.5 font-body text-xs font-medium text-text-muted">
            <Calendar className="size-3.5" />
            {formatDateRange(topic.startDate, topic.endDate)}
          </span>
        )}
        {modalityLabel && (
          <span className="flex items-center gap-1.5 font-body text-xs font-medium text-text-muted">
            <MapPin className="size-3.5" />
            {modalityLabel}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="whitespace-pre-line font-body text-sm leading-relaxed text-text-secondary">
        {topic.description}
      </p>

      {/* "Choose one" notice */}
      {showNotice && courses.length > 1 && (
        <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-accent-bright/20 bg-accent-bright/5 px-4 py-3">
          <Info className="mt-0.5 size-4 shrink-0 text-accent-bright" />
          <p className="font-body text-xs leading-relaxed text-text-secondary">
            Solo puedes elegir{' '}
            <span className="font-semibold text-text-primary">un curso</span>{' '}
            por la duración del discipulado.
          </p>
        </div>
      )}

      {/* Embedded course cards */}
      {courses.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              enrolled={course.enrolled ?? 0}
              topicStatus={topic.status}
              onRegister={onRegister}
            />
          ))}
        </div>
      )}
    </div>
  );
}
