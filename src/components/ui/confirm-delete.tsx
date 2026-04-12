import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ConfirmDeleteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  itemName?: string;
  title?: string;
  description?: string;
}

export function ConfirmDelete({
  open,
  onOpenChange,
  onConfirm,
  itemName,
  title = '¿Eliminar?',
  description,
}: ConfirmDeleteProps) {
  const resolvedDescription =
    description ??
    (itemName
      ? `¿Estás seguro de eliminar "${itemName}"? Esta acción no se puede deshacer.`
      : 'Esta acción no se puede deshacer.');
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-border bg-bg-elevated shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-text-primary">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-text-muted">
            {resolvedDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
