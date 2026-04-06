import { FileQuestion } from 'lucide-react';
import { Link } from 'react-router-dom';

export function MediaNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="mb-6 rounded-full bg-bg-elevated p-5">
        <FileQuestion className="size-10 text-text-muted" />
      </div>
      <h2 className="mb-3 font-display text-2xl font-bold text-text-primary">
        Contenido no encontrado
      </h2>
      <p className="mb-8 max-w-md text-text-secondary">
        El contenido que buscas no existe o fue eliminado.
      </p>
      <Link
        to="/media"
        className="rounded-[10px] bg-accent-bright px-6 py-3 font-body text-sm font-semibold text-bg-primary transition-opacity hover:opacity-90"
      >
        Volver a Media
      </Link>
    </div>
  );
}
