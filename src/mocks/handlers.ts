import { HttpResponse, http } from 'msw';
import {
  mockCalendarEvents,
  mockCourses,
  mockCourseTopic,
  mockEvents,
  mockMediaContents,
  mockSiteConfig,
} from './data';

const API_BASE = '/api';

export const handlers = [
  // Site config
  http.get(`${API_BASE}/site-config`, () => {
    return HttpResponse.json(mockSiteConfig);
  }),

  // Events
  http.get(`${API_BASE}/events`, ({ request }) => {
    const url = new URL(request.url);
    const featured = url.searchParams.get('featured');
    let events = mockEvents;
    if (featured === 'true') {
      events = events.filter((e) => e.featured);
    }
    return HttpResponse.json(events);
  }),

  http.get(`${API_BASE}/events/:slug`, ({ params }) => {
    const event = mockEvents.find((e) => e.slug === params.slug);
    if (!event) return HttpResponse.json(null, { status: 404 });
    return HttpResponse.json(event);
  }),

  // Courses
  http.get(`${API_BASE}/courses`, ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.getAll('status');
    let courses = mockCourses;
    if (status.length) {
      courses = courses.filter((c) => status.includes(c.status));
    }
    return HttpResponse.json(courses);
  }),

  http.get(`${API_BASE}/courses/:slug`, ({ params }) => {
    const course = mockCourses.find((c) => c.slug === params.slug);
    if (!course) return HttpResponse.json(null, { status: 404 });
    return HttpResponse.json(course);
  }),

  // Course topic
  http.get(`${API_BASE}/course-topic`, () => {
    return HttpResponse.json(mockCourseTopic);
  }),

  // Media
  http.get(`${API_BASE}/media`, ({ request }) => {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const featured = url.searchParams.get('featured');
    let media = mockMediaContents;
    if (type) {
      media = media.filter((m) => m.type === type);
    }
    if (featured === 'true') {
      media = media.filter((m) => m.featured);
    }
    return HttpResponse.json(media);
  }),

  http.get(`${API_BASE}/media/:slug`, ({ params }) => {
    const item = mockMediaContents.find((m) => m.slug === params.slug);
    if (!item) return HttpResponse.json(null, { status: 404 });
    return HttpResponse.json(item);
  }),

  // Calendar
  http.get(`${API_BASE}/calendar`, () => {
    return HttpResponse.json(mockCalendarEvents);
  }),

  // Registration
  http.post(`${API_BASE}/registrations`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      {
        id: `reg-${Date.now()}`,
        ...body,
        createdAt: new Date().toISOString(),
      },
      { status: 201 },
    );
  }),
];
