import { describe, expect, it } from 'vitest';
import type { Event } from '@/types';
import { buildCalendarGrid, getNextMonth, getPreviousMonth } from './calendar';

function makeEvent(overrides: Partial<Event> & { date: string }): Event {
  return {
    id: '1',
    title: 'Test',
    slug: 'test',
    description: '',
    location: '',
    imageUrl: '',
    tags: [],
    featured: false,
    requiresRegistration: false,
    eventType: 'j+',
    ...overrides,
  };
}

describe('buildCalendarGrid', () => {
  it('returns 35 or 42 days covering full weeks', () => {
    const grid = buildCalendarGrid(new Date(2026, 3, 1), []); // April 2026
    expect(grid.length % 7).toBe(0);
    expect(grid.length).toBeGreaterThanOrEqual(28);
  });

  it('marks current month days correctly', () => {
    const grid = buildCalendarGrid(new Date(2026, 3, 1), []); // April 2026
    const aprilDays = grid.filter((d) => d.isCurrentMonth);
    expect(aprilDays).toHaveLength(30); // April has 30 days
  });

  it('attaches events to matching days', () => {
    const events = [
      makeEvent({
        date: '2026-04-15T19:00:00.000Z',
        endDate: '2026-04-15T21:00:00.000Z',
      }),
    ];
    const grid = buildCalendarGrid(new Date(2026, 3, 1), events);
    const dayWithEvent = grid.find(
      (d) => d.date.getDate() === 15 && d.isCurrentMonth,
    );
    expect(dayWithEvent?.events).toHaveLength(1);
    expect(dayWithEvent?.events[0].title).toBe('Test');
  });

  it('returns empty events for days without events', () => {
    const grid = buildCalendarGrid(new Date(2026, 3, 1), []);
    for (const day of grid) {
      expect(day.events).toEqual([]);
    }
  });
});

describe('getNextMonth / getPreviousMonth', () => {
  it('advances one month', () => {
    const result = getNextMonth(new Date(2026, 3, 1));
    expect(result.getMonth()).toBe(4); // May
  });

  it('goes back one month', () => {
    const result = getPreviousMonth(new Date(2026, 3, 1));
    expect(result.getMonth()).toBe(2); // March
  });

  it('handles year boundary forward', () => {
    const result = getNextMonth(new Date(2026, 11, 1)); // December
    expect(result.getFullYear()).toBe(2027);
    expect(result.getMonth()).toBe(0); // January
  });

  it('handles year boundary backward', () => {
    const result = getPreviousMonth(new Date(2026, 0, 1)); // January
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(11); // December
  });
});
