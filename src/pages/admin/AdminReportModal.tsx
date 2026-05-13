import { Modal } from '@/components/Modal';
import { formatAdminActivityTime } from '@/pages/admin/adminActivityFormat';
import { useAdminPlatformStore } from '@/store/adminPlatformStore';
import { Printer } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

const SITE_NAME = 'EduCode';
const SITE_TAGLINE = 'Programming Education';
const LOGO_SRC = `${import.meta.env.BASE_URL}favicon.svg`;

type ReportPrintAnchor = { parent: HTMLElement; before: ChildNode | null };

function moveReportToBody(anchorRef: { current: ReportPrintAnchor | null }) {
  const el = document.getElementById('admin-report-root');
  if (!el?.parentElement || anchorRef.current) return;
  anchorRef.current = { parent: el.parentElement, before: el.nextSibling };
  document.documentElement.classList.add('printing-admin-report');
  document.body.appendChild(el);
}

function restoreReportFromBody(anchorRef: { current: ReportPrintAnchor | null }) {
  document.documentElement.classList.remove('printing-admin-report');
  const el = document.getElementById('admin-report-root');
  const anchor = anchorRef.current;
  if (el && anchor?.parent) {
    anchor.parent.insertBefore(el, anchor.before);
  }
  anchorRef.current = null;
}

type Props = {
  open: boolean;
  onClose: () => void;
};

/** Содержимое отчёта: сводка, пользователи, задачи, заявки, журнал, примечание. */
export function AdminReportModal({ open, onClose }: Props) {
  const users = useAdminPlatformStore((s) => s.users);
  const teacherApplications = useAdminPlatformStore((s) => s.teacherApplications);
  const tasks = useAdminPlatformStore((s) => s.tasks);
  const activityLog = useAdminPlatformStore((s) => s.activityLog);

  const [generatedAt, setGeneratedAt] = useState(() => new Date());
  const printAnchorRef = useRef<ReportPrintAnchor | null>(null);

  useEffect(() => {
    if (open) setGeneratedAt(new Date());
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onBeforePrint = () => moveReportToBody(printAnchorRef);
    const onAfterPrint = () => restoreReportFromBody(printAnchorRef);

    window.addEventListener('beforeprint', onBeforePrint);
    window.addEventListener('afterprint', onAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', onBeforePrint);
      window.removeEventListener('afterprint', onAfterPrint);
      restoreReportFromBody(printAnchorRef);
    };
  }, [open]);

  const handlePrint = () => {
    moveReportToBody(printAnchorRef);
    window.print();
  };

  const students = useMemo(() => users.filter((u) => u.role === 'STUDENT'), [users]);
  const teachers = useMemo(() => users.filter((u) => u.role === 'TEACHER'), [users]);

  const studentActive = students.filter((u) => !u.blocked).length;
  const studentBlocked = students.filter((u) => u.blocked).length;
  const teacherActive = teachers.filter((u) => !u.blocked).length;
  const teacherBlocked = teachers.filter((u) => u.blocked).length;

  const formedLabel = useMemo(
    () =>
      generatedAt.toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    [generatedAt],
  );

  const taskPreview = tasks.slice(0, 5);
  const logPreview = activityLog.slice(0, 20);

  if (!open) return null;

  return (
    <Modal adminReportPrint isOpen={open} onClose={onClose} title="Сводный отчёт">
      <div className="admin-report-print-wrap flex max-h-[min(85vh,900px)] flex-col gap-4">
        <div
          id="admin-report-root"
          className="admin-report-sheet mx-auto flex w-full max-w-[210mm] flex-col rounded-xl border border-border-color bg-surface text-slate-100 shadow-xl"
        >
          <div className="admin-report-body max-h-[min(62vh,720px)] overflow-y-auto px-6 pb-5 pt-4 sm:px-8 sm:pt-5">
            <h1 className="admin-report-title mb-1.5 text-2xl font-bold tracking-tight text-slate-100">
              Отчёт о состоянии платформы
            </h1>
            <p className="admin-report-meta mb-6 text-sm text-slate-400">
              Административная выгрузка · {SITE_NAME} · сформирован {formedLabel}
            </p>

            <h2 className="admin-report-h2 mb-3 border-b border-border-color pb-2 text-base font-bold text-slate-100">
              1. Сводные показатели
            </h2>
            <table className="admin-report-table mb-7 w-full border-collapse overflow-hidden rounded-lg border border-border-color text-sm">
              <thead>
                <tr className="border-b border-border-color bg-background-dark/60">
                  <th className="admin-report-th px-3 py-2.5 text-left font-semibold text-slate-200">
                    Показатель
                  </th>
                  <th className="admin-report-th admin-report-th-num px-3 py-2.5 text-right font-semibold text-slate-200">
                    Значение
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                <tr className="bg-surface">
                  <td className="admin-report-td px-3 py-2.5 text-slate-300">Студентов в системе</td>
                  <td className="admin-report-td admin-report-td-num px-3 py-2.5 text-right font-semibold text-slate-100">
                    {students.length}
                  </td>
                </tr>
                <tr className="bg-background-dark/20">
                  <td className="admin-report-td px-3 py-2.5 text-slate-300">Преподавателей в системе</td>
                  <td className="admin-report-td admin-report-td-num px-3 py-2.5 text-right font-semibold text-slate-100">
                    {teachers.length}
                  </td>
                </tr>
                <tr className="bg-surface">
                  <td className="admin-report-td px-3 py-2.5 text-slate-300">Задач в каталоге</td>
                  <td className="admin-report-td admin-report-td-num px-3 py-2.5 text-right font-semibold text-slate-100">
                    {tasks.length}
                  </td>
                </tr>
                <tr className="bg-background-dark/20">
                  <td className="admin-report-td px-3 py-2.5 text-slate-300">
                    Заявок преподавателей на рассмотрении
                  </td>
                  <td className="admin-report-td admin-report-td-num px-3 py-2.5 text-right font-semibold text-slate-100">
                    {teacherApplications.length}
                  </td>
                </tr>
              </tbody>
            </table>

            <h2 className="admin-report-h2 mb-3 border-b border-border-color pb-2 text-base font-bold text-slate-100">
              2. Пользователи
            </h2>
            <ul className="admin-report-list mb-7 list-none space-y-2 pl-0 text-sm leading-relaxed text-slate-300">
              <li className="admin-report-list-item flex gap-2">
                <span className="font-semibold text-slate-500">•</span>
                <span>
                  Студенты: всего {students.length}, активных {studentActive}, заблокированных {studentBlocked}.
                </span>
              </li>
              <li className="admin-report-list-item flex gap-2">
                <span className="font-semibold text-slate-500">•</span>
                <span>
                  Преподаватели: всего {teachers.length}, активных {teacherActive}, заблокированных {teacherBlocked}.
                </span>
              </li>
            </ul>

            <h2 className="admin-report-h2 mb-3 border-b border-border-color pb-2 text-base font-bold text-slate-100">
              3. Каталог задач
            </h2>
            <p className="admin-report-line mb-2 text-sm text-slate-300">Всего записей: {tasks.length}.</p>
            {taskPreview.length > 0 && (
              <>
                <p className="admin-report-label mb-2 text-xs font-medium tracking-wide text-slate-500 uppercase">
                  Примеры названий (первые пять)
                </p>
                <ol className="admin-report-ol mb-7 list-decimal space-y-1.5 pl-5 text-sm text-slate-300">
                  {taskPreview.map((t) => (
                    <li key={t.id} className="pl-1">
                      {t.name}
                    </li>
                  ))}
                </ol>
              </>
            )}

            <h2 className="admin-report-h2 mb-3 border-b border-border-color pb-2 text-base font-bold text-slate-100">
              4. Заявки преподавателей
            </h2>
            {teacherApplications.length === 0 ? (
              <p className="admin-report-line mb-7 text-sm italic text-slate-500">Нет заявок в очереди.</p>
            ) : (
              <ul className="admin-report-list mb-7 list-none space-y-2 pl-0 text-sm text-slate-300">
                {teacherApplications.map((a) => (
                  <li key={a.id} className="flex gap-2 border-l-2 border-primary/40 pl-3">
                    <span>
                      <span className="font-semibold text-slate-100">{a.fullName}</span>
                      <span className="text-slate-500"> — {a.stack}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <h2 className="admin-report-h2 mb-3 border-b border-border-color pb-2 text-base font-bold text-slate-100">
              5. Журнал последних действий
            </h2>
            {logPreview.length === 0 ? (
              <p className="admin-report-line mb-7 text-sm italic text-slate-500">Записей в журнале пока нет.</p>
            ) : (
              <ol className="admin-report-log mb-7 list-none space-y-3 pl-0 text-sm text-slate-300">
                {logPreview.map((entry, i) => (
                  <li
                    key={entry.id}
                    className="admin-report-log-row flex gap-3 border-b border-border-color pb-3 last:border-0"
                  >
                    <span className="w-6 shrink-0 font-mono text-xs font-semibold text-slate-500">{i + 1}.</span>
                    <div>
                      <span className="admin-report-log-time block text-xs text-slate-500">
                        {formatAdminActivityTime(entry.createdAt)}
                      </span>
                      <span className="text-slate-200">{entry.text}</span>
                    </div>
                  </li>
                ))}
              </ol>
            )}

            <h2 className="admin-report-h2 mb-3 border-b border-border-color pb-2 text-base font-bold text-slate-100">
              6. Примечание
            </h2>
            <p className="admin-report-note text-xs leading-relaxed text-slate-500">
              Данный документ отражает состояние данных на момент нажатия «Создать отчёт». Для оперативной работы
              (одобрение заявок, блокировки, задачи) используйте разделы панели администратора. При печати на бумаге
              рекомендуется проверить реквизиты и подпись ответственного лица.
            </p>
          </div>

          <footer className="admin-report-footer mt-auto flex items-center justify-end gap-4 border-t border-border-color bg-background-dark/40 px-6 py-3.5 sm:px-8">
            <span className="admin-report-footer-logo-wrap inline-flex shrink-0 items-center justify-center rounded-lg border border-border-color bg-slate-800/40 p-2">
              <img
                alt={SITE_NAME}
                className="admin-report-footer-logo size-8 shrink-0 sm:size-9"
                height={36}
                src={LOGO_SRC}
                width={36}
              />
            </span>
            <div className="min-w-0 text-right leading-tight pl-1">
              <div className="admin-report-footer-name text-base font-bold tracking-tight text-slate-100">
                {SITE_NAME}
              </div>
              <div className="admin-report-footer-tag text-xs text-slate-400">{SITE_TAGLINE}</div>
            </div>
          </footer>
        </div>

        <div className="admin-report-actions flex shrink-0 flex-col gap-2 border-t border-slate-600 pt-4">
          <div className="flex flex-wrap justify-end gap-2">
            <button
              className="inline-flex items-center gap-2 rounded-lg border border-slate-500 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
              type="button"
              onClick={handlePrint}
            >
              <Printer aria-hidden className="size-4" strokeWidth={1.75} />
              Печать
            </button>
            <button
              className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-background-dark hover:bg-primary/90"
              type="button"
              onClick={onClose}
            >
              Закрыть
            </button>
          </div>
          <p className="text-center text-[11px] leading-snug text-slate-500 sm:text-left">
            Логотип и название сайта печатаются в конце отчёта. Чтобы в PDF не попадали дата и адрес страницы, в окне
            печати отключите колонтитулы (Chrome: «Дополнительные настройки» → снимите флажок «Колонтитулы»).
          </p>
        </div>
      </div>
    </Modal>
  );
}
