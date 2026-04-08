import { BookOpen } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CourseCard } from '@/components/features/courses/CourseCard';
import { QuarterlyBanner } from '@/components/features/courses/QuarterlyBanner';
import { RegistrationModal } from '@/components/features/registration/RegistrationModal';
import { PageBanner } from '@/components/layout/PageBanner';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionHeader } from '@/components/ui/section-header';
import { Skeleton } from '@/components/ui/skeleton';
import { useAllCourseTopics } from '@/hooks/useCourses';
import { useEnrollments } from '@/hooks/useEnrollments';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import type { Course, Topic } from '@/types';

function isCurrentTopic(topic: Topic): boolean {
  const now = new Date();
  return new Date(topic.endDate) >= now;
}

export function DiscipuladosPage() {
  const { data: allTopics = [], isLoading } = useAllCourseTopics();
  const { data: config } = useSiteConfig();
  const [registerCourse, setRegisterCourse] = useState<Course | null>(null);

  const allCourseIds = useMemo(
    () => allTopics.flatMap((t) => (t.courses ?? []).map((c) => c.id)),
    [allTopics],
  );
  const { data: enrollments = new Map() } = useEnrollments(allCourseIds);

  const currentTopics = allTopics.filter(isCurrentTopic);
  const pastTopics = allTopics
    .filter((t) => !isCurrentTopic(t))
    .sort(
      (a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime(),
    );

  return (
    <>
      <PageBanner
        tag="DISCIPULADOS 25+"
        title="Discipulados"
        subtitle="Crece en tu fe a través de líneas de profundización con cupo limitado."
      />

      <section className="mx-auto max-w-[1440px] px-14 py-16 max-md:px-5 max-md:py-10">
        {isLoading ? (
          <div className="flex flex-col gap-10">
            <Skeleton className="h-[160px] rounded-2xl" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-[360px] rounded-xl" />
              ))}
            </div>
          </div>
        ) : allTopics.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Sin discipulados"
            description="No hay líneas de discipulado disponibles por ahora. Vuelve pronto."
          />
        ) : (
          <div className="flex flex-col gap-16">
            {/* Current topics */}
            {currentTopics.map((topic) => (
              <div key={topic.id} className="flex flex-col gap-10">
                <QuarterlyBanner topic={topic} />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {(topic.courses ?? []).map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      enrolled={enrollments.get(course.id) ?? 0}
                      whatsappNumber={config?.whatsappNumber ?? ''}
                      topicStartDate={topic.startDate}
                      onRegister={setRegisterCourse}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Past topics */}
            {pastTopics.length > 0 && (
              <div className="flex flex-col gap-10">
                <SectionHeader
                  label="ANTERIORES"
                  title="Discipulados anteriores"
                />
                {pastTopics.map((topic) => (
                  <div key={topic.id} className="flex flex-col gap-6">
                    <QuarterlyBanner topic={topic} />
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {(topic.courses ?? []).map((course) => (
                        <CourseCard
                          key={course.id}
                          course={course}
                          enrolled={enrollments.get(course.id) ?? 0}
                          whatsappNumber={config?.whatsappNumber ?? ''}
                          topicStartDate={topic.startDate}
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
