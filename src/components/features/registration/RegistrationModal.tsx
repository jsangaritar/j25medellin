import {
  AlertCircle,
  CheckCircle,
  Mail,
  Phone,
  User,
  UserX,
} from 'lucide-react';
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
import { RegistrationError, useRegistration } from '@/hooks/useRegistration';

interface RegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId?: string;
  courseId?: string;
}

const ERROR_MESSAGES: Record<string, { icon: typeof UserX; message: string }> =
  {
    COURSE_FULL: {
      icon: UserX,
      message: 'Lo sentimos, los cupos para este curso se han agotado.',
    },
    DUPLICATE_REGISTRATION: {
      icon: AlertCircle,
      message: 'Ya te encuentras inscrito/a en este curso.',
    },
    TOPIC_DUPLICATE_REGISTRATION: {
      icon: AlertCircle,
      message:
        'Ya te encuentras inscrito/a en otro curso de este tema. Solo puedes inscribirte en un curso por tema.',
    },
  };

export function RegistrationModal({
  open,
  onOpenChange,
  eventId,
  courseId,
}: RegistrationModalProps) {
  const [fullName, setFullName] = useState('');
  const [whatsApp, setWhatsApp] = useState('');
  const [email, setEmail] = useState('');
  const { mutate, isPending, isSuccess, isError, error, reset } =
    useRegistration();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate({ fullName, whatsApp, email, eventId, courseId });
  }

  function handleClose(value: boolean) {
    if (!value) {
      setFullName('');
      setWhatsApp('');
      setEmail('');
      reset();
    }
    onOpenChange(value);
  }

  const errorInfo =
    isError && error instanceof RegistrationError
      ? ERROR_MESSAGES[error.code]
      : null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="border-border bg-bg-card sm:max-w-md">
        {isSuccess ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-accent-dim">
              <CheckCircle className="size-8 text-accent-bright" />
            </div>
            <DialogTitle className="font-display text-xl font-bold text-text-primary">
              ¡Inscripción exitosa!
            </DialogTitle>
            <DialogDescription className="text-sm text-text-secondary">
              Te hemos enviado un mensaje de confirmación. Nos vemos pronto.
            </DialogDescription>
            <Button onClick={() => handleClose(false)}>Cerrar</Button>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
              {errorInfo ? (
                <errorInfo.icon className="size-8 text-destructive" />
              ) : (
                <AlertCircle className="size-8 text-destructive" />
              )}
            </div>
            <DialogTitle className="font-display text-xl font-bold text-text-primary">
              No se pudo completar
            </DialogTitle>
            <DialogDescription className="text-sm text-text-secondary">
              {errorInfo?.message ??
                'Ocurrió un error. Por favor intenta de nuevo.'}
            </DialogDescription>
            <Button onClick={() => handleClose(false)}>Cerrar</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="mb-2 flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-accent-bright" />
                <span className="font-body text-xs font-semibold uppercase tracking-wider text-accent-bright">
                  INSCRIPCIÓN
                </span>
              </div>
              <DialogTitle className="font-display text-xl font-bold text-text-primary">
                Únete a J+
              </DialogTitle>
              <DialogDescription className="text-sm text-text-secondary">
                {courseId
                  ? 'Completa el formulario para inscribirte al curso.'
                  : 'Completa el formulario para inscribirte al evento.'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Tu nombre"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsApp">WhatsApp</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
                  <Input
                    id="whatsApp"
                    value={whatsApp}
                    onChange={(e) => setWhatsApp(e.target.value)}
                    placeholder="+57 300 000-0000"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Enviando...' : 'Inscribirme'}
              </Button>

              <p className="text-center text-xs text-text-dim">
                Al inscribirte, aceptas recibir notificaciones por WhatsApp
                sobre eventos y cursos de J+.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
