import { describe, expect, it } from 'vitest';
import { buildWhatsAppUrl } from './whatsapp';

describe('buildWhatsAppUrl', () => {
  it('builds a basic wa.me URL', () => {
    expect(buildWhatsAppUrl('573001234567')).toBe('https://wa.me/573001234567');
  });

  it('includes encoded message', () => {
    const url = buildWhatsAppUrl('573001234567', 'Hola, quiero info');
    expect(url).toBe('https://wa.me/573001234567?text=Hola%2C%20quiero%20info');
  });

  it('handles undefined message', () => {
    expect(buildWhatsAppUrl('573001234567', undefined)).toBe(
      'https://wa.me/573001234567',
    );
  });

  it('handles special characters in message', () => {
    const url = buildWhatsAppUrl('573001234567', '¿Cómo estás?');
    expect(url).toContain('text=');
    expect(url).toContain('%C3%B3'); // encoded ó
  });
});
