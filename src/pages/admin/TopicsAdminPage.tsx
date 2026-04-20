import { useMutation, useQueryClient } from '@tanstack/react-query';
import { serverTimestamp } from 'firebase/firestore';
import { Pencil, Plus, Trash2 } from 'lucide-react';
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
import { useTopics } from '@/hooks/useCourses';
import {
  createDocument,
  deleteDocument,
  updateDocument,
} from '@/lib/firestore';
import { COURSE_STATUS_LABELS, type CourseStatus, type Topic } from '@/types';

const STATUSES = Object.keys(COURSE_STATUS_LABELS) as CourseStatus[];

type TopicForm = Omit<Topic, 'id' | 'courses'>;

const MODALITY_OPTIONS = ['Presencial', 'Virtual', 'Híbrido'] as const;

const emptyForm: TopicForm = {
  title: '',
  description: '',
  tag: '',
  startDate: '',
  endDate: '',
  status: 'DRAFT',
  modality: 'Presencial',
  location: '',
  courseIds: [],
};

export function TopicsAdminPage() {
  const { data: topics = [] } = useTopics();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Topic | null>(null);
  const [form, setForm] = useState<TopicForm>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const data = { ...form };
      if (editing) {
        await updateDocument('courseTopics', editing.id, data);
      } else {
        await createDocument('courseTopics', {
          ...data,
          createdAt: serverTimestamp(),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      queryClient.invalidateQueries({ queryKey: ['courseTopics'] });
      setDialogOpen(false);
      setEditing(null);
      setForm(emptyForm);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteDocument('courseTopics', id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      queryClient.invalidateQueries({ queryKey: ['courseTopics'] });
    },
  });

  const topicColumns: Column<Topic>[] = [
    {
      key: 'title',
      label: 'Título',
      sortValue: (t) => t.title.toLowerCase(),
      filterValue: (t) => t.title,
      render: (t) => <span className="font-medium">{t.title}</span>,
    },
    {
      key: 'tag',
      label: 'Etiqueta',
      sortValue: (t) => t.tag.toLowerCase(),
      filterValue: (t) => t.tag,
      render: (t) => t.tag,
    },
    {
      key: 'status',
      label: 'Estado',
      sortValue: (t) => t.status,
      filterValue: (t) => COURSE_STATUS_LABELS[t.status] ?? '',
      render: (t) => COURSE_STATUS_LABELS[t.status] ?? '—',
    },
    {
      key: 'startDate',
      label: 'Inicio',
      sortValue: (t) => (t.startDate ? new Date(t.startDate).getTime() : 0),
      render: (t) =>
        t.startDate ? new Date(t.startDate).toLocaleDateString('es-CO') : '—',
    },
    {
      key: 'endDate',
      label: 'Fin',
      sortValue: (t) => (t.endDate ? new Date(t.endDate).getTime() : 0),
      render: (t) =>
        t.endDate ? new Date(t.endDate).toLocaleDateString('es-CO') : '—',
    },
    {
      key: 'actions',
      label: '',
      className: 'w-24',
      render: (t) => (
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => openEdit(t)}
            className="rounded p-1.5 text-text-muted hover:bg-bg-elevated hover:text-text-primary"
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget({ id: t.id, name: t.title })}
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

  function openEdit(topic: Topic) {
    setEditing(topic);
    const { id: _, courses: __, ...rest } = topic;
    setForm(rest);
    setDialogOpen(true);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Temas
        </h1>
        <Button onClick={openCreate}>
          <Plus className="mr-2 size-4" />
          Crear tema
        </Button>
      </div>

      <DataTable
        columns={topicColumns}
        data={topics}
        keyFn={(t) => t.id}
        searchable
        searchPlaceholder="Buscar temas..."
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto border-border bg-bg-elevated shadow-[0_8px_30px_rgba(0,0,0,0.5)] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-text-primary">
              {editing ? 'Editar tema' : 'Crear tema'}
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
            <div className="space-y-2">
              <Label>
                Etiqueta<span className="text-text-primary">*</span>
              </Label>
              <Input
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                placeholder="Q2 2026"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>
                Estado<span className="text-text-primary">*</span>
              </Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm({ ...form, status: v as CourseStatus })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {COURSE_STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Modalidad</Label>
                <Select
                  value={form.modality ?? 'Presencial'}
                  onValueChange={(v) => setForm({ ...form, modality: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MODALITY_OPTIONS.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ubicación</Label>
                <Input
                  value={form.location ?? ''}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  placeholder="Casa Sobre la Roca - Medellín"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Fecha inicio<span className="text-text-primary">*</span>
                </Label>
                <Input
                  type="date"
                  value={form.startDate ? form.startDate.slice(0, 10) : ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      startDate: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : '',
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Fecha fin<span className="text-text-primary">*</span>
                </Label>
                <Input
                  type="date"
                  value={form.endDate ? form.endDate.slice(0, 10) : ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      endDate: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : '',
                    })
                  }
                  required
                />
              </div>
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
