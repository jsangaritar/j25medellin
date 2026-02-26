import { MonthlyCalendar } from '../components/features/calendar/MonthlyCalendar';
import { UpcomingHighlights } from '../components/features/calendar/UpcomingHighlights';
import { HeroSection } from '../components/features/hero/HeroSection';
import { useCalendar } from '../hooks/useCalendar';
import { useSiteConfig } from '../hooks/useSiteConfig';

export function HomePage() {
  const { data: config } = useSiteConfig();
  const { data: calendarEvents } = useCalendar();

  return (
    <>
      <HeroSection config={config} />

      {/* Calendar Section */}
      <section className="flex flex-col gap-6 px-5 py-10 md:gap-8 md:px-10 md:py-12 lg:gap-10 lg:px-14 lg:py-16">
        <MonthlyCalendar events={calendarEvents ?? []} />
        <UpcomingHighlights events={calendarEvents ?? []} />
      </section>
    </>
  );
}
