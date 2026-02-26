export function buildWhatsAppUrl(phone: string, message?: string) {
  const base = `https://wa.me/${phone.replace(/[^0-9]/g, '')}`;
  if (message) {
    return `${base}?text=${encodeURIComponent(message)}`;
  }
  return base;
}
