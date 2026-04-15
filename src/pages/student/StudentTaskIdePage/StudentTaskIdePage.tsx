import { BanIcon, CheckCircle2, HistoryIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { Task } from '../StudentTasksPage/StudentTasksPage';
import { IDEEditor } from '@/components/IDEEditor';

interface LocationState {
  task: Task;
}

export function StudentTaskIdePage() {
  const location = useLocation() as { state: LocationState };

  const {
    task: { name, description, lang, time, memory },
  } = location.state || {};

  useEffect(() => {
    document.title = 'Задача | EduCode';
    return () => {
      document.title = 'Вход | Programming Education';
    };
  }, []);

  return (
    <main className="flex-1 max-w-6xl mx-auto w-full p-6 space-y-6">
      <section className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{name}</h1>
              <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/20">
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                {lang}
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">{description}</p>
          </div>
          <div className="grid grid-cols-2 md:flex flex-col gap-2 min-w-[200px]">
            <div className="flex items-center justify-between p-3 rounded-lg bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Время</span>
              <span className="text-sm font-mono text-primary">{`${(time / 1000).toFixed(1)}с`}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Память</span>
              <span className="text-sm font-mono text-primary">{`${memory}МБ`}</span>
            </div>
          </div>
        </div>
      </section>

      <IDEEditor lang={lang} />

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-slate-400">
          <HistoryIcon size={20} />
          <span className="text-sm font-semibold uppercase tracking-widest">Последние попытки</span>
        </div>
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-background-dark/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Статус</th>
                <th className="px-6 py-4">Язык</th>
                <th className="px-6 py-4">Время</th>
                <th className="px-6 py-4">Память</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-mono text-slate-400">#84291</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-emerald-500 font-semibold">
                    <CheckCircle2 className="text-emerald-500" />
                    OK
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-300">{lang}</td>
                <td className="px-6 py-4 text-slate-400">0.04s</td>
                <td className="px-6 py-4 text-slate-400">12.4 MB</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-mono text-slate-400">#84285</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-rose-500 font-semibold">
                    <BanIcon />
                    Error
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-300">{lang}</td>
                <td className="px-6 py-4 text-slate-400">—</td>
                <td className="px-6 py-4 text-slate-400">—</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-mono text-slate-400">#84112</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-emerald-500 font-semibold">
                    <CheckCircle2 className="text-emerald-500" />
                    OK
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-300">{lang}</td>
                <td className="px-6 py-4 text-slate-400">0.05s</td>
                <td className="px-6 py-4 text-slate-400">11.8 MB</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
