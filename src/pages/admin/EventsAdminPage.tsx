import { useMutation, useQueryClient } from '@tanstack/react-query';
import { serverTimestamp } from 'firebase/firestore';
import { Calendar, Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { useEvents } from '@/hooks/useEvents';
import {
  createDocument,
  deleteDocument,
  updateDocument,
} from '@/lib/firestore';
import { syncCalendarEvents } from '@/lib/sync-calendar';
import { formatDriveIdToFetchableImage } from '@/lib/utils';
import type { Event, EventType } from '@/types';

type EventForm = Omit<Event, 'id'>;

const emptyForm: EventForm = {
  title: '',
  slug: '',
  description: '',
  date: '',
  endDate: '',
  location: 'Casa Sobre la Roca - Medellín',
  imageUrl: '',
  tags: [],
  featured: false,
  requiresRegistration: false,
  eventType: 'church',
};

export function EventsAdminPage() {
  const { data: events = [] } = useEvents();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm] = useState<EventForm>(emptyForm);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const data = {
        ...form,
        slug: form.slug || form.title.toLowerCase().replace(/\s+/g, '-'),
        tags:
          typeof form.tags === 'string'
            ? (form.tags as string).split(',').map((t: string) => t.trim())
            : form.tags,
        imageUrl: form.imageUrl
          ? form.imageUrl.includes('drive.google.com')
            ? formatDriveIdToFetchableImage(form.imageUrl)
            : form.imageUrl
          : undefined,
      };
      if (editing) {
        await updateDocument('events', editing.id, data);
      } else {
        await createDocument('events', {
          ...data,
          createdAt: serverTimestamp(),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setDialogOpen(false);
      setEditing(null);
      setForm(emptyForm);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteDocument('events', id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  });

  const syncMutation = useMutation({
    mutationFn: syncCalendarEvents,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setSyncResult(
        `Sincronizado: ${data.created} creados, ${data.updated} actualizados de ${data.total} eventos`,
      );
      setTimeout(() => setSyncResult(null), 5000);
    },
    onError: (error) => {
      setSyncResult(`Error: ${error.message}`);
      setTimeout(() => setSyncResult(null), 5000);
    },
  });

  const eventColumns: Column<Event>[] = [
    {
      key: 'title',
      label: 'Título',
      sortValue: (e) => e.title.toLowerCase(),
      filterValue: (e) => e.title,
      render: (e) => (
        <span className="flex items-center gap-2 font-medium">
          {e.title}
          {e.googleCalendarEventId && (
            <span
              className="relative"
              title={
                e.hasCustomContent
                  ? 'Contenido personalizado (difiere de Google Calendar)'
                  : 'Sincronizado con Google Calendar'
              }
            >
              <Calendar className="size-3.5 text-accent-muted" />
              {e.hasCustomContent && (
                <span className="absolute -right-1 -top-1 size-2 rounded-full bg-yellow-500" />
              )}
            </span>
          )}
        </span>
      ),
    },
    {
      key: 'eventType',
      label: 'Tipo',
      sortValue: (e) => e.eventType ?? 'j+',
      filterValue: (e) => (e.eventType === 'j+' ? 'J+' : 'Iglesia'),
      render: (e) => {
        const type = e.eventType ?? 'j+';
        return (
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
              type === 'j+'
                ? 'bg-accent-dim text-accent-bright'
                : 'bg-bg-elevated text-text-muted'
            }`}
          >
            {type === 'j+' ? 'J+' : 'Iglesia'}
          </span>
        );
      },
    },
    {
      key: 'date',
      label: 'Fecha',
      sortValue: (e) => new Date(e.date).getTime(),
      render: (e) => new Date(e.date).toLocaleDateString('es-CO'),
    },
    {
      key: 'location',
      label: 'Lugar',
      sortValue: (e) => e.location.toLowerCase(),
      filterValue: (e) => e.location,
      render: (e) => e.location,
    },
    {
      key: 'featured',
      label: 'Destacado',
      sortValue: (e) => (e.featured ? 1 : 0),
      render: (e) => (e.featured ? 'Sí' : 'No'),
    },
    {
      key: 'actions',
      label: '',
      className: 'w-24',
      render: (e) => (
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => openEdit(e)}
            className="rounded p-1.5 text-text-muted hover:bg-bg-elevated hover:text-text-primary"
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget({ id: e.id, name: e.title })}
            className="rounded p-1.5 text-text-muted hover:bg-bg-elevated hover:text-destructive"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ),
    },
  ];

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(event: Event) {
    setEditing(event);
    setForm({ ...event });
    setDialogOpen(true);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Eventos
        </h1>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => syncMutation.mutate()}
            disabled={syncMutation.isPending}
          >
            <RefreshCw
              className={`mr-2 size-4 ${syncMutation.isPending ? 'animate-spin' : ''}`}
            />
            {syncMutation.isPending ? 'Sincronizando...' : 'Sincronizar'}
          </Button>
          <Button onClick={openCreate}>
            <Plus className="mr-2 size-4" />
            Crear evento
          </Button>
        </div>
      </div>

      {syncResult && (
        <div
          className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
            syncResult.startsWith('Error')
              ? 'border-destructive/50 bg-destructive/10 text-destructive'
              : 'border-accent-bright/50 bg-accent-dim text-accent-bright'
          }`}
        >
          {syncResult}
        </div>
      )}

      <DataTable
        columns={eventColumns}
        data={events}
        keyFn={(e) => e.id}
        searchable
        searchPlaceholder="Buscar eventos..."
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto border-border bg-bg-elevated shadow-[0_8px_30px_rgba(0,0,0,0.5)] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-text-primary">
              {editing ? 'Editar evento' : 'Crear evento'}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveMutation.mutate();
            }}
            className="flex flex-col gap-4"
          >
            <div className="space-y-2">
              <Label>
                Título<span className="text-text-primary">*</span>
              </Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Fecha inicio<span className="text-text-primary">*</span>
                </Label>
                <Input
                  type="datetime-local"
                  value={form.date ? form.date.slice(0, 16) : ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      date: new Date(e.target.value).toISOString(),
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Fecha fin</Label>
                <Input
                  type="datetime-local"
                  value={form.endDate ? form.endDate.slice(0, 16) : ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      endDate: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : '',
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Lugar<span className="text-text-primary">*</span>
                </Label>
                <Input
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Tipo de evento<span className="text-text-primary">*</span>
                </Label>
                <Select
                  value={form.eventType}
                  onValueChange={(v) =>
                    setForm({ ...form, eventType: v as EventType })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="j+">J+</SelectItem>
                    <SelectItem value="church">Iglesia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>URL de imagen</Label>
              <Input
                value={form.imageUrl ?? ''}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Tags (separados por coma)</Label>
              <Input
                value={
                  Array.isArray(form.tags) ? form.tags.join(', ') : form.tags
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    tags: e.target.value as unknown as string[],
                  })
                }
              />
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-text-secondary">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) =>
                    setForm({ ...form, featured: e.target.checked })
                  }
                  className="rounded"
                />
                Destacado
              </label>
              <label className="flex items-center gap-2 text-sm text-text-secondary">
                <input
                  type="checkbox"
                  checked={form.requiresRegistration}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      requiresRegistration: e.target.checked,
                    })
                  }
                  className="rounded"
                />
                Requiere inscripción
              </label>
            </div>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Guardando...' : 'Guardar'}
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
