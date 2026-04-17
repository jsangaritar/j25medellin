import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BookOpen } from 'lucide-react';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useVerseOfTheDay } from '@/hooks/useVerseOfTheDay';
import { BIBLE_VERSION_LABELS, type BibleVersion } from '@/types';
import { VerseOfTheDaySkeleton } from './VerseOfTheDaySkeleton';

function buildBibleComUrl(
  reference: string,
  bibleId: number,
  abbreviation: string,
): string {
  const parts = reference.split('.');
  const bookAndChapter = parts.slice(0, 2).join('.');
  return `https://www.bible.com/es/bible/${bibleId}/${bookAndChapter}.${abbreviation}`;
}

export function VerseOfTheDay() {
  const { data: votd, isLoading } = useVerseOfTheDay();
  const [activeVersion, setActiveVersion] = useState<BibleVersion>('nvi');

  if (isLoading) {
    return (
      <section className="mx-auto max-w-[1440px] px-14 pt-16 max-md:px-5 max-md:pt-10">
        <VerseOfTheDaySkeleton />
      </section>
    );
  }

  if (!votd) return null;

  const translation = votd.translations[activeVersion];
  const todayFormatted = format(new Date(), "d 'de' MMMM, yyyy", {
    locale: es,
  });
  const bibleComUrl = buildBibleComUrl(
    votd.reference,
    translation.bibleId,
    translation.abbreviation,
  );

  return (
    <section className="mx-auto max-w-[1440px] px-14 pt-16 max-md:px-5 max-md:pt-10">
      <div className="rounded-xl border border-border-light border-t-2 border-t-accent-bright bg-bg-card p-8 max-md:p-5">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between max-md:flex-col max-md:items-start max-md:gap-4">
          <div className="flex items-center gap-3">
            <BookOpen className="size-8 text-accent-bright" />
            <div>
              <h2 className="font-display text-lg font-semibold text-text-primary">
                Versiculo del Dia
              </h2>
              <p className="text-sm text-text-muted">{todayFormatted}</p>
            </div>
          </div>

          {/* Pill-style version filter (same as MediaPage) */}
          <Tabs
            value={activeVersion}
            onValueChange={(v) => setActiveVersion(v as BibleVersion)}
          >
            <TabsList className="gap-1 rounded-xl bg-bg-elevated p-1">
              {(
                Object.entries(BIBLE_VERSION_LABELS) as [BibleVersion, string][]
              ).map(([key, label]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="rounded-lg px-4 py-2 text-xs font-medium text-text-muted transition-colors hover:text-text-primary data-[state=active]:bg-accent-bright data-[state=active]:text-bg-primary data-[state=active]:shadow-none"
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Verse content */}
        <blockquote className="mb-4">
          <p className="font-display text-lg leading-relaxed text-text-primary italic md:text-xl whitespace-pre-line">
            {translation.passage}
          </p>
        </blockquote>

        {/* Citation + Bible.com link */}
        <div className="flex items-center justify-between max-md:flex-col max-md:items-start max-md:gap-2">
          <a
            href={bibleComUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-accent-muted transition-colors hover:text-accent-bright"
          >
            &mdash; {translation.citation}
          </a>
        </div>
      </div>
    </section>
  );
}
