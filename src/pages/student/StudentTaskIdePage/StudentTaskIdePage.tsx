import { IDEEditor } from '@/components/IDEEditor';
import { getStudentTaskById, getTaskApiErrorMessage, type StudentTaskProgressResponse } from '@/shared/api/tasks';
import {
  getSubmitApiErrorMessage,
  getTaskSubmissions,
  mapUiLanguageToApi,
  submitTaskSolution,
  type SubmissionResponse,
  type SubmissionSummaryResponse,
} from '@/shared/api/student';
import { taskResponseToUiTask } from '@/shared/lib/task-mappers';
import type { TaskLanguage } from '@/types/task';
import { AlertCircle, CheckCircle2, HistoryIcon, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function formatDeadline(value?: string): string {
  if (!value) return 'не задан';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value.replace('T', ' ').slice(0, 16);
  return d.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function submissionStatusLabel(status: string): string {
  switch (status) {
    case 'ACCEPTED':
      return 'Принято';
    case 'WRONG':
      return 'Неверно';
    case 'PENDING':
      return 'На проверке';
    default:
      return status;
  }
}

export function StudentTaskIdePage() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const numericId = Number(taskId);

  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [lang, setLang] = useState<TaskLanguage>('Java');
  const [time, setTime] = useState(2000);
  const [memory, setMemory] = useState(256);
  const [deadlineAt, setDeadlineAt] = useState<string | undefined>();
  const [progress, setProgress] = useState<StudentTaskProgressResponse | null>(null);
  const [history, setHistory] = useState<SubmissionSummaryResponse[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<SubmissionResponse | null>(null);
  const [timerSessionKey, setTimerSessionKey] = useState(0);

  const loadTask = useCallback(async () => {
    if (!Number.isFinite(numericId)) {
      setLoadError('Некорректный идентификатор задачи.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError(null);
    try {
      const [data, submissions] = await Promise.all([
        getStudentTaskById(numericId),
        getTaskSubmissions(numericId).catch(() => [] as SubmissionSummaryResponse[]),
      ]);
      const ui = taskResponseToUiTask(data);
      setTaskName(ui.name);
      setDescription(ui.description);
      setLang(ui.lang);
      setTime(ui.time);
      setMemory(ui.memory);
      setDeadlineAt(data.deadlineAt);
      setProgress(data.studentProgress ?? null);
      setHistory(submissions.length > 0 ? submissions : data.studentProgress?.recentSubmissions ?? []);
    } catch (err) {
      setLoadError(getTaskApiErrorMessage(err, 'Не удалось загрузить задачу.'));
    } finally {
      setIsLoading(false);
    }
  }, [numericId]);

  useEffect(() => {
    document.title = 'Задача | EduCode';
    return () => {
      document.title = 'Вход | Programming Education';
    };
  }, []);

  useEffect(() => {
    void loadTask();
  }, [loadTask]);

  const canSubmit = progress?.canSubmit ?? true;
  const disabledReason = progress?.solved
    ? 'Задача уже решена.'
    : progress?.deadlineExpired
      ? 'Дедлайн истёк — отправка недоступна.'
      : progress && progress.attemptsRemaining <= 0
        ? 'Исчерпаны все попытки.'
        : undefined;

  const handleSubmit = async (sourceCode: string) => {
    if (!Number.isFinite(numericId) || !canSubmit) return;
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitResult(null);
    try {
      const result = await submitTaskSolution(numericId, {
        language: mapUiLanguageToApi(lang),
        sourceCode,
      });
      setSubmitResult(result);
      setTimerSessionKey((k) => k + 1);
      await loadTask();
    } catch (err) {
      setSubmitError(getSubmitApiErrorMessage(err, 'Не удалось отправить решение.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="flex-1 max-w-6xl mx-auto w-full p-6 flex items-center justify-center gap-2 text-slate-400">
        <Loader2 className="size-6 animate-spin" />
        Загрузка задачи...
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="flex-1 max-w-6xl mx-auto w-full p-6">
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-6 text-red-300" role="alert">
          {loadError}
        </div>
        <button
          className="mt-4 text-primary hover:underline"
          type="button"
          onClick={() => navigate('/student/tasks')}
        >
          Вернуться к списку
        </button>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-6xl mx-auto w-full p-6 space-y-6">
      <section className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{taskName}</h1>
              <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/20">
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                {lang}
              </div>
              {progress?.solved && (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                  Решено
                </span>
              )}
            </div>
            <p className="text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">{description}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-2 min-w-[220px]">
            <div className="flex items-center justify-between p-3 rounded-lg bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Дедлайн</span>
              <span className="text-sm font-mono text-primary">{formatDeadline(deadlineAt)}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Попытки</span>
              <span className="text-sm font-mono text-primary">
                {progress
                  ? `${progress.attemptsRemaining} / ${progress.maxAttempts}`
                  : '—'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Время (лимит)</span>
              <span className="text-sm font-mono text-primary">{`${(time / 1000).toFixed(1)}с`}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Память</span>
              <span className="text-sm font-mono text-primary">{`${memory}МБ`}</span>
            </div>
          </div>
        </div>
      </section>

      {submitError && (
        <div
          className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300 flex gap-2"
          role="alert"
        >
          <AlertCircle className="size-5 shrink-0" />
          {submitError}
        </div>
      )}

      {submitResult && (
        <div
          className={`rounded-lg border p-4 text-sm flex gap-2 ${
            submitResult.passed
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
              : submitResult.syntaxError
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-200'
                : 'border-red-500/40 bg-red-500/10 text-red-300'
          }`}
        >
          {submitResult.passed ? (
            <CheckCircle2 className="size-5 shrink-0" />
          ) : (
            <AlertCircle className="size-5 shrink-0" />
          )}
          <div>
            <p className="font-semibold">
              {submitResult.passed
                ? 'Все тесты пройдены!'
                : submitResult.syntaxError
                  ? 'Синтаксическая ошибка'
                  : `Ошибка на тесте #${submitResult.failedTestIndex ?? '?'}`}
            </p>
            {submitResult.message && <p className="mt-1 opacity-90">{submitResult.message}</p>}
            {submitResult.stderr && !submitResult.passed && (
              <pre className="mt-2 text-xs whitespace-pre-wrap font-mono opacity-80">{submitResult.stderr}</pre>
            )}
            {submitResult.attemptsRemaining != null && (
              <p className="mt-2 text-xs opacity-75">
                Осталось попыток: {submitResult.attemptsRemaining}
              </p>
            )}
          </div>
        </div>
      )}

      <IDEEditor
        autoSubmitOnTimeout={canSubmit}
        disabled={!canSubmit}
        disabledReason={disabledReason}
        isSubmitting={isSubmitting}
        lang={lang}
        timeLimitMs={time}
        timerSessionKey={timerSessionKey}
        onSubmit={handleSubmit}
      />

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-slate-400">
          <HistoryIcon size={20} />
          <span className="text-sm font-semibold uppercase tracking-widest">Последние попытки</span>
        </div>
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          {history.length === 0 ? (
            <p className="text-sm text-slate-500">Попыток пока нет.</p>
          ) : (
            <ul className="space-y-2">
              {history.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap justify-between gap-2 text-sm border border-slate-700/40 rounded-lg px-4 py-2"
                >
                  <span className="text-slate-300">#{item.id}</span>
                  <span
                    className={
                      item.status === 'ACCEPTED' ? 'text-emerald-400' : 'text-slate-400'
                    }
                  >
                    {submissionStatusLabel(item.status)}
                  </span>
                  <span className="text-slate-500 text-xs">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString('ru-RU')
                      : '—'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
