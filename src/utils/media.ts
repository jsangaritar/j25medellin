import type { MediaContent } from '@/types';

function getCreatedAtMs(item: { createdAt?: unknown }): number {
  const v = item.createdAt;
  if (!v) return 0;
  if (typeof v === 'object' && v !== null && 'seconds' in v)
    return (v as { seconds: number }).seconds;
  if (typeof v === 'string') return new Date(v).getTime() / 1000;
  return 0;
}

/**
 * Returns related media items sorted by relevance:
 * same course > same topic > shared tags > same type fallback.
 */
export function getRelatedMedia(
  current: MediaContent,
  allMedia: MediaContent[],
  limit: number,
): MediaContent[] {
  const candidates = allMedia.filter(
    (m) => m.id !== current.id && m.visible !== false,
  );

  const scored = candidates.map((m) => {
    let score = 0;

    if (current.courseId && m.courseId === current.courseId) score += 4;
    if (current.topicId && m.topicId === current.topicId) score += 2;

    const sharedTags = m.tags.filter((t) => current.tags.includes(t)).length;
    score += sharedTags;

    // Small boost for same type so videos stay with videos when scores tie
    if (m.type === current.type) score += 0.5;

    return { item: m, score };
  });

  return scored
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return getCreatedAtMs(b.item) - getCreatedAtMs(a.item);
    })
    .slice(0, limit)
    .map((s) => s.item);
}

const MEDIA_TYPE_SIDEBAR_LABELS: Record<string, string> = {
  VIDEO: 'Videos relacionados',
  AUDIO: 'Audio relacionado',
  DOCUMENT: 'Documentos relacionados',
};

export function getRelatedMediaLabel(type: string): string {
  return MEDIA_TYPE_SIDEBAR_LABELS[type] ?? 'Contenido relacionado';
}
