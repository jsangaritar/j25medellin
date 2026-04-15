import { Clock, MapPin } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Tag } from '@/components/ui/tag';
import type { Event } from '@/types';
import { formatEventDate, formatEventTime } from '@/utils/dates';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const date = new Date(event.date);

  return (
    <div className="group overflow-hidden rounded-xl border border-border-light bg-bg-card transition-colors hover:border-border">
      {/* Image with date badge */}
      <div className="relative aspect-[16/10]">
        <OptimizedImage
          src={event.imageUrl}
          alt={event.title}
          className="size-full object-cover"
        />

        {/* Date badge */}
        <div className="absolute left-3 top-3 flex flex-col items-center rounded-lg bg-bg-primary/90 px-3 py-2 backdrop-blur-sm">
          <span className="font-display text-lg font-bold leading-none text-text-primary">
            {date.getDate()}
          </span>
          <span className="text-[10px] uppercase text-text-muted">
            {date.toLocaleDateString('es-CO', { month: 'short' })}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-wrap gap-1.5">
          {event.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>

        <h3 className="font-body text-base font-semibold text-text-primary">
          {event.title}
        </h3>

        <p className="line-clamp-2 text-sm text-text-secondary">
          {event.description}
        </p>

        <div className="flex flex-col gap-1.5 text-xs text-text-muted">
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" />
            {formatEventDate(event.date)} · {formatEventTime(event.date)}
          </span>
          {event.location === 'Casa Sobre la Roca - Medellín' ? (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Casa Sobre la Roca - Medellín')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-accent-bright"
            >
              <MapPin className="size-3.5" />
              {event.location}
            </a>
          ) : (
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              {event.location}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
