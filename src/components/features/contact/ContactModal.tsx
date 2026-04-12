import { CheckCircle, Mail, MessageSquare, Phone, User } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useContact } from '@/hooks/useContact';

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactModal({ open, onOpenChange }: ContactModalProps) {
  const [fullName, setFullName] = useState('');
  const [whatsApp, setWhatsApp] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { mutate, isPending, isSuccess, reset } = useContact();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate({ fullName, whatsApp, email, message });
  }

  function handleClose(value: boolean) {
    if (!value) {
      setFullName('');
      setWhatsApp('');
      setEmail('');
      setMessage('');
      reset();
    }
    onOpenChange(value);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="border-border bg-bg-card sm:max-w-md">
        {isSuccess ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-accent-dim">
              <CheckCircle className="size-8 text-accent-bright" />
            </div>
            <DialogTitle className="font-display text-xl font-bold text-text-primary">
              ¡Mensaje enviado!
            </DialogTitle>
            <DialogDescription className="text-sm text-text-secondary">
              Hemos recibido tu mensaje. Te responderemos lo antes posible.
            </DialogDescription>
            <Button onClick={() => handleClose(false)}>Cerrar</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="mb-2 flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-accent-bright" />
                <span className="font-body text-xs font-semibold uppercase tracking-wider text-accent-bright">
                  CONTACTO
                </span>
              </div>
              <DialogTitle className="font-display text-xl font-bold text-text-primary">
                Escríbenos
              </DialogTitle>
              <DialogDescription className="text-sm text-text-secondary">
                Déjanos tu mensaje y te responderemos pronto.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">
                  Nombre completo<span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
                  <Input
                    id="contactName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Tu nombre"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactWhatsApp">
                  WhatsApp<span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
                  <Input
                    id="contactWhatsApp"
                    value={whatsApp}
                    onChange={(e) => setWhatsApp(e.target.value)}
                    placeholder="+57 300 000-0000"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">
                  Correo electrónico<span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
                  <Input
                    id="contactEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactMessage">
                  Mensaje<span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 size-4 text-text-muted" />
                  <Textarea
                    id="contactMessage"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="¿En qué podemos ayudarte?"
                    className="min-h-24 pl-10"
                    rows={4}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Enviando...' : 'Enviar mensaje'}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
