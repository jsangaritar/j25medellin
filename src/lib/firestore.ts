import type {
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import type {
  CalendarEvent,
  Course,
  Event,
  MediaContent,
  MediaType,
  RegistrationInput,
  SiteConfig,
  Topic,
} from '@/types';
import { db } from './firebase';

// ── Helpers ──

function queryDocToData<T>(
  snapshot: QueryDocumentSnapshot,
): T & { id: string } {
  return { id: snapshot.id, ...(snapshot.data() as T) };
}

function docSnapshotToData<T>(
  snapshot: DocumentSnapshot,
): (T & { id: string }) | null {
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...(snapshot.data() as T) };
}

// ── Events ──

export async function getEvents(filters?: {
  featured?: boolean;
}): Promise<Event[]> {
  const constraints = [];
  if (filters?.featured !== undefined) {
    constraints.push(where('featured', '==', filters.featured));
  }
  const q = query(collection(db, 'events'), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(queryDocToData<Event>);
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const q = query(collection(db, 'events'), where('slug', '==', slug));
  const snapshot = await getDocs(q);
  return snapshot.empty ? null : queryDocToData<Event>(snapshot.docs[0]);
}

// ── Courses ──

export async function getCourses(filters?: {
  status?: string[];
}): Promise<Course[]> {
  const constraints = [];
  if (filters?.status?.length) {
    constraints.push(where('status', 'in', filters.status));
  }
  const q = query(collection(db, 'courses'), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(queryDocToData<Course>);
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const q = query(collection(db, 'courses'), where('slug', '==', slug));
  const snapshot = await getDocs(q);
  return snapshot.empty ? null : queryDocToData<Course>(snapshot.docs[0]);
}

async function populateTopicCourses(topic: Topic): Promise<Topic> {
  if (!topic.courseIds?.length) return topic;
  const courseDocs = await Promise.all(
    topic.courseIds.map((id) => getDoc(doc(db, 'courses', id))),
  );
  topic.courses = courseDocs
    .map((d) => docSnapshotToData<Course>(d))
    .filter((c): c is Course & { id: string } => c !== null);
  return topic;
}

export async function getCourseTopic(): Promise<Topic | null> {
  const now = new Date().toISOString();
  const q = query(collection(db, 'courseTopics'), where('endDate', '>=', now));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return populateTopicCourses(queryDocToData<Topic>(snapshot.docs[0]));
}

export async function getAllCourseTopics(): Promise<Topic[]> {
  const q = query(collection(db, 'courseTopics'));
  const snapshot = await getDocs(q);
  const topics = snapshot.docs.map(queryDocToData<Topic>);
  return Promise.all(topics.map(populateTopicCourses));
}

export async function getTopics(): Promise<Topic[]> {
  const q = query(collection(db, 'courseTopics'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(queryDocToData<Topic>);
}

// ── Media ──

export async function getMediaContents(filters?: {
  type?: MediaType;
  featured?: boolean;
}): Promise<MediaContent[]> {
  const constraints = [];
  if (filters?.type) {
    constraints.push(where('type', '==', filters.type));
  }
  if (filters?.featured !== undefined) {
    constraints.push(where('featured', '==', filters.featured));
  }
  const q = query(collection(db, 'mediaContents'), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(queryDocToData<MediaContent>);
}

export async function getMediaBySlug(
  slug: string,
): Promise<MediaContent | null> {
  const q = query(collection(db, 'mediaContents'), where('slug', '==', slug));
  const snapshot = await getDocs(q);
  return snapshot.empty ? null : queryDocToData<MediaContent>(snapshot.docs[0]);
}

// ── Site Config ──

export async function getSiteConfig(): Promise<SiteConfig> {
  const snapshot = await getDoc(doc(db, 'settings', 'config'));
  if (!snapshot.exists()) {
    throw new Error('Site config not found');
  }
  return snapshot.data() as SiteConfig;
}

// ── Registrations ──

export async function createRegistration(
  data: RegistrationInput,
): Promise<string> {
  const docRef = await addDoc(collection(db, 'registrations'), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// ── Calendar Cache ──

export async function getCachedCalendarEvents(): Promise<CalendarEvent[]> {
  const cacheDoc = await getDoc(doc(db, 'cache', 'calendar'));
  if (!cacheDoc.exists()) return [];
  const data = cacheDoc.data();
  return (data.events ?? []) as CalendarEvent[];
}

// ── Admin CRUD ──

export async function createDocument<T extends Record<string, unknown>>(
  collectionName: string,
  data: T,
): Promise<string> {
  const docRef = await addDoc(collection(db, collectionName), data);
  return docRef.id;
}

export async function updateDocument(
  collectionName: string,
  id: string,
  data: Record<string, unknown>,
): Promise<void> {
  const docRef = doc(db, collectionName, id);
  await setDoc(docRef, data, { merge: true });
}

export async function deleteDocument(
  collectionName: string,
  id: string,
): Promise<void> {
  await deleteDoc(doc(db, collectionName, id));
}

export async function setDocument<T extends Record<string, unknown>>(
  collectionName: string,
  id: string,
  data: T,
): Promise<void> {
  await setDoc(doc(db, collectionName, id), data);
}
