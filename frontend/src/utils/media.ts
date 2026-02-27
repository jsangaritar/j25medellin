import type { StrapiMedia } from '../types';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:1337';

export function getStrapiMediaUrl(
  media: StrapiMedia | undefined,
): string | undefined {
  if (!media?.url) return undefined;
  if (media.url.startsWith('http')) return media.url;
  return `${API_BASE}${media.url}`;
}
