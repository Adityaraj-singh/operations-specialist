export const notProvided = 'Not provided';

export function displayValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return notProvided;
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  return notProvided;
}

export function formatCurrency(cents: unknown): string {
  if (typeof cents !== 'number' || !Number.isFinite(cents)) return notProvided;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatDateTime(value: unknown): string {
  if (typeof value !== 'string' || !value) return notProvided;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return notProvided;
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function formatDate(value: unknown): string {
  if (typeof value !== 'string' || !value) return notProvided;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return notProvided;
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date);
}

export function formatLabel(value: unknown): string {
  if (typeof value !== 'string' || !value) return notProvided;
  return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}
