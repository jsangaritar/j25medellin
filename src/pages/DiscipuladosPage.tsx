import { BookOpen } from 'lucide-react';
import { useState } from 'react';
import { CourseCard } from '@/components/features/courses/CourseCard';
import { QuarterlyBanner } from '@/components/features/courses/QuarterlyBanner';
import { RegistrationModal } from '@/components/features/registration/RegistrationModal';
import { PageBanner } from '@/components/layout/PageBanner';
import { EmptyState } from '@/components/ui/empty-state';
import { useCourseTopic } from '@/hooks/useCourses';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import type { Course } from '@/types';

export function DiscipuladosPage() {
  const { data: topic } = useCourseTopic();
  const { data: config } = useSiteConfig();
  const [registerCourse, setRegisterCourse] = useState<Course | null>(null);

  const courses = topic?.courses ?? [];

  return (
    <>
      <PageBanner
        tag="DISCIPULADOS 25+"
        title="Discipulados"
        subtitle="Crece en tu fe a través de líneas de profundización con cupo limitado."
      />

      <section className="mx-auto max-w-[1440px] px-14 py-16 max-md:px-5 max-md:py-10">
        {!topic ? (
          <EmptyState
            icon={BookOpen}
            title="Sin discipulados activos"
            description="No hay líneas de discipulado abiertas por ahora. Vuelve pronto."
          />
        ) : (
          <div className="flex flex-col gap-10">
            <QuarterlyBanner topic={topic} />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  whatsappNumber={config?.whatsappNumber ?? ''}
                  onRegister={setRegisterCourse}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      <RegistrationModal
        open={registerCourse !== null}
        onOpenChange={(open) => {
          if (!open) setRegisterCourse(null);
        }}
        courseId={registerCourse?.id}
      />
    </>
  );
}
