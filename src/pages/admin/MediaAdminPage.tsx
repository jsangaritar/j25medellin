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
import { useMedia } from '@/hooks/useMedia';
import {
  createDocument,
  deleteDocument,
  updateDocument,
} from '@/lib/firestore';
import type { MediaContent, MediaType } from '@/types';

const MEDIA_TYPES: MediaType[] = ['VIDEO', 'AUDIO', 'DOCUMENT'];

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
  platform: '',
};

export function MediaAdminPage() {
  const { data: media = [] } = useMedia();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<MediaContent | null>(null);
  const [form, setForm] = useState<MediaForm>(emptyForm);

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
      if (editing) {
        await updateDocument('mediaContents', editing.id, data);
      } else {
        await createDocument('mediaContents', data);
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

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Plataforma</TableHead>
              <TableHead>Destacado</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {media.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.platform ?? '—'}</TableCell>
                <TableCell>{item.featured ? 'Sí' : 'No'}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="rounded p-1.5 text-text-muted hover:bg-bg-elevated hover:text-text-primary"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMutation.mutate(item.id)}
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
        <DialogContent className="max-h-[85vh] overflow-y-auto border-border bg-bg-card sm:max-w-lg">
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
              <Label>Título</Label>
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
                <Label>Tipo</Label>
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
                        {t}
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
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Guardando...' : 'Guardar'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
