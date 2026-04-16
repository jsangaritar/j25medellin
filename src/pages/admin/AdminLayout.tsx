import {
  BookOpen,
  Calendar,
  Film,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from 'lucide-react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/lib/auth';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Eventos', href: '/admin/events', icon: Calendar },
  { label: 'Temas', href: '/admin/topics', icon: FolderOpen },
  { label: 'Cursos', href: '/admin/courses', icon: BookOpen },
  { label: 'Media', href: '/admin/media', icon: Film },
  { label: 'Inscripciones', href: '/admin/registrations', icon: Users },
  { label: 'Configuración', href: '/admin/settings', icon: Settings },
];

export function AdminLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen bg-bg-primary">
        <div className="w-56 border-r border-border bg-bg-surface p-4">
          <div className="mb-6 h-7 w-[68px] animate-pulse rounded bg-bg-elevated" />
          <div className="flex flex-col gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-9 animate-pulse rounded-lg bg-bg-elevated"
              />
            ))}
          </div>
        </div>
        <div className="flex-1 p-8">
          <div className="h-8 w-40 animate-pulse rounded-md bg-bg-elevated" />
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  return (
    <div className="flex min-h-screen bg-bg-primary">
      <aside className="flex w-56 flex-col border-r border-border bg-bg-surface">
        <div className="p-4">
          <Link to="/admin" className="flex items-center gap-2">
            <img src="/j25-logo.svg" alt="J+" className="h-7 scale-80" />
            <span className="text-lg font-bold">J+ Admin</span>
          </Link>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 px-2">
          {navItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-bg-elevated font-semibold text-text-primary'
                    : 'text-text-muted hover:bg-bg-elevated hover:text-text-primary',
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-2">
          <button
            type="button"
            onClick={() => signOut()}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-muted transition-colors hover:bg-bg-elevated hover:text-text-primary"
          >
            <LogOut className="size-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="flex-1 overflow-auto p-8 max-md:p-4">
        <Outlet />
      </div>
    </div>
  );
}
