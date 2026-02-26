import { Download, FileText, Share2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useMedia, useMediaBySlug } from '../hooks/useMedia';
import { getStrapiMediaUrl } from '../utils/media';

export function DocumentDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: doc, isLoading } = useMediaBySlug(slug);
  const { data: related } = useMedia({ type: 'DOCUMENT', pageSize: 4 });

  if (isLoading) {
    return (
      <div className="animate-pulse px-5 py-8 lg:px-14 lg:py-14">
        <div className="h-[300px] w-full rounded-2xl bg-bg-card lg:h-[480px]" />
      </div>
    );
  }

  if (!doc) {
    return (
      <p className="px-5 py-16 text-center font-body text-text-muted">
        Documento no encontrado.
      </p>
    );
  }

  const fileUrl = getStrapiMediaUrl(doc.file);
  const relatedItems = related?.filter((r) => r.slug !== slug).slice(0, 3);

  return (
    <div className="flex flex-col gap-8 px-5 py-8 lg:flex-row lg:gap-14 lg:px-14 lg:py-14">
      {/* Main content */}
      <div className="flex flex-1 flex-col gap-8">
        {/* Document preview */}
        <div className="flex items-center justify-center rounded-2xl border border-border bg-bg-card p-8 lg:h-[480px]">
          <div className="flex h-[280px] w-[220px] flex-col gap-4 rounded-xl bg-white p-7 lg:h-[440px] lg:w-[340px]">
            <div className="h-3 w-3/4 rounded bg-gray-200" />
            <div className="h-2 w-full rounded bg-gray-100" />
            <div className="h-2 w-5/6 rounded bg-gray-100" />
            <div className="h-2 w-full rounded bg-gray-100" />
            <div className="h-2 w-4/6 rounded bg-gray-100" />
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <span className="font-body text-[10px] font-bold tracking-wider text-[#7C3AED]">
            DOCUMENTO
          </span>
          <h1 className="font-display text-2xl font-extrabold tracking-[-0.5px] text-text-primary lg:text-[28px]">
            {doc.title}
          </h1>
          {doc.description && (
            <p className="font-body text-[15px] leading-[1.6] text-text-secondary">
              {doc.description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {fileUrl && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[10px] bg-accent-bright px-5 py-3 font-body text-sm font-semibold text-bg-primary transition-colors hover:bg-accent-muted"
            >
              <Download size={16} />
              Descargar PDF
            </a>
          )}
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-[10px] border border-border px-5 py-3 font-body text-sm font-medium text-text-secondary transition-colors hover:border-text-muted"
          >
            <Share2 size={16} />
            Compartir
          </button>
        </div>
      </div>

      {/* Related sidebar */}
      {relatedItems && relatedItems.length > 0 && (
        <div className="flex flex-col gap-5 lg:w-[380px]">
          <h3 className="font-display text-lg font-bold text-text-primary">
            Más documentos
          </h3>
          {relatedItems.map((item) => (
            <a
              key={item.id}
              href={`/media/documento/${item.slug}`}
              className="flex items-center gap-3.5 rounded-xl border border-border bg-bg-card p-3.5 transition-colors hover:border-text-dim"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-[#F59E0B1A]">
                <FileText size={20} className="text-[#FBBF24]" />
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <span className="truncate font-body text-sm font-semibold text-text-primary">
                  {item.title}
                </span>
                <span className="font-body text-[11px] text-text-muted">
                  PDF
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
