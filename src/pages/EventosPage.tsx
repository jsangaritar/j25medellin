import { PageBanner } from '@/components/layout/PageBanner';

export function EventosPage() {
  return (
    <>
      <PageBanner
        tag="EVENTOS"
        title="Eventos"
        subtitle="Próximos eventos y encuentros de la comunidad J+."
      />
      <div className="flex items-center justify-center py-32">
        <p className="text-text-muted">Próximamente</p>
      </div>
    </>
  );
}
