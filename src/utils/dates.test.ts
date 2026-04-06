import { describe, expect, it } from 'vitest';
import {
  capitalizeFirst,
  formatDayNumber,
  formatEventDate,
  isUpcoming,
} from './dates';

describe('formatEventDate', () => {
  it('formats a date in Spanish', () => {
    const result = formatEventDate('2026-04-15T19:00:00.000Z');
    expect(result).toContain('15');
    expect(result).toContain('2026');
  });
});

describe('formatDayNumber', () => {
  it('returns just the day number', () => {
    expect(formatDayNumber(new Date(2026, 3, 7))).toBe('7');
    expect(formatDayNumber(new Date(2026, 3, 25))).toBe('25');
  });
});

describe('isUpcoming', () => {
  it('returns true for future dates', () => {
    const future = new Date();
    future.setFullYear(future.getFullYear() + 1);
    expect(isUpcoming(future.toISOString())).toBe(true);
  });

  it('returns false for past dates', () => {
    expect(isUpcoming('2020-01-01T00:00:00.000Z')).toBe(false);
  });
});

describe('capitalizeFirst', () => {
  it('capitalizes the first letter', () => {
    expect(capitalizeFirst('hello')).toBe('Hello');
    expect(capitalizeFirst('abril')).toBe('Abril');
  });

  it('handles empty string', () => {
    expect(capitalizeFirst('')).toBe('');
  });
});
