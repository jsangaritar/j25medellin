import { useMutation, useQueryClient } from '@tanstack/react-query';
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
import { useCourses, useTopics } from '@/hooks/useCourses';
import {
  createDocument,
  deleteDocument,
  updateDocument,
} from '@/lib/firestore';
import type { Course } from '@/types';

type CourseForm = Omit<Course, 'id'>;

const emptyForm: CourseForm = {
  title: '',
  slug: '',
  description: '',
  tags: [],
  schedule: '',
  location: '',
  accentColor: '#4ADE80',
  capacity: 25,
  topicId: '',
};

export function CoursesAdminPage() {
  const { data: courses = [] } = useCourses();
  const { data: topics = [] } = useTopics();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState<CourseForm>(emptyForm);
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
      };
      let courseId: string;
      if (editing) {
        courseId = editing.id;
        await updateDocument('courses', courseId, data);
        // Remove from old topic if topic changed
        if (editing.topicId && editing.topicId !== form.topicId) {
          const oldTopic = topics.find((t) => t.id === editing.topicId);
          if (oldTopic) {
            await updateDocument('courseTopics', oldTopic.id, {
              courseIds: oldTopic.courseIds.filter((id) => id !== courseId),
            });
          }
        }
      } else {
        courseId = await createDocument('courses', data);
      }
      // Add to new topic's courseIds
      if (form.topicId) {
        const topic = topics.find((t) => t.id === form.topicId);
        if (topic && !topic.courseIds.includes(courseId)) {
          await updateDocument('courseTopics', topic.id, {
            courseIds: [...topic.courseIds, courseId],
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      queryClient.invalidateQueries({ queryKey: ['courseTopics'] });
      setDialogOpen(false);
      setEditing(null);
      setForm(emptyForm);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteDocument('courses', id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['courses'] }),
  });

  const courseColumns: Column<Course>[] = [
    {
      key: 'title',
      label: 'Título',
      sortValue: (c) => c.title.toLowerCase(),
      filterValue: (c) => c.title,
      render: (c) => <span className="font-medium">{c.title}</span>,
    },
    {
      key: 'topic',
      label: 'Tema',
      sortValue: (c) =>
        (topics.find((t) => t.id === c.topicId)?.title ?? '').toLowerCase(),
      filterValue: (c) => topics.find((t) => t.id === c.topicId)?.title ?? '',
      render: (c) => topics.find((t) => t.id === c.topicId)?.title ?? '—',
    },
    {
      key: 'capacity',
      label: 'Cupos',
      sortValue: (c) => c.capacity ?? 0,
      render: (c) => String(c.capacity ?? '∞'),
    },
    {
      key: 'actions',
      label: '',
      className: 'w-24',
      render: (c) => (
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => openEdit(c)}
            className="rounded p-1.5 text-text-muted hover:bg-bg-elevated hover:text-text-primary"
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget({ id: c.id, name: c.title })}
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

  function openEdit(course: Course) {
    setEditing(course);
    setForm({ ...course });
    setDialogOpen(true);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Cursos
        </h1>
        <Button onClick={openCreate}>
          <Plus className="mr-2 size-4" />
          Crear curso
        </Button>
      </div>

      <DataTable
        columns={courseColumns}
        data={courses}
        keyFn={(c) => c.id}
        searchable
        searchPlaceholder="Buscar cursos..."
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto border-border bg-bg-elevated shadow-[0_8px_30px_rgba(0,0,0,0.5)] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-text-primary">
              {editing ? 'Editar curso' : 'Crear curso'}
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
              <Label>Etiquetas</Label>
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
                placeholder="Separadas por coma: Biblia, Nuevo"
              />
            </div>
            <div className="space-y-2">
              <Label>
                Tema<span className="text-text-primary">*</span>
              </Label>
              <Select
                value={form.topicId}
                onValueChange={(v) => setForm({ ...form, topicId: v })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tema" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Horario</Label>
                <Input
                  value={form.schedule ?? ''}
                  onChange={(e) =>
                    setForm({ ...form, schedule: e.target.value })
                  }
                  placeholder="Martes 7:00 PM"
                />
              </div>
              <div className="space-y-2">
                <Label>Color de acento</Label>
                <Input
                  type="color"
                  value={form.accentColor ?? '#4ADE80'}
                  onChange={(e) =>
                    setForm({ ...form, accentColor: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Capacidad</Label>
                <Input
                  type="number"
                  value={form.capacity ?? ''}
                  onChange={(e) =>
                    setForm({ ...form, capacity: Number(e.target.value) })
                  }
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
