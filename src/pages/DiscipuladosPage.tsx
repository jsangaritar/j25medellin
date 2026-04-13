import { BookOpen } from 'lucide-react';
import { useState } from 'react';
import { CourseCard } from '@/components/features/courses/CourseCard';
import { QuarterlyBanner } from '@/components/features/courses/QuarterlyBanner';
import { RegistrationModal } from '@/components/features/registration/RegistrationModal';
import { PageBanner } from '@/components/layout/PageBanner';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionHeader } from '@/components/ui/section-header';
import { Skeleton } from '@/components/ui/skeleton';
import { useAllCourseTopics } from '@/hooks/useCourses';
import type { Course } from '@/types';

export function DiscipuladosPage() {
  const { data: allTopics = [], isLoading } = useAllCourseTopics();
  const [registerCourse, setRegisterCourse] = useState<Course | null>(null);

  const activeTopics = allTopics.filter((t) => t.status === 'ACTIVE');
  const comingSoonTopics = allTopics.filter((t) => t.status === 'COMING_SOON');
  const completedTopics = allTopics
    .filter((t) => t.status === 'COMPLETED')
    .sort(
      (a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime(),
    );

  const visibleCount =
    activeTopics.length + comingSoonTopics.length + completedTopics.length;

  return (
    <>
      <PageBanner
        title="Discipulados"
        subtitle="Crece en tu fe a través de líneas de profundización con cupo limitado."
      />

      <section className="mx-auto max-w-[1440px] px-14 py-16 max-md:px-5 max-md:py-10">
        {isLoading ? (
          <div className="flex flex-col gap-10">
            <Skeleton className="h-[160px] rounded-2xl" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={`skel-${i}`} className="h-[360px] rounded-xl" />
              ))}
            </div>
          </div>
        ) : visibleCount === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Sin discipulados"
            description="No hay líneas de discipulado disponibles por ahora. Vuelve pronto."
          />
        ) : (
          <div className="flex flex-col gap-16">
            {/* Active topics */}
            {activeTopics.map((topic) => (
              <div key={topic.id} className="flex flex-col gap-10">
                <QuarterlyBanner topic={topic} />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {(topic.courses ?? []).map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      enrolled={course.enrolled ?? 0}
                      topicStatus={topic.status}
                      onRegister={setRegisterCourse}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Coming soon topics */}
            {comingSoonTopics.length > 0 && (
              <div className="flex flex-col gap-10">
                <SectionHeader label="PRÓXIMOS" title="Próximos discipulados" />
                {comingSoonTopics.map((topic) => (
                  <div key={topic.id} className="flex flex-col gap-6">
                    <QuarterlyBanner topic={topic} />
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {(topic.courses ?? []).map((course) => (
                        <CourseCard
                          key={course.id}
                          course={course}
                          topicStatus={topic.status}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Completed topics */}
            {completedTopics.length > 0 && (
              <div className="flex flex-col gap-10">
                <SectionHeader
                  label="ANTERIORES"
                  title="Discipulados anteriores"
                />
                {completedTopics.map((topic) => (
                  <div key={topic.id} className="flex flex-col gap-6">
                    <QuarterlyBanner topic={topic} />
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {(topic.courses ?? []).map((course) => (
                        <CourseCard
                          key={course.id}
                          course={course}
                          topicStatus={topic.status}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
