import { Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-surface">
      <div className="flex flex-col items-center gap-3 px-5 py-6 md:flex-row md:justify-between md:px-14 md:py-7">
        <div className="flex items-center gap-3">
          <Link to="/">
            <img src="/j25-logo.svg" alt="J+" className="h-5 md:h-6" />
          </Link>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted transition-colors hover:text-text-secondary"
          >
            <Instagram size={15} className="md:h-4 md:w-4" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted transition-colors hover:text-text-secondary"
          >
            <Youtube size={15} className="md:h-4 md:w-4" />
          </a>
        </div>
        <p className="text-center text-[11px] text-text-dim md:text-xs">
          &copy; {new Date().getFullYear()} J+. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
