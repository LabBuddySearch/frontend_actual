/** Короткая подпись времени для блока «Последние действия». */
export function formatAdminActivityTime(ts: number): string {
  return new Date(ts).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}
