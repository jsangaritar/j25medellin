import { Outlet } from 'react-router-dom';

export function AdminLayout() {
  // TODO: Auth guard — redirect to /admin/login if not authenticated
  return (
    <div className="flex min-h-screen bg-bg-primary">
      <aside className="w-56 border-r border-border bg-bg-surface p-4">
        <p className="mb-4 font-display text-sm font-bold text-text-primary">
          Admin J+
        </p>
        <nav className="flex flex-col gap-1 text-sm text-text-muted">
          <a href="/admin" className="rounded px-3 py-2 hover:bg-bg-elevated">
            Dashboard
          </a>
          <a
            href="/admin/events"
            className="rounded px-3 py-2 hover:bg-bg-elevated"
          >
            Eventos
          </a>
          <a
            href="/admin/courses"
            className="rounded px-3 py-2 hover:bg-bg-elevated"
          >
            Cursos
          </a>
          <a
            href="/admin/media"
            className="rounded px-3 py-2 hover:bg-bg-elevated"
          >
            Media
          </a>
          <a
            href="/admin/registrations"
            className="rounded px-3 py-2 hover:bg-bg-elevated"
          >
            Inscripciones
          </a>
          <a
            href="/admin/settings"
            className="rounded px-3 py-2 hover:bg-bg-elevated"
          >
            Configuración
          </a>
        </nav>
      </aside>
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
}
