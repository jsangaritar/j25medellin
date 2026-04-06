import { FileQuestion } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="mb-6 rounded-full bg-bg-elevated p-5">
        <FileQuestion className="size-10 text-text-muted" />
      </div>
      <h1 className="mb-3 font-display text-3xl font-bold text-text-primary">
        Página no encontrada
      </h1>
      <p className="mb-8 max-w-md text-text-secondary">
        La página que buscas no existe o fue movida.
      </p>
      <Link
        to="/"
        className="rounded-[10px] bg-accent-bright px-6 py-3 font-body text-sm font-semibold text-bg-primary transition-opacity hover:opacity-90"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
