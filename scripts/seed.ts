/**
 * Seed Firestore with initial data from mock fixtures.
 *
 * Usage: npx tsx scripts/seed.ts
 *
 * Requires FIREBASE_SERVICE_ACCOUNT_KEY in .env
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import admin from 'firebase-admin';

// Load .env manually (no dotenv dependency)
const envPath = resolve(import.meta.dirname, '..', '.env');
const envFile = readFileSync(envPath, 'utf-8');
const envVars: Record<string, string> = {};
for (const line of envFile.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIndex = trimmed.indexOf('=');
  if (eqIndex === -1) continue;
  const key = trimmed.slice(0, eqIndex);
  let value = trimmed.slice(eqIndex + 1);
  if (value.startsWith('"') && value.endsWith('"')) {
    value = value.slice(1, -1);
  }
  envVars[key] = value;
}

const serviceAccountKey = envVars.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!serviceAccountKey) {
  console.error('Missing FIREBASE_SERVICE_ACCOUNT_KEY in .env');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccountKey)),
});

const db = admin.firestore();

// ── Site Config ──

const siteConfig = {
  heroTitle: 'Tu lugar para\ncrecer, conectar\ny transformarte.',
  heroSubtitle:
    'Discipulados, comunidad y contenido para tu crecimiento espiritual.\nUn ministerio joven donde la fe se vive con propósito.',
  heroImageUrl:
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1440&h=680&fit=crop',
  whatsappNumber: '573001234567',
  instagramUrl: 'https://instagram.com/j25medellin',
  youtubeUrl: 'https://youtube.com/@j25medellin',
  contactEmail: 'contacto@j25medellin.com',
};

// ── Events ──

const events = [
  {
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

const courses = [
  {
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
    whatsappMessage:
      'Hola, quiero inscribirme al curso Mayordomía y Propósito',
  },
  {
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

// ── Media ──

const mediaContents = [
  {
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

// ── Seed ──

async function seed() {
  console.log('Seeding Firestore...\n');

  // Site config
  console.log('→ settings/config');
  await db.doc('settings/config').set(siteConfig);

  // Events
  for (const event of events) {
    const ref = await db.collection('events').add(event);
    console.log(`→ events/${ref.id} — ${event.title}`);
  }

  // Courses (collect IDs for topic)
  const courseIds: string[] = [];
  for (const course of courses) {
    const ref = await db.collection('courses').add(course);
    courseIds.push(ref.id);
    console.log(`→ courses/${ref.id} — ${course.title}`);
  }

  // Course topic
  const topic = {
    title: 'Identidad en Cristo',
    description:
      'Descubre quién eres realmente a través de las escrituras. Tres líneas de profundización paralelas, cada una con cupo máximo de 25 personas.',
    tag: 'TEMA ACTUAL · MAR — MAY 2026',
    startDate: '2026-03-01T00:00:00.000Z',
    endDate: '2026-05-31T00:00:00.000Z',
    courseIds,
  };
  const topicRef = await db.collection('courseTopics').add(topic);
  console.log(`→ courseTopics/${topicRef.id} — ${topic.title}`);

  // Media
  for (const media of mediaContents) {
    const ref = await db.collection('mediaContents').add(media);
    console.log(`→ mediaContents/${ref.id} — ${media.title}`);
  }

  console.log('\n✓ Seed complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
