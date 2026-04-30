import { RefreshCw, X } from 'lucide-react';
import { usePWAUpdate } from '@/hooks/usePWAUpdate';
import { cn } from '@/lib/utils';

export function UpdatePrompt() {
  const { needRefresh, update, dismiss } = usePWAUpdate();

  if (!needRefresh) return null;

  return (
    <div
      className={cn(
        'fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-sm md:hidden',
        'animate-in slide-in-from-bottom-4 fade-in duration-300',
      )}
    >
      <div className="flex items-center gap-3 rounded-xl border border-border bg-bg-card/95 p-3 shadow-lg backdrop-blur-sm">
        <RefreshCw className="size-5 shrink-0 text-accent-bright" />

        <p className="min-w-0 flex-1 text-sm font-medium text-text-primary">
          Nueva versión disponible
        </p>

        <button
          type="button"
          onClick={update}
          className="shrink-0 rounded-lg bg-accent-bright px-3 py-1.5 text-xs font-semibold text-bg-primary transition-opacity hover:opacity-90"
        >
          Actualizar
        </button>

        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-full p-1 text-text-muted transition-colors hover:text-text-primary"
          aria-label="Cerrar"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
