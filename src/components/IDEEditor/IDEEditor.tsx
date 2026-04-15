import { useCallback, useState, type FC } from 'react';
import ReactCodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { Code, RefreshCwIcon, SendHorizonalIcon } from 'lucide-react';
import type { Task } from '@/pages/student/StudentTasksPage/StudentTasksPage';

type Props = Pick<Task, 'lang'>;

export const IDEEditor: FC<Props> = ({ lang }) => {
  const extentions = [];
  let defaultCode = '';

  switch (lang) {
    case 'JavaScript':
      extentions.push(javascript());
      defaultCode = '// Пишите код здесь';
      break;
    case 'Java':
      extentions.push(java());
      defaultCode = '// Пишите код здесь';
      break;
    case 'Python':
      extentions.push(python());
      defaultCode = '# Пишите код здесь';
      break;
    default:
      ((x: never) => x)(lang);
  }

  const [code, setCode] = useState(defaultCode);

  const onChange = useCallback((value: string) => {
    setCode(value);
  }, []);

  const onClearCode = () => {
    setCode('');
  };

  const onSendCode = () => {
    console.log(code);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-400">
          <Code />
          <span className="text-sm font-semibold uppercase tracking-widest">Редактор кода</span>
        </div>
        <button
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
          onClick={onClearCode}
        >
          <RefreshCwIcon size={16} />
          Сбросить код
        </button>
      </div>

      <ReactCodeMirror
        value={code}
        onChange={onChange}
        theme={oneDark}
        extensions={extentions}
        height="500px"
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          bracketMatching: true,
          highlightActiveLine: true,
          tabSize: 4,
        }}
      />

      <div className="flex justify-end pt-2">
        <button
          className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
          onClick={onSendCode}
        >
          <SendHorizonalIcon />
          Отправить на проверку
        </button>
      </div>
    </section>
  );
};
