import { MessageCircle } from 'lucide-react';
import type { SiteConfig } from '../../../types';
import { getStrapiMediaUrl } from '../../../utils/media';
import { buildWhatsAppUrl } from '../../../utils/whatsapp';
import { Button } from '../../ui/Button';

interface HeroSectionProps {
  config?: SiteConfig;
}

export function HeroSection({ config }: HeroSectionProps) {
  const heroImageUrl = getStrapiMediaUrl(config?.heroImage);

  return (
    <section className="relative h-[520px] w-full overflow-hidden md:h-[600px] lg:h-[680px]">
      {/* Background image */}
      {heroImageUrl && (
        <img
          src={heroImageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Gradient overlay — desktop: top-to-bottom, mobile: bottom-to-top */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, #0A0A0AF5, #0A0A0ACC 50%, #0A0A0A77)',
        }}
      />
      <div
        className="absolute inset-0 hidden lg:block"
        style={{
          background:
            'linear-gradient(to bottom, #0A0A0AF0, #0A0A0ACC 50%, #0A0A0A88)',
        }}
      />

      {/* Content */}
      <div className="relative flex h-full flex-col justify-end gap-5 px-5 pb-12 md:px-10 md:pb-16 lg:justify-start lg:gap-7 lg:px-14 lg:pt-[120px]">
        {/* Tag */}
        <div className="flex items-center gap-1.5 rounded-full bg-accent-dim px-3 py-1.5 self-start lg:gap-2 lg:px-3.5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-bright" />
          <span className="font-body text-[11px] font-semibold text-accent-bright lg:text-xs">
            Comunidad J+
          </span>
        </div>

        {/* Title */}
        <h1 className="max-w-[340px] font-display text-[34px] font-extrabold leading-[1.1] tracking-[-1px] text-text-primary md:max-w-[520px] md:text-[44px] md:tracking-[-1.5px] lg:max-w-[680px] lg:text-[56px] lg:leading-[1.05] lg:tracking-[-2px]">
          {config?.heroTitle ??
            'Tu lugar para\ncrecer, conectar\ny transformarte.'}
        </h1>

        {/* Subtitle */}
        <p className="max-w-[300px] font-body text-[15px] leading-[1.5] text-text-secondary md:max-w-[420px] md:text-base lg:max-w-[520px] lg:text-[17px] lg:leading-[1.6]">
          {config?.heroSubtitle ??
            'Discipulados, comunidad y contenido para tu crecimiento espiritual. Un ministerio joven donde la fe se vive con propósito.'}
        </p>

        {/* CTA */}
        <div className="flex flex-col gap-2.5 lg:flex-row lg:gap-3">
          <Button
            variant="primary"
            href={
              config?.whatsappNumber
                ? buildWhatsAppUrl(config.whatsappNumber)
                : '#'
            }
            external
            icon={MessageCircle}
          >
            Contáctanos
          </Button>
        </div>
      </div>
    </section>
  );
}
