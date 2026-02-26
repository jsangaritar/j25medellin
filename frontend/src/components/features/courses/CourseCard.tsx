import { UserPlus } from 'lucide-react';
import type { Course, CourseStatus } from '../../../types';

interface CourseCardProps {
  course: Course;
  onRegister?: (course: Course) => void;
}

const statusConfig: Record<
  CourseStatus,
  { label: string; color: string; bgColor: string }
> = {
  DRAFT: { label: 'Borrador', color: '#A78BFA', bgColor: '#7C3AED1A' },
  COMING_SOON: {
    label: 'Próximamente',
    color: '#FBBF24',
    bgColor: '#F59E0B1A',
  },
  ACTIVE: { label: 'Activo', color: '#4ADE80', bgColor: '#16A34A1A' },
  COMPLETED: { label: 'Completado', color: '#A78BFA', bgColor: '#7C3AED1A' },
  ARCHIVED: { label: 'Archivado', color: '#71717A', bgColor: '#3F3F461A' },
};

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:1337';

export function CourseCard({ course, onRegister }: CourseCardProps) {
  const imageUrl = course.image?.url
    ? `${API_BASE}${course.image.url}`
    : undefined;
  const config = statusConfig[course.status];
  const canRegister =
    (course.status === 'ACTIVE' || course.status === 'COMING_SOON') &&
    !!onRegister;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-bg-card lg:rounded-[14px]">
      {imageUrl && (
        <div className="h-[120px] w-full overflow-hidden lg:h-[160px]">
          <img
            src={imageUrl}
            alt={course.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-4 lg:p-5">
        {/* Tag */}
        <span
          className="inline-flex items-center gap-1.5 self-start rounded-xl px-2.5 py-1 font-body text-[10px] font-semibold"
          style={{ backgroundColor: config.bgColor, color: config.color }}
        >
          <span
            className="h-[5px] w-[5px] rounded-full"
            style={{ backgroundColor: config.color }}
          />
          {config.label.toUpperCase()}
        </span>

        {/* Title */}
        <h3 className="font-display text-[17px] font-bold text-text-primary">
          {course.title}
        </h3>

        {/* Description */}
        {course.description && (
          <p className="line-clamp-3 font-body text-[13px] leading-[1.5] text-text-secondary">
            {course.description}
          </p>
        )}

        {/* Schedule */}
        {course.schedule && (
          <p className="font-body text-[11px] text-text-muted">
            {course.schedule}
          </p>
        )}

        {/* Register button */}
        {canRegister && (
          <button
            type="button"
            onClick={() => onRegister(course)}
            className="mt-auto flex w-full items-center justify-center gap-1.5 rounded-[10px] py-2.5 font-body text-xs font-semibold text-bg-primary transition-colors hover:opacity-90"
            style={{ backgroundColor: config.color }}
          >
            <UserPlus size={14} />
            Inscribirse
          </button>
        )}
      </div>
    </article>
  );
}
