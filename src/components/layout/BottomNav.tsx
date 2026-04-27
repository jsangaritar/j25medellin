import { BookOpen, Calendar, Clapperboard, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const tabs = [
  { label: 'Inicio', href: '/', icon: Home },
  { label: 'Discipulados', href: '/discipulados', icon: BookOpen },
  { label: 'Media', href: '/media', icon: Clapperboard },
  { label: 'Eventos', href: '/eventos', icon: Calendar },
];

export function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-bg-primary/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="flex h-14 items-center justify-around">
        {tabs.map((tab) => {
          const active =
            tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              to={tab.href}
              className={cn(
                'flex flex-1 flex-col items-center gap-0.5 py-1.5 transition-colors',
                active
                  ? 'text-accent-bright'
                  : 'text-text-muted active:text-text-primary',
              )}
            >
              <tab.icon className="size-5" strokeWidth={active ? 2.5 : 2} />
              <span className="font-body text-[10px] font-medium">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
