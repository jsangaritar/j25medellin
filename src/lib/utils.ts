import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDriveIdToFetchableImage(url: string): string {
  // Regex looks for the segment between '/d/' and the next '/'
  const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);

  if (idMatch?.[1]) {
    const id = idMatch[1];
    return `https://lh3.googleusercontent.com/d/${id}`;
  }

  console.error('Invalid Google Drive URL: Could not extract ID');
  return url;
}
