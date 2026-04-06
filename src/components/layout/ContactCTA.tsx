import { Mail, MessageCircle } from 'lucide-react';

export function ContactCTA() {
  return (
    <section className="border-y border-border bg-bg-surface px-14 py-14 max-md:px-5 max-md:py-10">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-5">
        <div className="flex size-14 items-center justify-center rounded-full bg-accent-dim">
          <MessageCircle className="size-6 text-accent-bright" />
        </div>

        <h2 className="text-center font-display text-[28px] font-extrabold tracking-tight text-text-primary max-md:text-xl">
          ¿Tienes preguntas? Contáctanos
        </h2>

        <p className="max-w-[480px] text-center font-body text-[15px] leading-relaxed text-text-secondary max-md:text-sm">
          Escríbenos por WhatsApp o llena el formulario de contacto. Estamos
          aquí para ayudarte.
        </p>

        <div className="flex gap-3">
          <a
            href="https://wa.me/573001234567"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-[10px] bg-accent-bright px-7 py-3.5 font-body text-sm font-semibold text-bg-primary transition-opacity hover:opacity-90"
          >
            <MessageCircle className="size-4" />
            WhatsApp
          </a>
          <button
            type="button"
            className="flex items-center gap-2 rounded-[10px] border border-border px-7 py-3.5 font-body text-sm font-medium text-text-secondary transition-colors hover:border-text-muted hover:text-text-primary"
          >
            <Mail className="size-4" />
            Formulario
          </button>
        </div>
      </div>
    </section>
  );
}
