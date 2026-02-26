import { Mail, MessageCircle } from 'lucide-react';

export function ContactCTA() {
  return (
    <section className="border-y border-border bg-bg-surface px-5 py-10 md:px-14 md:py-14">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center md:gap-5">
        {/* Icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-dim md:h-14 md:w-14">
          <MessageCircle
            size={20}
            className="text-accent-bright md:h-6 md:w-6"
          />
        </div>

        {/* Title */}
        <h2 className="font-display text-xl font-extrabold text-text-primary md:text-[28px] md:tracking-[-0.5px]">
          &iquest;Tienes preguntas? Cont&aacute;ctanos
        </h2>

        {/* Description */}
        <p className="text-[13px] text-text-secondary md:text-[15px] md:leading-relaxed">
          Escr&iacute;benos por WhatsApp o llena el formulario de contacto.
          Estamos aqu&iacute; para ayudarte.
        </p>

        {/* Buttons */}
        <div className="flex w-full flex-col gap-2.5 md:w-auto md:flex-row md:gap-3">
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-accent-bright px-7 py-3.5 text-sm font-semibold text-bg-primary transition-colors hover:bg-accent-muted"
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-border px-7 py-3.5 text-sm font-medium text-text-secondary transition-colors hover:border-text-muted"
          >
            <Mail size={16} />
            Formulario
          </button>
        </div>
      </div>
    </section>
  );
}
