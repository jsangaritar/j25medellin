import { UserPlus } from 'lucide-react';
import type { Course } from '../../../types';
import { getStrapiMediaUrl } from '../../../utils/media';

interface CourseCardProps {
  course: Course;
  onRegister?: (course: Course) => void;
}

export function CourseCard({ course, onRegister }: CourseCardProps) {
  const imageUrl = getStrapiMediaUrl(course.image);
  const color = course.accentColor ?? '#4ADE80';
  const canRegister = course.status === 'ACTIVE' && !!onRegister;
  const enrolled = course.enrolled ?? 0;
  const capacity = course.capacity ?? 0;
  const hasProgress = capacity > 0 && course.enrolled != null;
  const progressPct =
    capacity > 0 ? Math.round((enrolled / capacity) * 100) : 0;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-bg-card lg:rounded-[14px]">
      {imageUrl && (
        <div className="h-[140px] w-full overflow-hidden lg:h-[160px]">
          <img
            src={imageUrl}
            alt={course.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2.5 p-4 lg:gap-3 lg:p-5">
        {/* Line tag */}
        {course.lineNumber != null && (
          <span
            className="inline-flex items-center gap-1.5 self-start font-body text-[9px] font-bold tracking-wider lg:text-[10px]"
            style={{ color }}
          >
            <span
              className="h-[5px] w-[5px] rounded-full"
              style={{ backgroundColor: color }}
            />
            {`LÍNEA ${course.lineNumber}`}
          </span>
        )}

        {/* Title */}
        <h3 className="font-display text-[15px] font-bold text-text-primary lg:text-[17px]">
          {course.title}
        </h3>

        {/* Description */}
        {course.description && (
          <p className="line-clamp-3 font-body text-[12px] leading-[1.5] text-text-secondary lg:text-[13px]">
            {course.description}
          </p>
        )}

        {/* Schedule & duration */}
        {course.schedule && (
          <p className="font-body text-[11px] text-text-muted">
            Duración: 3 meses · {course.schedule}
          </p>
        )}

        {/* Progress bar */}
        {hasProgress && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between font-body text-[11px] text-text-muted">
              <span>
                {course.enrolled}/{course.capacity} inscritos
              </span>
              <span>{progressPct}%</span>
            </div>
            <div className="h-[3px] w-full overflow-hidden rounded-full bg-border lg:h-1">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${progressPct}%`, backgroundColor: color }}
              />
            </div>
          </div>
        )}

        {/* Register button */}
        {canRegister && (
          <button
            type="button"
            onClick={() => onRegister(course)}
            className="mt-auto flex w-full items-center justify-center gap-1.5 rounded-[10px] py-2.5 font-body text-xs font-semibold text-bg-primary transition-colors hover:opacity-90"
            style={{ backgroundColor: color }}
          >
            <UserPlus size={14} />
            Inscribirse
          </button>
        )}
      </div>
    </article>
  );
}
