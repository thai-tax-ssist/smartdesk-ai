import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-IE', {
    timeZone: 'Europe/Dublin',
    dateStyle: 'medium',
  }).format(new Date(date));
}

export function getCurrentMonth() {
  return new Intl.DateTimeFormat('en-IE', {
    timeZone: 'Europe/Dublin',
    year: 'numeric',
    month: '2-digit',
  }).format(new Date()).split('/').reverse().join('-');
}

export function daysUntil(date: string) {
  const diff = new Date(date).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
