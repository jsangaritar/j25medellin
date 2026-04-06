import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { setDocument } from '@/lib/firestore';
import type { SiteConfig } from '@/types';

export function SiteConfigPage() {
  const { data: config } = useSiteConfig();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<SiteConfig>({
    heroTitle: '',
    heroSubtitle: '',
    heroImageUrl: '',
    whatsappNumber: '',
    instagramUrl: '',
    youtubeUrl: '',
    contactEmail: '',
    googleCalendarUrl: '',
  });

  useEffect(() => {
    if (config) setForm(config);
  }, [config]);

  const saveMutation = useMutation({
    mutationFn: () =>
      setDocument(
        'settings',
        'config',
        form as unknown as Record<string, unknown>,
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['siteConfig'] }),
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Configuración del sitio
        </h1>
        <Button
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
        >
          <Save className="mr-2 size-4" />
          {saveMutation.isPending ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="rounded-lg border border-border bg-bg-card p-6">
          <h2 className="mb-4 font-body text-lg font-semibold text-text-primary">
            Hero
          </h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Textarea
                value={form.heroTitle}
                onChange={(e) =>
                  setForm({ ...form, heroTitle: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Subtítulo</Label>
              <Textarea
                value={form.heroSubtitle}
                onChange={(e) =>
                  setForm({ ...form, heroSubtitle: e.target.value })
                }
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>URL de imagen de fondo</Label>
              <Input
                value={form.heroImageUrl ?? ''}
                onChange={(e) =>
                  setForm({ ...form, heroImageUrl: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-bg-card p-6">
          <h2 className="mb-4 font-body text-lg font-semibold text-text-primary">
            Contacto y redes
          </h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Número de WhatsApp</Label>
              <Input
                value={form.whatsappNumber}
                onChange={(e) =>
                  setForm({ ...form, whatsappNumber: e.target.value })
                }
                placeholder="573001234567"
              />
            </div>
            <div className="space-y-2">
              <Label>Email de contacto</Label>
              <Input
                type="email"
                value={form.contactEmail}
                onChange={(e) =>
                  setForm({ ...form, contactEmail: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Instagram URL</Label>
              <Input
                value={form.instagramUrl}
                onChange={(e) =>
                  setForm({ ...form, instagramUrl: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>YouTube URL</Label>
              <Input
                value={form.youtubeUrl}
                onChange={(e) =>
                  setForm({ ...form, youtubeUrl: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Google Calendar URL (iCal)</Label>
              <Input
                value={form.googleCalendarUrl}
                onChange={(e) =>
                  setForm({ ...form, googleCalendarUrl: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {saveMutation.isSuccess && (
          <p className="text-sm text-accent-bright">
            Configuración guardada exitosamente.
          </p>
        )}
      </div>
    </div>
  );
}
