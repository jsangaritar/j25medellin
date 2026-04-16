import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DRIVE_ID_REGEX = /\/d\/([a-zA-Z0-9_-]+)/;

export function formatDriveIdToFetchableImage(url: string): string {
  const idMatch = url.match(DRIVE_ID_REGEX);

  if (idMatch?.[1]) {
    return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
  }

  console.error('Invalid Google Drive URL: Could not extract ID');
  return url;
}

export function getDrivePreviewUrl(url: string): string | null {
  const idMatch = url.match(DRIVE_ID_REGEX);
  return idMatch?.[1]
    ? `https://drive.google.com/file/d/${idMatch[1]}/preview`
    : null;
}

export function getDriveDownloadUrl(url: string): string | null {
  const idMatch = url.match(DRIVE_ID_REGEX);
  return idMatch?.[1]
    ? `https://drive.google.com/uc?export=download&id=${idMatch[1]}`
    : null;
}
