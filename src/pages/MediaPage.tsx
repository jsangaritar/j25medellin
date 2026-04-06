import { PageBanner } from '@/components/layout/PageBanner';

export function MediaPage() {
  return (
    <>
      <PageBanner
        tag="CONTENIDO"
        title="Media"
        subtitle="Videos, podcasts y recursos para tu crecimiento espiritual."
      />
      <div className="flex items-center justify-center py-32">
        <p className="text-text-muted">Próximamente</p>
      </div>
    </>
  );
}
