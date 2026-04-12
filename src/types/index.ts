// ── Enums ──

export type CourseStatus =
  | 'DRAFT'
  | 'COMING_SOON'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'ARCHIVED';

export const COURSE_STATUS_LABELS: Record<CourseStatus, string> = {
  DRAFT: 'Borrador',
  COMING_SOON: 'Próximamente',
  ACTIVE: 'Activo',
  COMPLETED: 'Completado',
  ARCHIVED: 'Archivado',
};

export type EventType = 'j+' | 'church';

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  'j+': 'J+',
  church: 'Iglesia',
};

export type MediaType = 'VIDEO' | 'AUDIO' | 'DOCUMENT';

export const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
  VIDEO: 'Video',
  AUDIO: 'Audio',
  DOCUMENT: 'Documento',
};

// ── Content Types ──

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string; // ISO string
  endDate?: string;
  location: string;
  imageUrl?: string;
  tags: string[];
  featured: boolean;
  requiresRegistration: boolean;
  whatsappMessage?: string;
  googleCalendarEventId?: string;
  eventType: EventType;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl?: string;
  tags: string[];
  startDate?: string;
  endDate?: string;
  schedule?: string;
  location?: string;
  whatsappMessage?: string;
  accentColor?: string;
  capacity?: number;
  topicId: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  tag: string;
  startDate: string;
  endDate: string;
  status: CourseStatus;
  courseIds: string[];
  courses?: Course[]; // populated client-side
}

/** @deprecated Use Topic instead */
export type CourseTopic = Topic;

export interface MediaContent {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: MediaType;
  thumbnailUrl?: string;
  externalUrl?: string;
  fileUrl?: string;
  tags: string[];
  featured: boolean;
  episodeCount?: number;
  platform?: string;
  topicId?: string;
  courseId?: string;
}

// ── Registration ──

export interface Registration {
  id: string;
  fullName: string;
  whatsApp: string;
  email: string;
  eventId?: string;
  courseId?: string;
  createdAt: string;
}

export interface RegistrationInput {
  fullName: string;
  whatsApp: string;
  email: string;
  eventId?: string;
  courseId?: string;
}

// ── Contact ──

export interface ContactMessage {
  id: string;
  fullName: string;
  whatsApp: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface ContactMessageInput {
  fullName: string;
  whatsApp: string;
  email: string;
  message: string;
}

// ── Site Config ──

export interface SiteConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl?: string;
  whatsappNumber: string;
  instagramUrl: string;
  youtubeUrl: string;
  contactEmail: string;
}
