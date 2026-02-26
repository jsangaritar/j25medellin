import { useState } from 'react';
import { CourseCard } from '../components/features/courses/CourseCard';
import { RegistrationModal } from '../components/features/registration/RegistrationModal';
import { PageBanner } from '../components/layout/PageBanner';
import { useActiveCourses } from '../hooks/useCourses';
import type { Course } from '../types';

export function DiscipuladosPage() {
  const { data: courses, isLoading } = useActiveCourses();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  return (
    <>
      <PageBanner
        tag="DISCIPULADOS 25+"
        title="Discipulados"
        subtitle="Crece en tu fe a través de líneas de profundización con cupo limitado."
      />

      <section className="px-5 py-8 lg:px-14 lg:py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-[360px] animate-pulse rounded-xl bg-bg-card lg:rounded-[14px]"
              />
            ))}
          </div>
        ) : courses && courses.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onRegister={setSelectedCourse}
              />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center font-body text-text-muted">
            No hay discipulados disponibles por el momento.
          </p>
        )}
      </section>

      <RegistrationModal
        isOpen={!!selectedCourse}
        onClose={() => setSelectedCourse(null)}
        course={selectedCourse ?? undefined}
      />
    </>
  );
}
