interface SectionHeaderProps {
  label?: string;
  title: string;
  className?: string;
}

export function SectionHeader({
  label,
  title,
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={className}>
      {label && (
        <div className="mb-2 flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-accent-bright" />
          <span className="font-body text-xs font-semibold uppercase tracking-wider text-accent-bright">
            {label}
          </span>
        </div>
      )}
      <h2 className="font-display text-2xl font-bold text-text-primary md:text-3xl">
        {title}
      </h2>
    </div>
  );
}
