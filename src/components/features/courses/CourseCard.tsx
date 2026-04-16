import { CheckCircle, Clock, Users, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tag } from '@/components/ui/tag';
import type { Course, CourseStatus } from '@/types';

interface CourseCardProps {
  course: Course;
  enrolled?: number;
  topicStatus?: CourseStatus;
  onRegister?: (course: Course) => void;
}

export function CourseCard({
  course,
  enrolled = 0,
  topicStatus,
  onRegister,
}: CourseCardProps) {
  const progress =
    course.capacity && enrolled ? (enrolled / course.capacity) * 100 : 0;

  const isActive = topicStatus === 'ACTIVE';
  const isComingSoon = topicStatus === 'COMING_SOON';
  const isCompleted = topicStatus === 'COMPLETED';
  const isFull = course.capacity != null && enrolled >= course.capacity;

  return (
    <div className="flex flex-col rounded-xl border border-border-light bg-bg-card">
      {/* Accent bar */}
      <div
        className="h-1 rounded-t-xl"
        style={{ backgroundColor: course.accentColor ?? '#4ADE80' }}
      />

      <div className="flex flex-1 flex-col gap-4 p-5">
        {/* Tags */}
        {course.tags.length > 0 && (
          <div className="flex gap-1.5">
            {course.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}

        {/* Title + description */}
        <div>
          <h3
            className="mb-1.5 font-display text-base font-bold"
            style={{ color: course.accentColor ?? '#4ADE80' }}
          >
            {course.title}
          </h3>
          <p className="whitespace-pre-line text-sm text-text-secondary">
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
        {isActive && course.capacity && (
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
          {isCompleted ? (
            <div className="flex w-full items-center justify-center gap-2 rounded-[10px] border border-border bg-bg-elevated px-4 py-3 font-body text-sm font-medium text-text-muted">
              <CheckCircle className="size-4" />
              Completado
            </div>
          ) : isComingSoon ? (
            <div className="flex w-full items-center justify-center gap-2 rounded-[10px] border border-border bg-bg-elevated px-4 py-3 font-body text-sm font-medium text-text-muted">
              <Clock className="size-4" />
              Próximamente
            </div>
          ) : isFull ? (
            <div className="flex w-full items-center justify-center gap-2 rounded-[10px] border border-border bg-bg-elevated px-4 py-3 font-body text-sm font-medium text-text-muted">
              <UserX className="size-4" />
              Cupos completos
            </div>
          ) : (
            <Button
              className="w-full rounded-[10px] py-3"
              style={{ backgroundColor: course.accentColor ?? '#4ADE80' }}
              onClick={() => onRegister?.(course)}
            >
              Inscribirse
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
