import qs from 'qs';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:1337';

interface FetchOptions {
  query?: Record<string, unknown>;
  init?: RequestInit;
}

export async function apiFetch<T>(
  path: string,
  { query, init }: FetchOptions = {},
): Promise<T> {
  const queryString = query
    ? `?${qs.stringify(query, { encodeValuesOnly: true })}`
    : '';
  const url = `${API_BASE}/api${path}${queryString}`;

  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, {
    init: {
      method: 'POST',
      body: JSON.stringify({ data: body }),
    },
  });
}
