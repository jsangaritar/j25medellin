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
import { useCourses, useTopics } from '@/hooks/useCourses';
import { useMedia } from '@/hooks/useMedia';
import {
  createDocument,
  deleteDocument,
  updateDocument,
} from '@/lib/firestore';
import { formatDriveIdToFetchableImage } from '@/lib/utils';
import { MEDIA_TYPE_LABELS, type MediaContent, type MediaType } from '@/types';

const MEDIA_TYPES = Object.keys(MEDIA_TYPE_LABELS) as MediaType[];

type MediaForm = Omit<MediaContent, 'id'>;

const emptyForm: MediaForm = {
  title: '',
  slug: '',
  description: '',
  type: 'VIDEO',
  thumbnailUrl: '',
  externalUrl: '',
  fileUrl: '',
  tags: [],
  featured: false,
  visible: true,
  platform: '',
};

export function MediaAdminPage() {
  const { data: media = [] } = useMedia();
  const { data: topics = [] } = useTopics();
  const { data: courses = [] } = useCourses();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<MediaContent | null>(null);
  const [form, setForm] = useState<MediaForm>(emptyForm);
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
        thumbnailUrl: form.thumbnailUrl
          ? form.thumbnailUrl.includes('drive.google.com')
            ? formatDriveIdToFetchableImage(form.thumbnailUrl)
            : form.thumbnailUrl
          : undefined,
      };
      if (editing) {
        await updateDocument('mediaContents', editing.id, data);
      } else {
        await createDocument('mediaContents', {
          ...data,
          createdAt: serverTimestamp(),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      setDialogOpen(false);
      setEditing(null);
      setForm(emptyForm);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteDocument('mediaContents', id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['media'] }),
  });

  const mediaColumns: Column<MediaContent>[] = [
    {
      key: 'title',
      label: 'Título',
      sortValue: (m) => m.title.toLowerCase(),
      filterValue: (m) => m.title,
      render: (m) => <span className="font-medium">{m.title}</span>,
    },
    {
      key: 'type',
      label: 'Tipo',
      sortValue: (m) => m.type,
      filterValue: (m) => MEDIA_TYPE_LABELS[m.type],
      render: (m) => MEDIA_TYPE_LABELS[m.type],
    },
    {
      key: 'platform',
      label: 'Plataforma',
      sortValue: (m) => (m.platform ?? '').toLowerCase(),
      filterValue: (m) => m.platform ?? '',
      render: (m) => m.platform ?? '—',
    },
    {
      key: 'visible',
      label: 'Visible',
      sortValue: (m) => (m.visible !== false ? 1 : 0),
      render: (m) => (m.visible !== false ? 'Sí' : 'No'),
    },
    {
      key: 'featured',
      label: 'Destacado',
      sortValue: (m) => (m.featured ? 1 : 0),
      render: (m) => (m.featured ? 'Sí' : 'No'),
    },
    {
      key: 'actions',
      label: '',
      className: 'w-24',
      render: (m) => (
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => openEdit(m)}
            className="rounded p-1.5 text-text-muted hover:bg-bg-elevated hover:text-text-primary"
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget({ id: m.id, name: m.title })}
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

  function openEdit(item: MediaContent) {
    setEditing(item);
    setForm({ ...item });
    setDialogOpen(true);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Media
        </h1>
        <Button onClick={openCreate}>
          <Plus className="mr-2 size-4" />
          Crear contenido
        </Button>
      </div>

      <DataTable
        columns={mediaColumns}
        data={media}
        keyFn={(m) => m.id}
        searchable
        searchPlaceholder="Buscar contenido..."
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto border-border bg-bg-elevated shadow-[0_8px_30px_rgba(0,0,0,0.5)] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-text-primary">
              {editing ? 'Editar contenido' : 'Crear contenido'}
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
                  Tipo<span className="text-text-primary">*</span>
                </Label>
                <Select
                  value={form.type}
                  onValueChange={(v) =>
                    setForm({ ...form, type: v as MediaType })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MEDIA_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {MEDIA_TYPE_LABELS[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Plataforma</Label>
                <Input
                  value={form.platform ?? ''}
                  onChange={(e) =>
                    setForm({ ...form, platform: e.target.value })
                  }
                  placeholder="YouTube, Spotify..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>URL externa</Label>
              <Input
                value={form.externalUrl ?? ''}
                onChange={(e) =>
                  setForm({ ...form, externalUrl: e.target.value })
                }
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
            <div className="space-y-2">
              <Label>URL de thumbnail</Label>
              <Input
                value={form.thumbnailUrl ?? ''}
                onChange={(e) =>
                  setForm({ ...form, thumbnailUrl: e.target.value })
                }
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tema</Label>
                <Select
                  value={form.topicId ?? '_none'}
                  onValueChange={(v) =>
                    setForm({ ...form, topicId: v === '_none' ? undefined : v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sin tema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_none">Sin tema</SelectItem>
                    {topics.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Curso</Label>
                <Select
                  value={form.courseId ?? '_none'}
                  onValueChange={(v) =>
                    setForm({
                      ...form,
                      courseId: v === '_none' ? undefined : v,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sin curso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_none">Sin curso</SelectItem>
                    {courses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-text-secondary">
                <input
                  type="checkbox"
                  checked={form.visible !== false}
                  onChange={(e) =>
                    setForm({ ...form, visible: e.target.checked })
                  }
                  className="rounded"
                />
                Visible
              </label>
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
