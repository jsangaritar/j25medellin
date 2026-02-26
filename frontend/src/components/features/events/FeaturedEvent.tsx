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
  const whatsappUrl = whatsappNumber
    ? buildWhatsAppUrl(
        whatsappNumber,
        event.whatsappMessage ?? `Hola, quiero info sobre: ${event.title}`,
      )
    : undefined;

  return (
    <>
      {/* Desktop banner overlay */}
      <section className="relative hidden w-full overflow-hidden border-b border-border lg:block lg:h-[420px]">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={event.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, #0A0A0AF0, #0A0A0A66)',
          }}
        />
        <div className="relative flex h-full flex-col justify-start gap-6 px-14 pt-14">
          <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-accent-bright px-3.5 py-1.5 font-body text-[10px] font-bold tracking-[1.5px] text-bg-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-bg-primary" />
            PRÓXIMO EVENTO
          </span>
          <h2 className="font-display text-5xl font-extrabold leading-[1.05] tracking-[-2px] text-text-primary">
            {event.title}
          </h2>
          {event.description && (
            <p className="max-w-[520px] font-body text-base leading-[1.6] text-text-secondary">
              {event.description}
            </p>
          )}
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 font-body text-sm text-text-muted">
              <Calendar size={16} />
              {formatDate(event.date)}
            </span>
            {event.location && (
              <span className="flex items-center gap-1.5 font-body text-sm text-text-muted">
                <MapPin size={16} />
                {event.location}
              </span>
            )}
          </div>
          <div className="flex gap-3">
            {whatsappUrl && (
              <Button
                variant="primary"
                href={whatsappUrl}
                external
                icon={MessageCircle}
              >
                Inscribirme por WhatsApp
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Mobile card layout */}
      <section className="overflow-hidden border-b border-border lg:hidden">
        {/* Image with badge */}
        <div className="relative h-[220px] w-full overflow-hidden">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          )}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, #0A0A0ACC, #0A0A0A44)',
            }}
          />
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-2xl bg-accent-bright px-3 py-[5px] font-body text-[9px] font-bold tracking-[1.5px] text-bg-primary">
            <span className="h-[5px] w-[5px] rounded-full bg-bg-primary" />
            PRÓXIMO EVENTO
          </span>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-3.5 border-b border-border bg-bg-card p-5">
          <h2 className="font-display text-[22px] font-extrabold tracking-[-0.5px] text-text-primary">
            {event.title}
          </h2>
          {event.description && (
            <p className="font-body text-[13px] leading-[1.4] text-text-secondary">
              {event.description}
            </p>
          )}
          <div className="flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 font-body text-[13px] text-text-muted">
              <Calendar size={14} />
              {formatDate(event.date)}
            </span>
            {event.location && (
              <span className="flex items-center gap-1.5 font-body text-[13px] text-text-muted">
                <MapPin size={14} />
                {event.location}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2.5">
            {whatsappUrl && (
              <Button
                variant="primary"
                href={whatsappUrl}
                external
                icon={MessageCircle}
                className="w-full justify-center"
              >
                Inscribirme por WhatsApp
              </Button>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
