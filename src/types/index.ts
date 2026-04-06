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
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl?: string;
  tags: string[];
  status: CourseStatus;
  startDate?: string;
  endDate?: string;
  schedule?: string;
  location?: string;
  whatsappMessage?: string;
  lineNumber?: number;
  accentColor?: string;
  capacity?: number;
}

export interface CourseTopic {
  id: string;
  title: string;
  description: string;
  tag: string;
  startDate: string;
  endDate: string;
  courseIds: string[];
  courses?: Course[]; // populated client-side
}

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

// ── Calendar ──

export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO string
  end: string;
  description?: string;
}
