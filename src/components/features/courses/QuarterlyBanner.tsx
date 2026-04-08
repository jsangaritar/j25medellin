import type { Topic } from '@/types';

interface QuarterlyBannerProps {
  topic: Topic;
}

export function QuarterlyBanner({ topic }: QuarterlyBannerProps) {
  return (
    <div className="rounded-2xl border border-border-light bg-bg-card p-8 max-md:p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-accent-bright" />
        <span className="font-body text-xs font-semibold uppercase tracking-wider text-accent-bright">
          {topic.tag}
        </span>
      </div>
      <h2 className="mb-3 font-display text-2xl font-bold text-text-primary lg:text-3xl">
        {topic.title}
      </h2>
      <p className="max-w-2xl font-body text-sm leading-relaxed text-text-secondary">
        {topic.description}
      </p>
    </div>
  );
}
