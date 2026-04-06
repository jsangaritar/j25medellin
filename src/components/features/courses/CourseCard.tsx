import { Clock, MessageCircle, PlayCircle, Users, UserX } from 'lucide-react';
import { Tag } from '@/components/ui/tag';
import type { Course } from '@/types';
import { buildWhatsAppUrl } from '@/utils/whatsapp';

interface CourseCardProps {
  course: Course;
  enrolled?: number;
  whatsappNumber: string;
  topicStartDate?: string;
  onRegister?: (course: Course) => void;
}

export function CourseCard({
  course,
  enrolled = 0,
  whatsappNumber,
  topicStartDate,
  onRegister,
}: CourseCardProps) {
  const progress =
    course.capacity && enrolled ? (enrolled / course.capacity) * 100 : 0;

  const startDate = course.startDate ?? topicStartDate;
  const hasStarted = startDate ? new Date(startDate) <= new Date() : false;
  const isFull = course.capacity != null && enrolled >= course.capacity;

  return (
    <div className="flex flex-col rounded-xl border border-border-light bg-bg-card">
      {/* Line accent bar */}
      <div
        className="h-1 rounded-t-xl"
        style={{ backgroundColor: course.accentColor ?? '#4ADE80' }}
      />

      <div className="flex flex-1 flex-col gap-4 p-5">
        {/* Line number + tags */}
        <div className="flex items-center justify-between">
          {course.lineNumber && (
            <span
              className="flex size-8 items-center justify-center rounded-lg font-display text-sm font-bold"
              style={{
                backgroundColor: `${course.accentColor ?? '#4ADE80'}1A`,
                color: course.accentColor ?? '#4ADE80',
              }}
            >
              {course.lineNumber}
            </span>
          )}
          <div className="flex gap-1.5">
            {course.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </div>

        {/* Title + description */}
        <div>
          <h3 className="mb-1.5 font-body text-base font-semibold text-text-primary">
            {course.title}
          </h3>
          <p className="line-clamp-2 text-sm text-text-secondary">
            {course.description}
          </p>
        </div>

        {/* Schedule */}
        {course.schedule && (
          <span className="flex items-center gap-1.5 text-xs text-text-muted">
            <Clock className="size-3.5" />
            {course.schedule}
          </span>
        )}

        {/* Capacity bar */}
        {course.capacity && (
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs text-text-muted">
                <Users className="size-3.5" />
                {enrolled}/{course.capacity} cupos
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-bg-elevated">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(progress, 100)}%`,
                  backgroundColor: course.accentColor ?? '#4ADE80',
                }}
              />
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto pt-1">
          {hasStarted ? (
            <div className="flex w-full items-center justify-center gap-2 rounded-[10px] border border-border bg-bg-elevated px-4 py-3 font-body text-sm font-medium text-text-muted">
              <PlayCircle className="size-4" />
              En curso
            </div>
          ) : isFull ? (
            <div className="flex w-full items-center justify-center gap-2 rounded-[10px] border border-border bg-bg-elevated px-4 py-3 font-body text-sm font-medium text-text-muted">
              <UserX className="size-4" />
              Cupos completos
            </div>
          ) : onRegister ? (
            <button
              type="button"
              onClick={() => onRegister(course)}
              className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-accent-bright px-4 py-3 font-body text-sm font-semibold text-bg-primary transition-opacity hover:opacity-90"
            >
              Inscribirse
            </button>
          ) : (
            <a
              href={buildWhatsAppUrl(whatsappNumber, course.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-accent-bright px-4 py-3 font-body text-sm font-semibold text-bg-primary transition-opacity hover:opacity-90"
            >
              <MessageCircle className="size-4" />
              Inscribirse
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
