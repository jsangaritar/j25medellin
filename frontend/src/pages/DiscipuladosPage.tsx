import { useState } from 'react';
import { CourseCard } from '../components/features/courses/CourseCard';
import { QuarterlyBanner } from '../components/features/courses/QuarterlyBanner';
import { RegistrationModal } from '../components/features/registration/RegistrationModal';
import { PageBanner } from '../components/layout/PageBanner';
import { useCourseTopic } from '../hooks/useCourses';
import type { Course } from '../types';

export function DiscipuladosPage() {
  const { data: topic, isLoading } = useCourseTopic();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  return (
    <>
      <PageBanner
        tag="DISCIPULADOS 25+"
        title="Discipulados"
        subtitle="Crece en tu fe a través de líneas de profundización con cupo limitado."
      />

      <section className="flex flex-col gap-6 px-5 py-8 md:px-10 md:py-10 lg:gap-10 lg:px-14 lg:py-12">
        {isLoading ? (
          <>
            <div className="h-[140px] animate-pulse rounded-2xl bg-bg-card lg:h-[180px]" />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-[360px] animate-pulse rounded-2xl bg-bg-card"
                />
              ))}
            </div>
          </>
        ) : topic ? (
          <>
            <QuarterlyBanner topic={topic} />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
              {topic.courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onRegister={setSelectedCourse}
                />
              ))}
            </div>
          </>
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
