import {
  formatSubmissionLanguage,
  formatSubmissionStatus,
  getStudentSubmissionHistory,
  type StudentSubmissionHistoryItem,
} from '@/shared/api/student';
import { History, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function formatDateTime(value?: string): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function StudentSubmissionHistory() {
  const [rows, setRows] = useState<StudentSubmissionHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    void getStudentSubmissionHistory()
      .then(setRows)
      .catch(() => setError('Не удалось загрузить историю решений.'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className="rounded-xl border border-border-color bg-surface flex flex-col min-h-[280px]">
      <div className="flex items-center gap-2 border-b border-border-color px-6 py-4">
        <History className="size-5 text-primary" aria-hidden />
        <h2 className="text-lg font-bold">История всех решений</h2>
      </div>

      <div className="flex-1 overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
            <Loader2 className="size-5 animate-spin" />
            Загрузка...
          </div>
        ) : error ? (
          <p className="px-6 py-10 text-sm text-red-400" role="alert">
            {error}
          </p>
        ) : rows.length === 0 ? (
          <p className="px-6 py-10 text-sm text-slate-500 text-center">
            Попыток пока нет — отправьте решение из раздела задач.
          </p>
        ) : (
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="text-xs tracking-wider text-slate-500 uppercase border-b border-border-color">
                <th className="px-6 py-3 font-semibold">Название задачи</th>
                <th className="px-6 py-3 font-semibold">Статус</th>
                <th className="px-6 py-3 font-semibold">Язык</th>
                <th className="px-6 py-3 font-semibold">Дата / время</th>
                <th className="px-6 py-3 font-semibold text-right">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {rows.map((row) => {
                const status = formatSubmissionStatus(row.status);
                return (
                  <tr key={row.submissionId} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-3 text-slate-200 font-medium">{row.taskTitle}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          status.ok
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-red-500/15 text-red-400'
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${status.ok ? 'bg-emerald-400' : 'bg-red-400'}`}
                        />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-400">{formatSubmissionLanguage(row.language)}</td>
                    <td className="px-6 py-3 text-slate-400 whitespace-nowrap">
                      {formatDateTime(row.createdAt)}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <Link
                        to={`/student/tasks/${row.taskId}`}
                        className="inline-flex items-center rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                      >
                        Открыть задачу
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {!isLoading && !error && rows.length > 0 && (
        <div className="border-t border-border-color px-6 py-3 text-xs text-slate-500">
          Показано {rows.length} {rows.length === 1 ? 'попытка' : rows.length < 5 ? 'попытки' : 'попыток'}
        </div>
      )}
    </section>
  );
}
