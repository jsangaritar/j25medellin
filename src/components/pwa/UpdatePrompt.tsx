import { RefreshCw, X } from 'lucide-react';
import { usePWAUpdate } from '@/hooks/usePWAUpdate';
import { cn } from '@/lib/utils';

export function UpdatePrompt() {
  const { needRefresh, update, dismiss } = usePWAUpdate();

  if (!needRefresh) return null;

  return (
    <div
      className={cn(
        'fixed top-16 left-4 right-4 z-40 md:hidden',
        'rounded-xl bg-white px-3 py-2.5 shadow-lg',
        'animate-in slide-in-from-top-4 fade-in duration-300',
      )}
    >
      <div className="flex items-center gap-3">
        <RefreshCw className="size-5 shrink-0 text-neutral-900" />

        <p className="min-w-0 flex-1 text-sm font-medium text-neutral-900">
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
          className="shrink-0 rounded-full p-1 text-neutral-500 transition-colors hover:text-neutral-900"
          aria-label="Cerrar"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
