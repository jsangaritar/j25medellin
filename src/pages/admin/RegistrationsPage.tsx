import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Download, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ConfirmDelete } from '@/components/ui/confirm-delete';
import { type Column, DataTable } from '@/components/ui/data-table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCourses } from '@/hooks/useCourses';
import { useEvents } from '@/hooks/useEvents';
import { auth, db } from '@/lib/firebase';
import type { Registration } from '@/types';

function useRegistrations() {
  return useQuery({
    queryKey: ['registrations'],
    queryFn: async () => {
      const q = query(
        collection(db, 'registrations'),
        orderBy('createdAt', 'desc'),
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Registration[];
    },
  });
}

function exportCsv(
  registrations: Registration[],
  courseMap: Map<string, string>,
  eventMap: Map<string, string>,
) {
  const headers = ['Nombre', 'WhatsApp', 'Email', 'Evento', 'Curso', 'Fecha'];
  const rows = registrations.map((r) => [
    r.fullName,
    r.whatsApp,
    r.email,
    r.eventId ? (eventMap.get(r.eventId) ?? r.eventId) : '',
    r.courseId ? (courseMap.get(r.courseId) ?? r.courseId) : '',
    r.createdAt ?? '',
  ]);
  const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `inscripciones-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function RegistrationsPage() {
  const { data: registrations = [] } = useRegistrations();
  const { data: courses = [] } = useCourses();
  const { data: events = [] } = useEvents();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [fullName, setFullName] = useState('');
  const [whatsApp, setWhatsApp] = useState('');
  const [email, setEmail] = useState('');
  const [courseId, setCourseId] = useState('');
  const [eventId, setEventId] = useState('');

  const createMutation = useMutation({
    mutationFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          fullName,
          whatsApp,
          email,
          eventId: eventId || undefined,
          courseId: courseId || undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Registration failed');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      queryClient.invalidateQueries({ queryKey: ['courseTopics'] });
      setDialogOpen(false);
      setFullName('');
      setWhatsApp('');
      setEmail('');
      setCourseId('');
      setEventId('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/delete-registration', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Delete failed');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['courseTopics'] });
    },
  });

  // Map IDs to names for display
  const courseMap = new Map(courses.map((c) => [c.id, c.title]));
  const eventMap = new Map(events.map((e) => [e.id, e.title]));

  const regColumns: Column<Registration>[] = [
    {
      key: 'fullName',
      label: 'Nombre',
      sortValue: (r) => r.fullName.toLowerCase(),
      filterValue: (r) => r.fullName,
      render: (r) => <span className="font-medium">{r.fullName}</span>,
    },
    {
      key: 'whatsApp',
      label: 'WhatsApp',
      filterValue: (r) => r.whatsApp,
      render: (r) => r.whatsApp,
    },
    {
      key: 'email',
      label: 'Email',
      sortValue: (r) => r.email.toLowerCase(),
      filterValue: (r) => r.email,
      render: (r) => r.email,
    },
    {
      key: 'event',
      label: 'Evento',
      filterValue: (r) => (r.eventId ? (eventMap.get(r.eventId) ?? '') : ''),
      render: (r) => (r.eventId ? (eventMap.get(r.eventId) ?? r.eventId) : '—'),
    },
    {
      key: 'course',
      label: 'Curso',
      filterValue: (r) => (r.courseId ? (courseMap.get(r.courseId) ?? '') : ''),
      render: (r) =>
        r.courseId ? (courseMap.get(r.courseId) ?? r.courseId) : '—',
    },
    {
      key: 'actions',
      label: '',
      className: 'w-12',
      render: (r) => (
        <button
          type="button"
          onClick={() => setDeleteTarget({ id: r.id, name: r.fullName })}
          className="rounded p-1.5 text-text-muted hover:bg-bg-elevated hover:text-destructive"
        >
          <Trash2 className="size-3.5" />
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Inscripciones
        </h1>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => exportCsv(registrations, courseMap, eventMap)}
            disabled={registrations.length === 0}
          >
            <Download className="mr-2 size-4" />
            Exportar CSV
          </Button>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 size-4" />
            Crear inscripción
          </Button>
        </div>
      </div>

      <DataTable
        columns={regColumns}
        data={registrations}
        keyFn={(r) => r.id}
        searchable
        searchPlaceholder="Buscar inscripciones..."
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="border-border bg-bg-elevated shadow-[0_8px_30px_rgba(0,0,0,0.5)] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-text-primary">
              Crear inscripción
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createMutation.mutate();
            }}
            className="flex flex-col gap-4"
          >
            <div className="space-y-2">
              <Label>
                Nombre completo<span className="text-text-primary">*</span>
              </Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>
                WhatsApp<span className="text-text-primary">*</span>
              </Label>
              <Input
                value={whatsApp}
                onChange={(e) => setWhatsApp(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>
                Correo electrónico<span className="text-text-primary">*</span>
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Curso</Label>
              <Select value={courseId} onValueChange={setCourseId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar curso" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Evento</Label>
              <Select value={eventId} onValueChange={setEventId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar evento" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((ev) => (
                    <SelectItem key={ev.id} value={ev.id}>
                      {ev.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Guardando...' : 'Crear'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDelete
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        itemName={deleteTarget?.name}
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
