import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import type { Event } from '../../../types';
import { getStrapiMediaUrl } from '../../../utils/media';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date);
  const day = format(eventDate, 'd');
  const month = format(eventDate, 'MMM', { locale: es }).toUpperCase();
  const timeStr = format(eventDate, 'EEE · h:mm a', { locale: es });
  const imageUrl = getStrapiMediaUrl(event.image);

  return (
    <Link
      to={`/eventos#${event.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-card transition-colors hover:border-text-dim"
    >
      {/* Image with date badge */}
      <div className="relative h-[140px] w-full overflow-hidden md:h-[180px]">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={event.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        )}
        <div className="absolute left-3 top-3 flex h-[42px] w-[42px] flex-col items-center justify-center rounded-lg bg-accent-bright md:left-4 md:top-4 md:h-12 md:w-12 md:rounded-[10px]">
          <span className="font-display text-base font-extrabold text-bg-primary md:text-lg">
            {day}
          </span>
          <span className="text-[8px] font-bold tracking-wider text-bg-primary">
            {month}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-1.5 p-4 md:gap-2 md:p-5">
        <h3 className="font-display text-[17px] font-bold text-text-primary md:text-lg">
          {event.title}
        </h3>
        {event.description && (
          <p className="text-[13px] leading-[1.4] text-text-secondary line-clamp-2">
            {event.description}
          </p>
        )}
        <div className="flex items-center gap-4">
          <span className="text-[11px] capitalize text-text-muted">
            {timeStr}
          </span>
          {event.location && (
            <span className="text-[11px] text-text-muted">
              {event.location}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
