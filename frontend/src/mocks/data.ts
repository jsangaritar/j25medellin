import type {
  CalendarEvent,
  Course,
  CourseTopic,
  Event,
  MediaContent,
  SiteConfig,
  StrapiResponse,
} from '../types';

// --------------- Site Config ---------------

export const mockSiteConfig: StrapiResponse<SiteConfig> = {
  data: {
    heroTitle: 'Tu lugar para\ncrecer, conectar\ny transformarte.',
    heroSubtitle:
      'Discipulados, comunidad y contenido para tu crecimiento espiritual. Un ministerio joven donde la fe se vive con propósito.',
    heroImage: {
      id: 1,
      url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1440&q=80',
    },
    whatsappNumber: '+573001234567',
    instagramUrl: 'https://instagram.com/j25medellin',
    youtubeUrl: 'https://youtube.com/@j25medellin',
    contactEmail: 'contacto@j25medellin.com',
    googleCalendarUrl: '',
  },
  meta: {},
};

// --------------- Events ---------------

const eventImages = [
  'https://images.unsplash.com/photo-1697212377570-209a5bf55b4b?w=800&q=80',
  'https://images.unsplash.com/photo-1562707653-09b61210b3f9?w=800&q=80',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
  'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80',
];

export const mockEvents: StrapiResponse<Event[]> = {
  data: [
    {
      id: 1,
      documentId: 'evt-1',
      title: 'Conferencia 25+ 2026',
      slug: 'conferencia-25-2026',
      description:
        '3 días de comunidad, alabanza y crecimiento espiritual. Un evento transformador que no te puedes perder.',
      date: '2026-04-17T18:00:00.000Z',
      endDate: '2026-04-19T21:00:00.000Z',
      location: 'Iglesia El Lugar, Medellín',
      image: { id: 10, url: eventImages[0] },
      tags: ['conferencia', 'alabanza'],
      featured: true,
      requiresRegistration: true,
      whatsappMessage: 'Hola, quiero inscribirme a la Conferencia 25+ 2026',
    },
    {
      id: 2,
      documentId: 'evt-2',
      title: 'Noche de Alabanza 25+',
      slug: 'noche-alabanza-25',
      description:
        'Una noche especial de adoración y comunidad. Ven con tu grupo de amigos.',
      date: '2026-03-14T19:30:00.000Z',
      location: 'Iglesia El Lugar, Medellín',
      image: { id: 11, url: eventImages[1] },
      tags: ['alabanza', 'comunidad'],
      featured: false,
      requiresRegistration: false,
    },
    {
      id: 3,
      documentId: 'evt-3',
      title: 'Retiro de Jóvenes',
      slug: 'retiro-jovenes-2026',
      description:
        'Un fin de semana de conexión, reflexión y diversión en la naturaleza.',
      date: '2026-03-28T06:00:00.000Z',
      endDate: '2026-03-29T16:00:00.000Z',
      location: 'Finca El Refugio, Rionegro',
      image: { id: 12, url: eventImages[2] },
      tags: ['retiro', 'comunidad'],
      featured: false,
      requiresRegistration: true,
      whatsappMessage: 'Hola, quiero info sobre el Retiro de Jóvenes',
    },
    {
      id: 4,
      documentId: 'evt-4',
      title: 'Discipulado: Identidad — Sesión 4',
      slug: 'discipulado-identidad-sesion-4',
      description:
        'Continuamos explorando quiénes somos en Cristo. Sesión abierta.',
      date: '2026-03-05T18:30:00.000Z',
      location: 'Iglesia El Lugar, Medellín',
      image: { id: 13, url: eventImages[3] },
      tags: ['discipulado'],
      featured: false,
      requiresRegistration: false,
    },
  ],
  meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 4 } },
};

// --------------- Course Topic (Quarterly Theme) ---------------

const courseImages = [
  'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&q=80',
  'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
];

const topicCourses: Course[] = [
  {
    id: 1,
    documentId: 'crs-1',
    title: 'Conociendo al Padre',
    slug: 'conociendo-al-padre',
    description:
      'Un recorrido por las escrituras para descubrir el carácter de Dios y profundizar tu relación con Él.',
    image: { id: 20, url: courseImages[0] },
    tags: ['identidad', 'fundamentos'],
    status: 'ACTIVE',
    startDate: '2026-03-03T19:00:00.000Z',
    endDate: '2026-05-26T21:00:00.000Z',
    schedule: 'Martes 7:00 PM',
    location: 'Iglesia El Lugar',
    whatsappMessage: 'Hola, quiero inscribirme a la línea Conociendo al Padre',
    lineNumber: 1,
    accentColor: '#4ADE80',
    capacity: 25,
    enrolled: 18,
  },
  {
    id: 2,
    documentId: 'crs-2',
    title: 'Mayordomía y Propósito',
    slug: 'mayordomia-y-proposito',
    description:
      'Aprende a administrar tu tiempo, talentos y recursos con sabiduría para vivir el propósito de Dios.',
    image: { id: 21, url: courseImages[1] },
    tags: ['mayordomía', 'propósito'],
    status: 'ACTIVE',
    startDate: '2026-03-04T19:00:00.000Z',
    endDate: '2026-05-27T21:00:00.000Z',
    schedule: 'Miércoles 7:00 PM',
    location: 'Iglesia El Lugar',
    whatsappMessage:
      'Hola, quiero inscribirme a la línea Mayordomía y Propósito',
    lineNumber: 2,
    accentColor: '#A78BFA',
    capacity: 25,
    enrolled: 12,
  },
  {
    id: 3,
    documentId: 'crs-3',
    title: 'Relaciones Sanas',
    slug: 'relaciones-sanas',
    description:
      'Principios bíblicos para construir relaciones saludables en cada área de tu vida.',
    image: { id: 22, url: courseImages[2] },
    tags: ['relaciones', 'crecimiento'],
    status: 'ACTIVE',
    startDate: '2026-03-05T19:00:00.000Z',
    endDate: '2026-05-28T21:00:00.000Z',
    schedule: 'Jueves 7:00 PM',
    location: 'Iglesia El Lugar',
    whatsappMessage: 'Hola, quiero inscribirme a la línea Relaciones Sanas',
    lineNumber: 3,
    accentColor: '#60A5FA',
    capacity: 25,
    enrolled: 23,
  },
];

export const mockCourseTopic: StrapiResponse<CourseTopic> = {
  data: {
    id: 1,
    documentId: 'topic-1',
    title: 'Identidad en Cristo',
    description:
      'Descubre quién eres realmente a través de las escrituras. Tres líneas de profundización paralelas, cada una con cupo máximo de 25 personas.',
    tag: 'TEMA ACTUAL · MAR — MAY 2026',
    startDate: '2026-03-01T00:00:00.000Z',
    endDate: '2026-05-31T23:59:59.000Z',
    courses: topicCourses,
  },
  meta: {},
};

export const mockCourses: StrapiResponse<Course[]> = {
  data: topicCourses,
  meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 3 } },
};

// --------------- Media Content ---------------

const mediaImages = [
  'https://images.unsplash.com/photo-1591115306488-71115a4b4d7c?w=800&q=80',
  'https://images.unsplash.com/photo-1628452800825-c2d5682e016a?w=800&q=80',
  'https://images.unsplash.com/photo-1729252091017-67ca27b97f84?w=800&q=80',
  'https://images.unsplash.com/photo-1720687094248-3bad21fe1988?w=800&q=80',
  'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&q=80',
  'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=800&q=80',
];

export const mockMediaContents: StrapiResponse<MediaContent[]> = {
  data: [
    {
      id: 1,
      documentId: 'med-1',
      title: 'Alabanza 25+ — Taller en Vivo: Adoración que Transforma',
      slug: 'alabanza-25-taller-adoracion',
      description:
        'Un taller práctico sobre cómo la adoración genuina transforma nuestra vida y la de quienes nos rodean. Grabado en vivo durante la conferencia 25+ 2025.',
      type: 'VIDEO',
      thumbnailImage: { id: 30, url: mediaImages[0] },
      externalUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      tags: ['alabanza', 'conferencia'],
      featured: true,
      platform: 'YouTube',
    },
    {
      id: 2,
      documentId: 'med-2',
      title: 'Podcast 25+ Ep. 12 — Fe y Propósito',
      slug: 'podcast-25-ep12-fe-proposito',
      description:
        'Conversamos sobre cómo encontrar tu propósito de vida a la luz de la fe. Con invitados especiales.',
      type: 'AUDIO',
      thumbnailImage: { id: 31, url: mediaImages[1] },
      externalUrl: 'https://open.spotify.com/episode/example',
      tags: ['podcast', 'propósito'],
      featured: false,
      episodeCount: 12,
      platform: 'Spotify',
    },
    {
      id: 3,
      documentId: 'med-3',
      title: 'Reflexión: El Amor que Todo lo Cambia',
      slug: 'reflexion-amor-todo-lo-cambia',
      description:
        'Una reflexión profunda sobre 1 Corintios 13 y cómo aplicar el amor en nuestras relaciones diarias.',
      type: 'VIDEO',
      thumbnailImage: { id: 32, url: mediaImages[2] },
      externalUrl: 'https://www.youtube.com/watch?v=example2',
      tags: ['reflexión', 'amor'],
      featured: false,
      platform: 'YouTube',
    },
    {
      id: 4,
      documentId: 'med-4',
      title: 'Guía de Estudio: Identidad en Cristo',
      slug: 'guia-estudio-identidad',
      description:
        'Material complementario para el discipulado de Identidad. Incluye preguntas de reflexión y lecturas bíblicas.',
      type: 'DOCUMENT',
      thumbnailImage: { id: 33, url: mediaImages[3] },
      tags: ['guía', 'identidad', 'discipulado'],
      featured: false,
    },
    {
      id: 5,
      documentId: 'med-5',
      title: 'Conferencia 25+ 2025 — Sesión Principal',
      slug: 'conferencia-25-2025-sesion-principal',
      description:
        'La sesión principal de la conferencia 25+ 2025. Un mensaje poderoso sobre el llamado de esta generación.',
      type: 'VIDEO',
      thumbnailImage: { id: 34, url: mediaImages[4] },
      externalUrl: 'https://www.youtube.com/watch?v=example3',
      tags: ['conferencia', 'mensaje'],
      featured: false,
      platform: 'YouTube',
    },
    {
      id: 6,
      documentId: 'med-6',
      title: 'Podcast 25+ Ep. 11 — Salud Mental y Fe',
      slug: 'podcast-25-ep11-salud-mental',
      description:
        'Hablamos sobre salud mental desde una perspectiva de fe. Mitos, realidades y cómo buscar ayuda.',
      type: 'AUDIO',
      thumbnailImage: { id: 35, url: mediaImages[5] },
      externalUrl: 'https://open.spotify.com/episode/example2',
      tags: ['podcast', 'salud mental'],
      featured: false,
      episodeCount: 11,
      platform: 'Spotify',
    },
  ],
  meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 6 } },
};

// --------------- Calendar Events ---------------

export const mockCalendarEvents: { events: CalendarEvent[] } = {
  events: [
    {
      id: 'cal-1',
      title: 'Reunión J+',
      start: '2026-02-12T18:30:00.000Z',
      end: '2026-02-12T20:30:00.000Z',
      description: 'Reunión semanal de jóvenes',
    },
    {
      id: 'cal-2',
      title: 'Alabanza',
      start: '2026-02-14T19:00:00.000Z',
      end: '2026-02-14T21:00:00.000Z',
      description: 'Noche de alabanza',
    },
    {
      id: 'cal-3',
      title: 'Reunión J+',
      start: '2026-02-19T18:30:00.000Z',
      end: '2026-02-19T20:30:00.000Z',
      description: 'Reunión semanal de jóvenes',
    },
    {
      id: 'cal-4',
      title: 'Alabanza 25+',
      start: '2026-02-21T19:00:00.000Z',
      end: '2026-02-21T21:00:00.000Z',
      description: 'Noche especial de alabanza',
    },
    {
      id: 'cal-5',
      title: 'Reunión J+',
      start: '2026-02-26T18:30:00.000Z',
      end: '2026-02-26T20:30:00.000Z',
      description: 'Reunión semanal de jóvenes',
    },
    {
      id: 'cal-6',
      title: 'Discipulado: Identidad',
      start: '2026-02-04T18:30:00.000Z',
      end: '2026-02-04T20:00:00.000Z',
    },
    {
      id: 'cal-7',
      title: 'Discipulado: Identidad',
      start: '2026-02-11T18:30:00.000Z',
      end: '2026-02-11T20:00:00.000Z',
    },
    {
      id: 'cal-8',
      title: 'Discipulado: Identidad',
      start: '2026-02-18T18:30:00.000Z',
      end: '2026-02-18T20:00:00.000Z',
    },
    {
      id: 'cal-9',
      title: 'Discipulado: Identidad',
      start: '2026-02-25T18:30:00.000Z',
      end: '2026-02-25T20:00:00.000Z',
    },
    {
      id: 'cal-10',
      title: 'Noche de Alabanza 25+',
      start: '2026-03-14T19:30:00.000Z',
      end: '2026-03-14T21:30:00.000Z',
      description: 'Noche especial de alabanza y adoración',
    },
    {
      id: 'cal-11',
      title: 'Retiro de Jóvenes',
      start: '2026-03-28T06:00:00.000Z',
      end: '2026-03-29T16:00:00.000Z',
      description: 'Fin de semana de retiro',
    },
  ],
};
