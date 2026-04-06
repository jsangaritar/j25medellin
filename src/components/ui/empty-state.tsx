import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 text-center ${className}`}
    >
      <div className="mb-4 rounded-full bg-bg-elevated p-4">
        <Icon className="size-8 text-text-muted" />
      </div>
      <h3 className="mb-2 font-display text-lg font-bold text-text-primary">
        {title}
      </h3>
      <p className="max-w-sm text-sm text-text-secondary">{description}</p>
    </div>
  );
}
