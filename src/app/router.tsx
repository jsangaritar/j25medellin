import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';

// Public pages — eager load for fast navigation
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';

// Public pages — lazy load (less visited)
const EventosPage = lazy(() =>
  import('@/pages/EventosPage').then((m) => ({ default: m.EventosPage })),
);
const DiscipuladosPage = lazy(() =>
  import('@/pages/DiscipuladosPage').then((m) => ({
    default: m.DiscipuladosPage,
  })),
);
const MediaPage = lazy(() =>
  import('@/pages/MediaPage').then((m) => ({ default: m.MediaPage })),
);
const VideoDetailPage = lazy(() =>
  import('@/pages/VideoDetailPage').then((m) => ({
    default: m.VideoDetailPage,
  })),
);
const AudioDetailPage = lazy(() =>
  import('@/pages/AudioDetailPage').then((m) => ({
    default: m.AudioDetailPage,
  })),
);
const DocumentDetailPage = lazy(() =>
  import('@/pages/DocumentDetailPage').then((m) => ({
    default: m.DocumentDetailPage,
  })),
);

// Admin pages — lazy load (admin-only, not needed on first visit)
const LoginPage = lazy(() =>
  import('@/pages/admin/LoginPage').then((m) => ({ default: m.LoginPage })),
);
const AdminLayout = lazy(() =>
  import('@/pages/admin/AdminLayout').then((m) => ({
    default: m.AdminLayout,
  })),
);
const DashboardPage = lazy(() =>
  import('@/pages/admin/DashboardPage').then((m) => ({
    default: m.DashboardPage,
  })),
);
const EventsAdminPage = lazy(() =>
  import('@/pages/admin/EventsAdminPage').then((m) => ({
    default: m.EventsAdminPage,
  })),
);
const CoursesAdminPage = lazy(() =>
  import('@/pages/admin/CoursesAdminPage').then((m) => ({
    default: m.CoursesAdminPage,
  })),
);
const MediaAdminPage = lazy(() =>
  import('@/pages/admin/MediaAdminPage').then((m) => ({
    default: m.MediaAdminPage,
  })),
);
const RegistrationsPage = lazy(() =>
  import('@/pages/admin/RegistrationsPage').then((m) => ({
    default: m.RegistrationsPage,
  })),
);
const SiteConfigPage = lazy(() =>
  import('@/pages/admin/SiteConfigPage').then((m) => ({
    default: m.SiteConfigPage,
  })),
);

function Loading() {
  return (
    <div className="mx-auto max-w-[1440px] px-14 py-16 max-md:px-5 max-md:py-10">
      <div className="flex flex-col gap-6">
        <div className="h-8 w-48 animate-pulse rounded-md bg-bg-elevated" />
        <div className="h-5 w-96 animate-pulse rounded-md bg-bg-elevated max-md:w-full" />
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-[300px] animate-pulse rounded-xl bg-bg-elevated" />
          <div className="h-[300px] animate-pulse rounded-xl bg-bg-elevated" />
          <div className="h-[300px] animate-pulse rounded-xl bg-bg-elevated" />
        </div>
      </div>
    </div>
  );
}

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'discipulados',
        element: (
          <SuspenseWrapper>
            <DiscipuladosPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'media',
        element: (
          <SuspenseWrapper>
            <MediaPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'media/video/:slug',
        element: (
          <SuspenseWrapper>
            <VideoDetailPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'media/audio/:slug',
        element: (
          <SuspenseWrapper>
            <AudioDetailPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'media/documento/:slug',
        element: (
          <SuspenseWrapper>
            <DocumentDetailPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'eventos',
        element: (
          <SuspenseWrapper>
            <EventosPage />
          </SuspenseWrapper>
        ),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/admin/login',
    element: (
      <SuspenseWrapper>
        <LoginPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/admin',
    element: (
      <SuspenseWrapper>
        <AdminLayout />
      </SuspenseWrapper>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'events', element: <EventsAdminPage /> },
      { path: 'courses', element: <CoursesAdminPage /> },
      { path: 'media', element: <MediaAdminPage /> },
      { path: 'registrations', element: <RegistrationsPage /> },
      { path: 'settings', element: <SiteConfigPage /> },
    ],
  },
]);
