interface PageBannerProps {
  title: string;
  subtitle: string;
}

export function PageBanner({ title, subtitle }: PageBannerProps) {
  return (
    <section className="border-b border-border bg-bg-surface px-14 py-12 max-md:px-5 max-md:py-8">
      <div className="mx-auto max-w-[1440px]">
        <h1 className="mb-2 font-display text-4xl font-extrabold text-text-primary max-md:text-2xl">
          {title}
        </h1>
        <p className="max-w-xl font-body text-base text-text-secondary max-md:text-sm">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
