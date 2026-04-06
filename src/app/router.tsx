import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';
import { AudioDetailPage } from '@/pages/AudioDetailPage';
import { AdminLayout } from '@/pages/admin/AdminLayout';
import { CoursesAdminPage } from '@/pages/admin/CoursesAdminPage';
import { DashboardPage } from '@/pages/admin/DashboardPage';
import { EventsAdminPage } from '@/pages/admin/EventsAdminPage';
import { LoginPage } from '@/pages/admin/LoginPage';
import { MediaAdminPage } from '@/pages/admin/MediaAdminPage';
import { RegistrationsPage } from '@/pages/admin/RegistrationsPage';
import { SiteConfigPage } from '@/pages/admin/SiteConfigPage';
import { DiscipuladosPage } from '@/pages/DiscipuladosPage';
import { DocumentDetailPage } from '@/pages/DocumentDetailPage';
import { EventosPage } from '@/pages/EventosPage';
import { HomePage } from '@/pages/HomePage';
import { MediaPage } from '@/pages/MediaPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { VideoDetailPage } from '@/pages/VideoDetailPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'discipulados', element: <DiscipuladosPage /> },
      { path: 'media', element: <MediaPage /> },
      { path: 'media/video/:slug', element: <VideoDetailPage /> },
      { path: 'media/audio/:slug', element: <AudioDetailPage /> },
      { path: 'media/documento/:slug', element: <DocumentDetailPage /> },
      { path: 'eventos', element: <EventosPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/admin/login',
    element: <LoginPage />,
  },
  {
    path: '/admin',
    element: <AdminLayout />,
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
