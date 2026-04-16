import { RefreshCw, TriangleAlert } from 'lucide-react';
import { Link, useRouteError } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function ErrorPage() {
  const error = useRouteError();
  const isChunkError =
    error instanceof Error &&
    (error.message.includes('Failed to fetch dynamically imported module') ||
      error.message.includes('is not a valid JavaScript MIME type'));

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg-primary px-5 text-center">
      <div className="mb-6 rounded-full bg-bg-elevated p-5">
        <TriangleAlert className="size-10 text-accent-bright" />
      </div>
      <h1 className="mb-3 font-display text-3xl font-bold text-text-primary">
        {isChunkError ? 'Nueva versión disponible' : 'Algo salió mal'}
      </h1>
      <p className="mb-8 max-w-md text-text-secondary">
        {isChunkError
          ? 'Hay una nueva versión de la página. Recarga para continuar.'
          : 'Ocurrió un error inesperado. Intenta recargar la página.'}
      </p>
      <div className="flex gap-3">
        <Button size="lg" onClick={() => window.location.reload()}>
          <RefreshCw className="size-4" />
          Recargar
        </Button>
        <Button variant="secondary" size="lg" asChild>
          <Link to="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  );
}
