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
        'fixed top-16 left-4 right-4 z-40 md:hidden',
        'rounded-xl bg-white px-3 py-2.5 shadow-lg',
        'animate-in slide-in-from-top-4 fade-in duration-300',
      )}
    >
      <div className="flex items-center gap-3">
        <img
          src="/j25-logo.svg"
          alt="J+"
          className="size-8 shrink-0 rounded-lg bg-neutral-900 p-1"
        />

        <div className="min-w-0 flex-1">
          {isIOS ? (
            <>
              <p className="text-sm font-semibold text-neutral-900">
                Guarda J+ como app
              </p>
              <p className="text-xs text-neutral-500">
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
                y busca la opción &quot;Agregar a inicio&quot;
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-neutral-900">
                Instala J+
              </p>
              <p className="text-xs text-neutral-500">
                Accede más rápido desde tu pantalla de inicio
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
          className="shrink-0 rounded-full p-1 text-neutral-500 transition-colors hover:text-neutral-900"
          aria-label="Cerrar"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
