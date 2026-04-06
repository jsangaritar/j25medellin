import { Menu, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { buildWhatsAppUrl } from "@/utils/whatsapp";

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Discipulados", href: "/discipulados" },
  { label: "Media", href: "/media" },
  { label: "Eventos", href: "/eventos" },
];

export function Header() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { data: config } = useSiteConfig();
  const whatsappUrl = buildWhatsAppUrl(config?.whatsappNumber ?? "");

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg-primary/95 backdrop-blur-sm">
      {/* Desktop */}
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-14 py-[18px] max-md:hidden">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/j25-logo.svg" alt="J+" className="h-8 w-20 scale-150" />
        </Link>

        <nav className="flex items-center gap-9">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`font-body text-[13px] transition-colors hover:text-text-primary ${
                location.pathname === link.href
                  ? "font-semibold text-text-primary"
                  : "font-medium text-text-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg bg-accent-bright px-3.5 py-2 font-body text-xs font-semibold text-bg-primary transition-opacity hover:opacity-90"
        >
          <MessageCircle className="size-3.5" />
          Contáctanos
        </a>
      </div>

      {/* Mobile */}
      <div className="flex items-center justify-between px-5 py-3.5 md:hidden">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/j25-logo.svg"
            alt="J+"
            className="h-7 w-[68px] scale-150"
          />
        </Link>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="text-text-primary"
              aria-label="Abrir menú"
            >
              <Menu className="size-[22px]" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            showCloseButton={false}
            className="w-[280px] border-border bg-bg-primary"
          >
            <div className="flex items-center justify-end px-5 pt-4">
              <SheetClose asChild>
                <button
                  type="button"
                  className="text-text-muted"
                  aria-label="Cerrar menú"
                >
                  <X className="size-5" />
                </button>
              </SheetClose>
            </div>
            <nav className="flex flex-col gap-1 px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2.5 font-body text-sm transition-colors ${
                    location.pathname === link.href
                      ? "bg-bg-elevated font-semibold text-text-primary"
                      : "font-medium text-text-muted hover:bg-bg-surface hover:text-text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-6 px-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-bright px-4 py-3 font-body text-sm font-semibold text-bg-primary"
              >
                <MessageCircle className="size-4" />
                Contáctanos
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
