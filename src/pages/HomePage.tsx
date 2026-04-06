import { MonthlyCalendar } from '@/components/features/calendar/MonthlyCalendar';
import { UpcomingHighlights } from '@/components/features/calendar/UpcomingHighlights';
import { HeroSection } from '@/components/features/hero/HeroSection';
import { useCalendar } from '@/hooks/useCalendar';
import { useSiteConfig } from '@/hooks/useSiteConfig';

export function HomePage() {
  const { data: config, isLoading: configLoading } = useSiteConfig();
  const { data: calendarEvents = [], isLoading: calendarLoading } =
    useCalendar();

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
          <MonthlyCalendar
            events={calendarEvents}
            isLoading={calendarLoading}
          />
          <UpcomingHighlights
            events={calendarEvents}
            isLoading={calendarLoading}
          />
        </div>
      </section>
    </>
  );
}
