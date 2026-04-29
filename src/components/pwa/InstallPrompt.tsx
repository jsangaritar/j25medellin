import { X } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { cn } from '@/lib/utils';

export function InstallPrompt() {
  const { visible, isIOS, canInstall, triggerInstall, dismiss } =
    usePWAInstall();

  if (!visible || (!canInstall && !isIOS)) return null;

  return (
    <div
      className={cn(
        'fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-sm md:hidden',
        'animate-in slide-in-from-bottom-4 fade-in duration-300',
      )}
    >
      <div className="flex items-center gap-3 rounded-xl border border-border bg-bg-card/95 p-3 shadow-lg backdrop-blur-sm">
        <img
          src="/j25-logo.svg"
          alt="J+"
          className="size-8 shrink-0 rounded-lg bg-bg-primary p-1"
        />

        <div className="min-w-0 flex-1">
          {isIOS ? (
            <>
              <p className="text-sm font-semibold text-text-primary">
                Agrega J+ a tu inicio
              </p>
              <p className="text-xs text-text-muted">
                Toca{' '}
                <span className="inline-block translate-y-px">
                  <svg
                    className="inline size-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    role="img"
                    aria-label="Compartir"
                  >
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                </span>{' '}
                y &quot;Agregar a inicio&quot;
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-text-primary">
                Instala J+
              </p>
              <p className="text-xs text-text-muted">
                Accede más rápido desde tu inicio
              </p>
            </>
          )}
        </div>

        {!isIOS && (
          <button
            type="button"
            onClick={triggerInstall}
            className="shrink-0 rounded-lg bg-accent-bright px-3 py-1.5 text-xs font-semibold text-bg-primary transition-opacity hover:opacity-90"
          >
            Instalar
          </button>
        )}

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
