import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonCommonProps {
  variant?: ButtonVariant;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

interface ButtonAsButton extends ButtonCommonProps {
  href?: never;
  external?: never;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

interface ButtonAsLink extends ButtonCommonProps {
  href: string;
  external?: boolean;
  onClick?: never;
  type?: never;
  disabled?: never;
}

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-accent-bright text-bg-primary font-semibold hover:bg-accent-muted',
  secondary:
    'border border-border text-text-secondary font-medium hover:border-text-muted',
  ghost: 'text-text-muted font-medium hover:text-text-secondary',
};

export function Button({
  variant = 'primary',
  icon: Icon,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  const classes =
    `inline-flex items-center gap-2 rounded-[10px] px-7 py-3.5 text-sm transition-colors cursor-pointer ${variantStyles[variant]} ${className}`.trim();

  if ('href' in rest && rest.href) {
    const content = (
      <>
        {Icon && <Icon size={16} />}
        {children}
      </>
    );
    if (rest.external) {
      return (
        <a
          href={rest.href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
        >
          {content}
        </a>
      );
    }
    return (
      <Link to={rest.href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={(rest as ButtonAsButton).type ?? 'button'}
      onClick={(rest as ButtonAsButton).onClick}
      disabled={(rest as ButtonAsButton).disabled}
      className={classes}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}
