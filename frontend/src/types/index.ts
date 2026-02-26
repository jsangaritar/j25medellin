export type CourseStatus =
  | 'DRAFT'
  | 'COMING_SOON'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'ARCHIVED';

export type MediaType = 'VIDEO' | 'AUDIO' | 'DOCUMENT';

export interface Event {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  endDate?: string;
  location: string;
  image?: StrapiMedia;
  tags: string[];
  featured: boolean;
  requiresRegistration: boolean;
  whatsappMessage?: string;
  googleCalendarEventId?: string;
}

export interface Course {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  image?: StrapiMedia;
  tags: string[];
  status: CourseStatus;
  startDate?: string;
  endDate?: string;
  schedule?: string;
  location?: string;
  whatsappMessage?: string;
}

export interface MediaContent {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  type: MediaType;
  thumbnailImage?: StrapiMedia;
  externalUrl?: string;
  file?: StrapiMedia;
  tags: string[];
  featured: boolean;
  episodeCount?: number;
  platform?: string;
}

export interface Registration {
  id: number;
  fullName: string;
  whatsApp: string;
  email: string;
  event?: Event;
  course?: Course;
}

export interface SiteConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: StrapiMedia;
  whatsappNumber: string;
  instagramUrl: string;
  youtubeUrl: string;
  contactEmail: string;
  googleCalendarUrl: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
}

export interface StrapiMedia {
  id: number;
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
  formats?: Record<string, { url: string; width: number; height: number }>;
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
