import type { LucideIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

interface FormFieldProps extends Omit<ComponentProps<'input'>, 'id'> {
  label: string;
  icon?: LucideIcon;
  id: string;
}

export function FormField({
  label,
  icon: Icon,
  id,
  className = '',
  ...inputProps
}: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label
        htmlFor={id}
        className="text-[13px] font-semibold text-text-primary"
      >
        {label}
      </label>
      <div className="flex items-center gap-2.5 rounded-[10px] border border-border bg-bg-card px-4 h-12">
        {Icon && <Icon size={16} className="shrink-0 text-text-muted" />}
        <input
          id={id}
          className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-dim outline-none"
          {...inputProps}
        />
      </div>
    </div>
  );
}
