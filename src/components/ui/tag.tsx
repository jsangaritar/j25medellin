import { cn } from '@/lib/utils';

interface TagProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent';
  className?: string;
}

export function Tag({ children, variant = 'default', className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 font-body text-xs font-medium',
        variant === 'default' && 'bg-bg-elevated text-text-secondary',
        variant === 'accent' && 'bg-accent-dim text-accent-bright',
        className,
      )}
    >
      {children}
    </span>
  );
}
