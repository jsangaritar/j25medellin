import { Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-surface">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-14 py-7 max-md:flex-col max-md:gap-4 max-md:px-5 max-md:py-5">
        <div className="flex items-center gap-3">
          <Link to="/">
            <img src="/j25-logo.svg" alt="J+" className="h-6 w-[60px]" />
          </Link>
          <a
            href="https://instagram.com/j25medellin"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-text-muted transition-colors hover:text-text-primary"
          >
            <Instagram className="size-4" />
          </a>
          <a
            href="https://youtube.com/@j25medellin"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="text-text-muted transition-colors hover:text-text-primary"
          >
            <Youtube className="size-4" />
          </a>
        </div>
        <p className="font-body text-xs text-text-dim">
          &copy; {new Date().getFullYear()} J+. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
