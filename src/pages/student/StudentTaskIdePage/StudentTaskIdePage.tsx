import { BanIcon, CheckCircle2, Code, HistoryIcon, RefreshCwIcon, SendHorizonalIcon } from 'lucide-react';
import { useEffect } from 'react';

export function StudentTaskIdePage() {
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
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Сумма двух чисел</h1>
              <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/20">
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                Java
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              Реализуйте функцию{' '}
              <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded text-primary">sum(a, b)</code>, которая
              принимает два целых числа и возвращает их сумму. Числа могут быть отрицательными. Ваше решение должно
              корректно обрабатывать переполнение типа <code>int</code>.
            </p>
          </div>
          <div className="grid grid-cols-2 md:flex flex-col gap-2 min-w-[200px]">
            <div className="flex items-center justify-between p-3 rounded-lg bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Время</span>
              <span className="text-sm font-mono text-primary">1.0с</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Память</span>
              <span className="text-sm font-mono text-primary">256МБ</span>
            </div>
          </div>
        </div>
      </section>
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <Code />
            <span className="text-sm font-semibold uppercase tracking-widest">Редактор кода</span>
          </div>
          <button className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
            <RefreshCwIcon size={16} />
            Сбросить код
          </button>
        </div>
        <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#000000] relative">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#161B22] border-b border-slate-800">
            <span className="text-xs text-slate-400 font-mono">Solution.java</span>
          </div>
          <div className="p-6 code-editor min-h-[400px] text-sm md:text-base leading-relaxed overflow-x-auto">
            <div className="flex gap-4">
              <div className="text-slate-600 select-none text-right min-w-[2rem]">
                1<br />2<br />3<br />4<br />5<br />6<br />7<br />8<br />9<br />
                10
              </div>
              <div className="text-slate-300">
                <span className="text-purple-400">import</span> java.util.Scanner;
                <br />
                <br />
                <span className="text-purple-400">public class</span> <span className="text-yellow-200">Solution</span>{' '}
                <span>{' {'}</span>
                <br />
                <span className="text-purple-400">public static void</span> <span className="text-blue-400">main</span>
                (String[] args)<span>{' {'}</span> <br />
                Scanner sc = <span className="text-purple-400">new</span> Scanner(System.in);
                <br />
                <span className="text-slate-500">// Ваш код здесь</span>
                <br />
                <span className="animate-pulse border-l-2 border-primary ml-1 h-5 inline-block align-middle"></span>
                <br />
                <span>{'}'}</span>
                <br />
                <span>{'}'}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <button className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
            <SendHorizonalIcon />
            Отправить на проверку
          </button>
        </div>
      </section>
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
                <td className="px-6 py-4 text-slate-300">Java</td>
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
                <td className="px-6 py-4 text-slate-300">Java</td>
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
                <td className="px-6 py-4 text-slate-300">Java</td>
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
