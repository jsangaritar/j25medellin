import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useCourses, useTopics } from '@/hooks/useCourses';
import {
  createDocument,
  deleteDocument,
  updateDocument,
} from '@/lib/firestore';
import { COURSE_STATUS_LABELS, type Course, type CourseStatus } from '@/types';

const STATUSES = Object.keys(COURSE_STATUS_LABELS) as CourseStatus[];

type CourseForm = Omit<Course, 'id'>;

const emptyForm: CourseForm = {
  title: '',
  slug: '',
  description: '',
  tags: [],
  status: 'DRAFT',
  schedule: '',
  location: '',
  lineNumber: undefined,
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

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Línea</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Tema</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Cupos</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.lineNumber ?? '—'}</TableCell>
                <TableCell className="font-medium">{course.title}</TableCell>
                <TableCell>
                  {topics.find((t) => t.id === course.topicId)?.title ?? '—'}
                </TableCell>
                <TableCell>{COURSE_STATUS_LABELS[course.status]}</TableCell>
                <TableCell>{course.capacity ?? '∞'}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(course)}
                      className="rounded p-1.5 text-text-muted hover:bg-bg-elevated hover:text-text-primary"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMutation.mutate(course.id)}
                      className="rounded p-1.5 text-text-muted hover:bg-bg-elevated hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
                Título<span className="text-destructive">*</span>
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
                Tema<span className="text-destructive">*</span>
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
                <Label>Estado</Label>
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
              <div className="space-y-2">
                <Label>Línea</Label>
                <Input
                  type="number"
                  value={form.lineNumber ?? ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      lineNumber: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                />
              </div>
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
    </div>
  );
}
