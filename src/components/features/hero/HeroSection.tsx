import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Skeleton } from '@/components/ui/skeleton';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  whatsappNumber?: string;
  isLoading?: boolean;
}

export function HeroSection({
  title,
  subtitle,
  imageUrl,
  whatsappNumber = '',
  isLoading = false,
}: HeroSectionProps) {
  return (
    <section className="relative h-[680px] w-full overflow-hidden max-md:h-[520px]">
      {/* Background image */}
      <OptimizedImage
        src={imageUrl || '/images/church.png'}
        alt=""
        className="absolute inset-0"
        imgClassName="object-cover object-top"
        loading="eager"
        decoding="sync"
        fetchPriority="high"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0AF0] via-[#0A0A0ACC] to-[#0A0A0A88]" />

      {/* Content */}
      <div className="relative mx-auto flex h-full max-w-[1440px] items-start px-14 pt-[120px] max-md:px-5 max-md:pt-16">
        <div className="flex max-w-[680px] flex-col gap-7 max-md:max-w-full">
          {isLoading ? (
            <>
              <Skeleton className="h-[180px] w-[580px] max-md:h-[100px] max-md:w-full" />
              <Skeleton className="h-[54px] w-[420px] max-md:w-full" />
              <Skeleton className="h-[50px] w-[160px]" />
            </>
          ) : (
            <>
              {/* Title */}
              <h1 className="whitespace-pre-line font-display text-[56px] font-extrabold leading-[1.05] tracking-[-2px] text-text-primary max-md:text-[32px] max-md:tracking-[-1px]">
                {title}
              </h1>

              {/* Subtitle */}
              <p className="max-w-[520px] whitespace-pre-line font-body text-[17px] leading-[1.6] text-text-secondary max-md:text-[15px]">
                {subtitle}
              </p>

              {/* CTA */}
              {whatsappNumber && (
                <div className="flex gap-3">
                  <Button size="lg" asChild>
                    <a
                      href={`https://whatsapp.com/channel/0029VbAyz0L4IBhNRp2WUY1b`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Únete
                      <ArrowRight className="size-4" />
                    </a>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
