/** Значение для input[type=datetime-local] из ISO/LocalDateTime с бэкенда */
export function apiDateTimeToLocalInput(value?: string | null): string {
  if (!value) return '';
  const normalized = value.length >= 16 ? value.slice(0, 16) : value;
  return normalized;
}

/** LocalDateTime для Spring (без Z, локальное время из datetime-local) */
export function localInputToApiDateTime(local: string): string {
  if (!local) return '';
  return local.length === 16 ? `${local}:00` : local;
}

export function defaultDeadlineLocalInput(daysFromNow = 7): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setMinutes(0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
