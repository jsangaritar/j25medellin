import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { db } from '@/lib/firebase';
import type { Registration } from '@/types';

function useRegistrations() {
  return useQuery({
    queryKey: ['registrations'],
    queryFn: async () => {
      const q = query(
        collection(db, 'registrations'),
        orderBy('createdAt', 'desc'),
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Registration[];
    },
  });
}

function exportCsv(registrations: Registration[]) {
  const headers = ['Nombre', 'WhatsApp', 'Email', 'Evento', 'Curso', 'Fecha'];
  const rows = registrations.map((r) => [
    r.fullName,
    r.whatsApp,
    r.email,
    r.eventId ?? '',
    r.courseId ?? '',
    r.createdAt ?? '',
  ]);
  const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `inscripciones-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function RegistrationsPage() {
  const { data: registrations = [] } = useRegistrations();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Inscripciones
        </h1>
        <Button
          variant="outline"
          onClick={() => exportCsv(registrations)}
          disabled={registrations.length === 0}
        >
          <Download className="mr-2 size-4" />
          Exportar CSV
        </Button>
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Evento</TableHead>
              <TableHead>Curso</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-text-muted">
                  No hay inscripciones
                </TableCell>
              </TableRow>
            ) : (
              registrations.map((reg) => (
                <TableRow key={reg.id}>
                  <TableCell className="font-medium">{reg.fullName}</TableCell>
                  <TableCell>{reg.whatsApp}</TableCell>
                  <TableCell>{reg.email}</TableCell>
                  <TableCell>{reg.eventId ?? '—'}</TableCell>
                  <TableCell>{reg.courseId ?? '—'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
