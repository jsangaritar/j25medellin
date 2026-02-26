import { Calendar, MapPin, MessageCircle } from 'lucide-react';
import type { Event } from '../../../types';
import { formatDate } from '../../../utils/dates';
import { getStrapiMediaUrl } from '../../../utils/media';
import { buildWhatsAppUrl } from '../../../utils/whatsapp';
import { Button } from '../../ui/Button';

interface FeaturedEventProps {
  event: Event;
  whatsappNumber?: string;
}

export function FeaturedEvent({ event, whatsappNumber }: FeaturedEventProps) {
  const imageUrl = getStrapiMediaUrl(event.image);

  return (
    <section className="relative h-[360px] w-full overflow-hidden border-b border-border lg:h-[420px]">
      {/* Background image */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={event.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, #0A0A0AF0, #0A0A0A66)',
        }}
      />

      {/* Content */}
      <div className="relative flex h-full flex-col justify-end gap-5 px-5 pb-8 lg:justify-start lg:gap-6 lg:px-14 lg:pt-14">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-accent-bright px-3.5 py-1.5 font-body text-[10px] font-bold tracking-[1.5px] text-bg-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-bg-primary" />
          PRÓXIMO EVENTO
        </span>

        {/* Title */}
        <h2 className="font-display text-3xl font-extrabold leading-[1.05] tracking-[-1px] text-text-primary lg:text-5xl lg:tracking-[-2px]">
          {event.title}
        </h2>

        {/* Description */}
        {event.description && (
          <p className="max-w-[520px] font-body text-sm leading-[1.6] text-text-secondary lg:text-base">
            {event.description}
          </p>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 lg:gap-6">
          <span className="flex items-center gap-1.5 font-body text-[13px] text-text-muted lg:text-sm">
            <Calendar size={16} />
            {formatDate(event.date)}
          </span>
          {event.location && (
            <span className="flex items-center gap-1.5 font-body text-[13px] text-text-muted lg:text-sm">
              <MapPin size={16} />
              {event.location}
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="flex gap-3">
          {whatsappNumber && (
            <Button
              variant="primary"
              href={buildWhatsAppUrl(
                whatsappNumber,
                event.whatsappMessage ??
                  `Hola, quiero info sobre: ${event.title}`,
              )}
              external
              icon={MessageCircle}
            >
              Inscribirme por WhatsApp
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
