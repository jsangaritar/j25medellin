import { Calendar, MapPin, MessageCircle } from 'lucide-react';
import { Tag } from '@/components/ui/tag';
import type { Event } from '@/types';
import { formatEventDate } from '@/utils/dates';
import { buildWhatsAppUrl } from '@/utils/whatsapp';

interface FeaturedEventProps {
  event: Event;
  whatsappNumber: string;
}

export function FeaturedEvent({ event, whatsappNumber }: FeaturedEventProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border-light bg-bg-card">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Image */}
        {event.imageUrl && (
          <div className="aspect-[16/9] lg:aspect-auto">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="size-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col justify-center gap-5 p-8 max-md:p-5">
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag) => (
              <Tag key={tag} variant="accent">
                {tag}
              </Tag>
            ))}
          </div>

          <h2 className="font-display text-2xl font-bold text-text-primary lg:text-3xl">
            {event.title}
          </h2>

          <p className="line-clamp-3 font-body text-sm leading-relaxed text-text-secondary">
            {event.description}
          </p>

          <div className="flex flex-col gap-2 text-sm text-text-muted">
            <span className="flex items-center gap-2">
              <Calendar className="size-4" />
              {formatEventDate(event.date)}
            </span>
            {event.location === 'Casa Sobre la Roca - Medellín' ? (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Casa Sobre la Roca - Medellín')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-accent-bright"
              >
                <MapPin className="size-4" />
                {event.location}
              </a>
            ) : (
              <span className="flex items-center gap-2">
                <MapPin className="size-4" />
                {event.location}
              </span>
            )}
          </div>

          {event.requiresRegistration && (
            <a
              href={buildWhatsAppUrl(whatsappNumber, event.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-fit items-center gap-2 rounded-[10px] bg-accent-bright px-6 py-3 font-body text-sm font-semibold text-bg-primary transition-opacity hover:opacity-90"
            >
              <MessageCircle className="size-4" />
              Inscribirse
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
