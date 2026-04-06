import type {
  CalendarEvent,
  Course,
  CourseTopic,
  Event,
  MediaContent,
  SiteConfig,
} from '@/types';

// ── Site Config ──

export const mockSiteConfig: SiteConfig = {
  heroTitle: 'Tu lugar para\ncrecer, conectar\ny transformarte.',
  heroSubtitle:
    'Discipulados, comunidad y contenido para tu crecimiento espiritual.\nUn ministerio joven donde la fe se vive con propósito.',
  heroImageUrl:
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1440&h=680&fit=crop',
  whatsappNumber: '573001234567',
  instagramUrl: 'https://instagram.com/j25medellin',
  youtubeUrl: 'https://youtube.com/@j25medellin',
  contactEmail: 'contacto@j25medellin.com',
  googleCalendarUrl: '',
};

// ── Events ──

export const mockEvents: Event[] = [
  {
    id: 'evt-1',
    title: 'Conferencia J+ 2026',
    slug: 'conferencia-j-2026',
    description:
      'Tres días de conferencias, alabanza y comunidad. Speakers internacionales, talleres prácticos y momentos de adoración que marcarán tu vida.',
    date: '2026-05-15T18:00:00.000Z',
    endDate: '2026-05-17T22:00:00.000Z',
    location: 'Centro de Convenciones Plaza Mayor',
    imageUrl:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    tags: ['Conferencia', 'Destacado'],
    featured: true,
    requiresRegistration: true,
    whatsappMessage: 'Hola, quiero información sobre la Conferencia J+ 2026',
  },
  {
    id: 'evt-2',
    title: 'Noche de Alabanza J+',
    slug: 'noche-alabanza',
    description:
      'Una noche especial de adoración y alabanza. Ven a conectar con Dios a través de la música.',
    date: '2026-04-18T19:00:00.000Z',
    location: 'Salón Principal',
    imageUrl:
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=400&fit=crop',
    tags: ['Alabanza'],
    featured: false,
    requiresRegistration: false,
    whatsappMessage: 'Hola, quiero información sobre la Noche de Alabanza',
  },
  {
    id: 'evt-3',
    title: 'Retiro de Jóvenes',
    slug: 'retiro-jovenes',
    description:
      'Un fin de semana para desconectarte de la rutina y conectarte con Dios en comunidad.',
    date: '2026-04-25T09:00:00.000Z',
    endDate: '2026-04-26T17:00:00.000Z',
    location: 'Finca El Refugio',
    imageUrl:
      'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=400&fit=crop',
    tags: ['Retiro', 'Comunidad'],
    featured: false,
    requiresRegistration: true,
    whatsappMessage: 'Hola, quiero inscribirme al Retiro de Jóvenes',
  },
  {
    id: 'evt-4',
    title: 'Discipulado: Identidad — Sesión 4',
    slug: 'discipulado-identidad-sesion-4',
    description: 'Cuarta sesión del discipulado sobre Identidad en Cristo.',
    date: '2026-04-16T18:30:00.000Z',
    location: 'Aula 2',
    tags: ['Discipulado'],
    featured: false,
    requiresRegistration: false,
  },
];

// ── Courses ──

export const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Conociendo al Padre',
    slug: 'conociendo-al-padre',
    description:
      'Descubre la naturaleza de Dios y cómo se relaciona contigo de forma personal.',
    imageUrl:
      'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&h=300&fit=crop',
    tags: ['Fundamentos'],
    status: 'ACTIVE',
    startDate: '2026-03-01T00:00:00.000Z',
    endDate: '2026-05-31T00:00:00.000Z',
    schedule: 'Martes 7:00 PM',
    location: 'Aula 1',
    lineNumber: 1,
    accentColor: '#4ADE80',
    capacity: 25,
    enrolled: 18,
    whatsappMessage: 'Hola, quiero inscribirme al curso Conociendo al Padre',
  },
  {
    id: 'course-2',
    title: 'Mayordomía y Propósito',
    slug: 'mayordomia-y-proposito',
    description:
      'Aprende a administrar tus talentos, tiempo y recursos con propósito.',
    imageUrl:
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop',
    tags: ['Crecimiento'],
    status: 'ACTIVE',
    startDate: '2026-03-01T00:00:00.000Z',
    endDate: '2026-05-31T00:00:00.000Z',
    schedule: 'Miércoles 7:00 PM',
    location: 'Aula 2',
    lineNumber: 2,
    accentColor: '#A78BFA',
    capacity: 25,
    enrolled: 12,
    whatsappMessage: 'Hola, quiero inscribirme al curso Mayordomía y Propósito',
  },
  {
    id: 'course-3',
    title: 'Relaciones Sanas',
    slug: 'relaciones-sanas',
    description:
      'Construye relaciones saludables basadas en principios bíblicos.',
    imageUrl:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop',
    tags: ['Relaciones'],
    status: 'ACTIVE',
    startDate: '2026-03-01T00:00:00.000Z',
    endDate: '2026-05-31T00:00:00.000Z',
    schedule: 'Jueves 7:00 PM',
    location: 'Aula 3',
    lineNumber: 3,
    accentColor: '#60A5FA',
    capacity: 25,
    enrolled: 23,
    whatsappMessage: 'Hola, quiero inscribirme al curso Relaciones Sanas',
  },
];

export const mockCourseTopic: CourseTopic = {
  id: 'topic-1',
  title: 'Identidad en Cristo',
  description:
    'Descubre quién eres realmente a través de las escrituras. Tres líneas de profundización paralelas, cada una con cupo máximo de 25 personas.',
  tag: 'TEMA ACTUAL · MAR — MAY 2026',
  startDate: '2026-03-01T00:00:00.000Z',
  endDate: '2026-05-31T00:00:00.000Z',
  courseIds: ['course-1', 'course-2', 'course-3'],
  courses: mockCourses,
};

// ── Media ──

export const mockMediaContents: MediaContent[] = [
  {
    id: 'media-1',
    title: 'Alabanza J+ — Taller en Vivo',
    slug: 'alabanza-taller-en-vivo',
    description:
      'Sesión completa de alabanza grabada en nuestro último taller comunitario.',
    type: 'VIDEO',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=225&fit=crop',
    externalUrl: 'https://youtube.com/watch?v=example1',
    tags: ['Alabanza', 'En Vivo'],
    featured: true,
    platform: 'YouTube',
  },
  {
    id: 'media-2',
    title: 'Conferencia J+ 2025 — Sesión de Apertura',
    slug: 'conferencia-2025-apertura',
    description: 'Revive la sesión de apertura de la Conferencia J+ 2025.',
    type: 'VIDEO',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=225&fit=crop',
    externalUrl: 'https://youtube.com/watch?v=example2',
    tags: ['Conferencia'],
    featured: false,
    platform: 'YouTube',
  },
  {
    id: 'media-3',
    title: 'Podcast: Fe y Propósito — Ep. 12',
    slug: 'fe-y-proposito-ep-12',
    description:
      'Conversamos sobre cómo descubrir tu propósito a través de la fe.',
    type: 'AUDIO',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=225&fit=crop',
    externalUrl: 'https://open.spotify.com/episode/example1',
    tags: ['Podcast', 'Fe'],
    featured: true,
    episodeCount: 12,
    platform: 'Spotify',
  },
  {
    id: 'media-4',
    title: 'Podcast: Salud Mental y Fe — Ep. 8',
    slug: 'salud-mental-y-fe-ep-8',
    description:
      'Exploramos la relación entre bienestar emocional y vida espiritual.',
    type: 'AUDIO',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=225&fit=crop',
    externalUrl: 'https://open.spotify.com/episode/example2',
    tags: ['Podcast', 'Salud Mental'],
    featured: false,
    episodeCount: 8,
    platform: 'Spotify',
  },
  {
    id: 'media-5',
    title: 'Guía de Estudio: Identidad en Cristo',
    slug: 'guia-identidad-en-cristo',
    description:
      'Material complementario para el discipulado sobre Identidad en Cristo.',
    type: 'DOCUMENT',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=225&fit=crop',
    fileUrl: '/docs/guia-identidad.pdf',
    tags: ['Guía', 'Discipulado'],
    featured: false,
  },
  {
    id: 'media-6',
    title: 'Manual de Liderazgo J+',
    slug: 'manual-liderazgo',
    description: 'Principios y prácticas para líderes de comunidad.',
    type: 'DOCUMENT',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
    fileUrl: '/docs/manual-liderazgo.pdf',
    tags: ['Liderazgo', 'Manual'],
    featured: false,
  },
];

// ── Calendar ──

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: 'cal-1',
    title: 'Reunión J+',
    start: '2026-04-04T19:00:00.000Z',
    end: '2026-04-04T21:00:00.000Z',
    description: 'Reunión semanal de la comunidad',
  },
  {
    id: 'cal-2',
    title: 'Reunión J+',
    start: '2026-04-11T19:00:00.000Z',
    end: '2026-04-11T21:00:00.000Z',
    description: 'Reunión semanal de la comunidad',
  },
  {
    id: 'cal-3',
    title: 'Discipulado: Conociendo al Padre',
    start: '2026-04-07T19:00:00.000Z',
    end: '2026-04-07T20:30:00.000Z',
  },
  {
    id: 'cal-4',
    title: 'Discipulado: Mayordomía y Propósito',
    start: '2026-04-08T19:00:00.000Z',
    end: '2026-04-08T20:30:00.000Z',
  },
  {
    id: 'cal-5',
    title: 'Discipulado: Relaciones Sanas',
    start: '2026-04-09T19:00:00.000Z',
    end: '2026-04-09T20:30:00.000Z',
  },
  {
    id: 'cal-6',
    title: 'Noche de Alabanza J+',
    start: '2026-04-18T19:00:00.000Z',
    end: '2026-04-18T21:30:00.000Z',
    description: 'Noche especial de adoración y alabanza',
  },
  {
    id: 'cal-7',
    title: 'Reunión J+',
    start: '2026-04-18T19:00:00.000Z',
    end: '2026-04-18T21:00:00.000Z',
  },
  {
    id: 'cal-8',
    title: 'Retiro de Jóvenes',
    start: '2026-04-25T09:00:00.000Z',
    end: '2026-04-26T17:00:00.000Z',
    description: 'Fin de semana de retiro en Finca El Refugio',
  },
  {
    id: 'cal-9',
    title: 'Reunión J+',
    start: '2026-04-25T19:00:00.000Z',
    end: '2026-04-25T21:00:00.000Z',
  },
  {
    id: 'cal-10',
    title: 'Discipulado: Identidad — Sesión 4',
    start: '2026-04-16T18:30:00.000Z',
    end: '2026-04-16T20:00:00.000Z',
  },
  {
    id: 'cal-11',
    title: 'Conferencia J+ 2026',
    start: '2026-05-15T18:00:00.000Z',
    end: '2026-05-17T22:00:00.000Z',
    description: 'Conferencia anual J+ — 3 días',
  },
];
