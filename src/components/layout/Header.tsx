import { MessageCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { buildWhatsAppUrl } from '@/utils/whatsapp';

const navLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Discipulados', href: '/discipulados' },
  { label: 'Media', href: '/media' },
  { label: 'Eventos', href: '/eventos' },
];

export function Header() {
  const location = useLocation();
  const { data: config } = useSiteConfig();
  const whatsappUrl = buildWhatsAppUrl(config?.whatsappNumber ?? '');

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg-primary/95 backdrop-blur-sm">
      {/* Desktop */}
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-14 py-[18px] max-md:hidden">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/j25-logo.svg" alt="J+" className="h-8 scale-80" />
        </Link>

        <nav className="flex items-center gap-9">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`font-body text-[13px] transition-colors hover:text-text-primary ${
                location.pathname === link.href
                  ? 'font-semibold text-text-primary'
                  : 'font-medium text-text-muted'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Button size="sm" className="text-xs" asChild>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="size-3.5" />
            Contáctanos
          </a>
        </Button>
      </div>

      {/* Mobile — logo only, navigation handled by BottomNav */}
      <div className="flex items-center justify-center px-5 py-3.5 md:hidden">
        <Link to="/" className="flex items-center gap-2">
          <img src="/j25-logo.svg" alt="J+" className="h-7 scale-80" />
        </Link>
      </div>
    </header>
  );
}
