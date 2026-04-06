import { useMemo } from 'react';
import { MonthlyCalendar } from '@/components/features/calendar/MonthlyCalendar';
import { UpcomingHighlights } from '@/components/features/calendar/UpcomingHighlights';
import { HeroSection } from '@/components/features/hero/HeroSection';
import { useCalendar } from '@/hooks/useCalendar';
import { useCourseTopic } from '@/hooks/useCourses';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import type { CalendarEvent } from '@/types';

/**
 * Generate weekly calendar events from course schedules
 * within the topic date range, labeled as "La Mesa".
 */
function generateCourseCalendarEvents(
  courses: { id: string; title: string; schedule?: string }[],
  topicStart: string,
  topicEnd: string,
): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const dayMap: Record<string, number> = {
    lunes: 1,
    martes: 2,
    miércoles: 3,
    miercoles: 3,
    jueves: 4,
    viernes: 5,
    sábado: 6,
    sabado: 6,
    domingo: 0,
  };

  for (const course of courses) {
    if (!course.schedule) continue;

    // Parse "Martes 7:00 PM" style schedules
    const lower = course.schedule.toLowerCase();
    let dayOfWeek = -1;
    for (const [name, num] of Object.entries(dayMap)) {
      if (lower.includes(name)) {
        dayOfWeek = num;
        break;
      }
    }
    if (dayOfWeek === -1) continue;

    // Parse time
    const timeMatch = lower.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/);
    let hours = 19;
    let minutes = 0;
    if (timeMatch) {
      hours = Number.parseInt(timeMatch[1], 10);
      minutes = Number.parseInt(timeMatch[2], 10);
      if (timeMatch[3] === 'pm' && hours < 12) hours += 12;
      if (timeMatch[3] === 'am' && hours === 12) hours = 0;
    }

    // Generate weekly occurrences
    const start = new Date(topicStart);
    const end = new Date(topicEnd);
    const current = new Date(start);

    // Advance to first occurrence of this day
    while (current.getDay() !== dayOfWeek) {
      current.setDate(current.getDate() + 1);
    }

    while (current <= end) {
      const eventStart = new Date(current);
      eventStart.setHours(hours, minutes, 0, 0);
      const eventEnd = new Date(eventStart);
      eventEnd.setHours(hours + 1, minutes + 30, 0, 0);

      events.push({
        id: `course-${course.id}-${eventStart.toISOString()}`,
        title: `La Mesa: ${course.title}`,
        start: eventStart.toISOString(),
        end: eventEnd.toISOString(),
        description: course.schedule,
      });

      current.setDate(current.getDate() + 7);
    }
  }

  return events;
}

export function HomePage() {
  const { data: config, isLoading: configLoading } = useSiteConfig();
  const { data: calendarEvents = [], isLoading: calendarLoading } =
    useCalendar();
  const { data: topic } = useCourseTopic();

  const allEvents = useMemo(() => {
    const courseEvents =
      topic?.courses && topic.startDate && topic.endDate
        ? generateCourseCalendarEvents(
            topic.courses,
            topic.startDate,
            topic.endDate,
          )
        : [];
    return [...calendarEvents, ...courseEvents];
  }, [calendarEvents, topic]);

  const isCalendarLoading = calendarLoading;

  return (
    <>
      <HeroSection
        title={config?.heroTitle}
        subtitle={config?.heroSubtitle}
        imageUrl={config?.heroImageUrl}
        whatsappNumber={config?.whatsappNumber}
        isLoading={configLoading}
      />

      {/* Calendar Section */}
      <section className="mx-auto max-w-[1440px] px-14 py-16 max-md:px-5 max-md:py-10">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_380px]">
          <MonthlyCalendar events={allEvents} isLoading={isCalendarLoading} />
          <UpcomingHighlights
            events={allEvents}
            isLoading={isCalendarLoading}
          />
        </div>
      </section>
    </>
  );
}
