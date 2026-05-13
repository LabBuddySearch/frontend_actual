import {
  Award,
  BarChart3,
  CheckCircle2,
  Code,
  History,
  Rocket,
  User,
  UserCircle2,
  UserPlus,
  XCircle,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Modal } from '@/components/Modal';
import { AdminReportModal } from '@/pages/admin/AdminReportModal';
import { formatAdminActivityTime } from '@/pages/admin/adminActivityFormat';
import { useAdminPlatformStore } from '@/store/adminPlatformStore';
import type { TeacherApplication } from '@/store/adminPlatformStore';

function RequestRow({
  row,
  onApprove,
  onReject,
}: {
  row: TeacherApplication;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 p-4 transition-colors hover:bg-background-dark md:flex-row md:items-center md:p-6">
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-full border border-border-color bg-slate-800">
          <UserCircle2 aria-hidden className="size-7 text-slate-400" strokeWidth={1.25} />
        </div>
        <div>
          <h3 className="font-semibold text-slate-100">{row.fullName}</h3>
          <p className="text-xs text-slate-500 italic">{row.stack}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1.5 rounded-full border border-status-yellow/20 bg-status-yellow/10 px-3 py-1">
          <div className="size-2 rounded-full bg-status-yellow" />
          <span className="text-xs font-bold text-status-yellow uppercase">Ожидает</span>
        </div>
        <div className="flex gap-2">
          <button
            className="flex items-center gap-2 rounded-lg bg-status-green px-4 py-2 text-sm font-bold text-white transition-all hover:brightness-110"
            type="button"
            onClick={() => onApprove(row.id)}
          >
            <CheckCircle2 aria-hidden className="size-[18px]" strokeWidth={2} />
            Одобрить
          </button>
          <button
            className="flex items-center gap-2 rounded-lg bg-status-red px-4 py-2 text-sm font-bold text-white transition-all hover:brightness-110"
            type="button"
            onClick={() => onReject(row.id)}
          >
            <XCircle aria-hidden className="size-[18px]" strokeWidth={2} />
            Отклонить
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminDashboardPage() {
  const users = useAdminPlatformStore((s) => s.users);
  const teacherApplications = useAdminPlatformStore((s) => s.teacherApplications);
  const tasks = useAdminPlatformStore((s) => s.tasks);
  const activityLog = useAdminPlatformStore((s) => s.activityLog);
  const approveTeacherApplication = useAdminPlatformStore((s) => s.approveTeacherApplication);
  const rejectTeacherApplication = useAdminPlatformStore((s) => s.rejectTeacherApplication);

  const [requestsModalOpen, setRequestsModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  useEffect(() => {
    document.title = 'Панель Администратора | EduCode';
    return () => {
      document.title = 'Вход | Programming Education';
    };
  }, []);

  const studentCount = useMemo(() => users.filter((u) => u.role === 'STUDENT').length, [users]);
  const teacherCount = useMemo(() => users.filter((u) => u.role === 'TEACHER').length, [users]);
  const taskCount = tasks.length;
  const pendingApps = teacherApplications.length;

  const summaryCards = useMemo(
    () => [
      {
        label: 'Всего студентов',
        value: String(studentCount),
        badge: '+12%',
        badgeClass: 'text-status-green bg-status-green/10',
        icon: User,
        iconWrap: 'bg-primary/10 group-hover:bg-primary/20',
        iconClass: 'text-primary',
      },
      {
        label: 'Всего преподавателей',
        value: String(teacherCount),
        badge: pendingApps > 0 ? `Заявок: ${pendingApps}` : 'Стабильно',
        badgeClass: 'text-slate-500 bg-slate-500/10',
        icon: Award,
        iconWrap: 'bg-purple-500/10 group-hover:bg-purple-500/20',
        iconClass: 'text-purple-400',
      },
      {
        label: 'Всего задач',
        value: String(taskCount),
        badge: 'Актуально',
        badgeClass: 'text-status-yellow bg-status-yellow/10',
        icon: Code,
        iconWrap: 'bg-status-yellow/10 group-hover:bg-status-yellow/20',
        iconClass: 'text-status-yellow',
      },
    ],
    [studentCount, teacherCount, taskCount, pendingApps],
  );

  const previewRequests = teacherApplications.slice(0, 3);

  const handleApprove = (id: string) => {
    approveTeacherApplication(id);
  };

  const handleReject = (id: string) => {
    rejectTeacherApplication(id);
  };

  return (
    <main className="w-full space-y-8 overflow-y-auto p-6 lg:p-10">
      <div className="mx-auto max-w-6xl space-y-8 pb-10">
        <section>
          <h2 className="mb-6 flex items-center gap-2 text-xl leading-tight font-bold text-slate-100">
            <BarChart3 aria-hidden className="size-6 text-primary" strokeWidth={1.75} />
            Сводка системы
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {summaryCards.map((card) => (
              <div
                key={card.label}
                className="group rounded-xl border border-border-color bg-surface p-6 transition-colors hover:border-primary/50"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className={`rounded-lg p-2 transition-colors ${card.iconWrap}`}>
                    <card.icon aria-hidden className={`size-5 ${card.iconClass}`} strokeWidth={1.75} />
                  </div>
                  <span className={`rounded px-2 py-1 text-xs font-medium ${card.badgeClass}`}>
                    {card.badge}
                  </span>
                </div>
                <p className="mb-1 text-sm font-medium text-slate-400">{card.label}</p>
                <p className="text-3xl font-bold text-slate-100">{card.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl leading-tight font-bold text-slate-100">
              <UserPlus aria-hidden className="size-6 text-primary" strokeWidth={1.75} />
              Заявки преподавателей
            </h2>
            <button
              className="text-sm font-medium text-primary hover:underline"
              type="button"
              onClick={() => setRequestsModalOpen(true)}
            >
              Смотреть все
            </button>
          </div>
          <div className="overflow-hidden rounded-xl border border-border-color bg-surface">
            {previewRequests.length === 0 ? (
              <p className="p-6 text-sm text-slate-500">Нет заявок на рассмотрении.</p>
            ) : (
              <div className="grid grid-cols-1 divide-y divide-border-color">
                {previewRequests.map((row) => (
                  <RequestRow key={row.id} row={row} onApprove={handleApprove} onReject={handleReject} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border-color bg-surface p-6">
            <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-100">
              <History aria-hidden className="size-5 text-primary" strokeWidth={1.75} />
              Последние действия
            </h3>
            <div className="space-y-4">
              {activityLog.length === 0 ? (
                <p className="text-sm text-slate-500">Пока нет записей — действия появятся здесь автоматически.</p>
              ) : (
                activityLog.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="mt-2 size-1 shrink-0 rounded-full bg-primary ring-4 ring-primary/10" />
                    <div>
                      <p className="text-sm text-slate-100">{item.text}</p>
                      <p className="text-xs text-slate-500">{formatAdminActivityTime(item.createdAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-6 text-center">
            <Rocket aria-hidden className="mb-4 size-14 text-primary" strokeWidth={1.25} />
            <h3 className="text-lg font-bold text-slate-100">Готовы к масштабированию?</h3>
            <p className="mt-2 max-w-xs text-sm text-slate-400">
              EduCode Dashboard позволяет управлять всеми аспектами вашей платформы в одном месте.
            </p>
            <button
              className="mt-6 rounded-lg bg-primary px-6 py-2 font-bold text-slate-900 transition-all hover:bg-primary/90"
              type="button"
              onClick={() => setReportModalOpen(true)}
            >
              Создать отчет
            </button>
          </div>
        </section>
      </div>

      <AdminReportModal open={reportModalOpen} onClose={() => setReportModalOpen(false)} />

      <Modal isOpen={requestsModalOpen} onClose={() => setRequestsModalOpen(false)} title="Все заявки преподавателей">
        <div className="max-h-[70vh] max-w-lg overflow-y-auto">
          {teacherApplications.length === 0 ? (
            <p className="text-sm text-slate-500">Нет заявок на рассмотрении.</p>
          ) : (
            <div className="grid grid-cols-1 divide-y divide-border-color rounded-lg border border-border-color">
              {teacherApplications.map((row) => (
                <RequestRow key={row.id} row={row} onApprove={handleApprove} onReject={handleReject} />
              ))}
            </div>
          )}
        </div>
      </Modal>
    </main>
  );
}
