import type { CourseTopic } from '../../../types';

interface QuarterlyBannerProps {
  topic: CourseTopic;
}

export function QuarterlyBanner({ topic }: QuarterlyBannerProps) {
  return (
    <>
      {/* Desktop: wide low-profile banner with glow */}
      <div className="relative hidden overflow-hidden rounded-2xl border border-border bg-bg-card lg:block">
        <div className="relative z-10 flex flex-col gap-3 px-8 py-7">
          <span className="font-body text-[10px] font-semibold tracking-wider text-accent-bright">
            {topic.tag}
          </span>
          <h2 className="font-display text-[28px] font-extrabold tracking-[-0.5px] text-text-primary">
            {topic.title}
          </h2>
          <p className="max-w-[520px] font-body text-[13px] leading-[1.5] text-text-secondary">
            {topic.description}
          </p>
        </div>
        {/* Decorative radial glow */}
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full opacity-20 blur-[80px]"
          style={{
            background: 'radial-gradient(circle, #4ADE80, transparent)',
          }}
        />
      </div>

      {/* Mobile: card-style banner */}
      <div className="flex flex-col gap-2.5 rounded-[14px] border border-border bg-bg-card p-5 lg:hidden">
        <span className="font-body text-[9px] font-semibold tracking-wider text-accent-bright">
          {topic.tag}
        </span>
        <h2 className="font-display text-[22px] font-extrabold tracking-[-0.3px] text-text-primary">
          {topic.title}
        </h2>
        <p className="font-body text-[13px] leading-[1.5] text-text-secondary">
          {topic.description}
        </p>
      </div>
    </>
  );
}
