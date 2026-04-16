import { Mail, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { ContactModal } from '@/components/features/contact/ContactModal';
import { Button } from '@/components/ui/button';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { buildWhatsAppUrl } from '@/utils/whatsapp';

export function ContactCTA() {
  const { data: config } = useSiteConfig();
  const whatsappUrl = buildWhatsAppUrl(config?.whatsappNumber ?? '');
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
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
            <Button size="lg" asChild>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" />
                WhatsApp
              </a>
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setContactOpen(true)}
            >
              <Mail className="size-4" />
              Formulario
            </Button>
          </div>
        </div>
      </section>

      <ContactModal open={contactOpen} onOpenChange={setContactOpen} />
    </>
  );
}
