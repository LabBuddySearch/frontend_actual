import { useCallback, useEffect, useRef, useState, type FC } from 'react';
import ReactCodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { Clock, Code, Loader2, RefreshCwIcon, SendHorizonalIcon } from 'lucide-react';
import type { TaskLanguage } from '@/types/task';

type Props = {
  lang: TaskLanguage;
  onSubmit: (sourceCode: string) => void | Promise<void>;
  isSubmitting?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  timeLimitMs?: number;
  autoSubmitOnTimeout?: boolean;
  /** Меняйте после успешной/неуспешной сдачи, чтобы перезапустить таймер */
  timerSessionKey?: string | number;
};

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const IDEEditor: FC<Props> = ({
  lang,
  onSubmit,
  isSubmitting = false,
  disabled = false,
  disabledReason,
  timeLimitMs = 0,
  autoSubmitOnTimeout = true,
  timerSessionKey = 'initial',
}) => {
  const extentions = [];
  let defaultCode = '';

  switch (lang) {
    case 'JavaScript':
      extentions.push(javascript());
      defaultCode = '// Пишите код здесь';
      break;
    case 'Java':
      extentions.push(java());
      defaultCode = 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("");\n    }\n}';
      break;
    case 'Python':
      extentions.push(python());
      defaultCode = '# Пишите код здесь';
      break;
    default:
      ((x: never) => x)(lang);
  }

  const [code, setCode] = useState(defaultCode);
  const [secondsLeft, setSecondsLeft] = useState(() =>
    timeLimitMs > 0 ? Math.ceil(timeLimitMs / 1000) : 0,
  );
  const timeoutFiredRef = useRef(false);
  const codeRef = useRef(code);

  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  useEffect(() => {
    if (timeLimitMs <= 0 || disabled) return undefined;
    timeoutFiredRef.current = false;
    setSecondsLeft(Math.ceil(timeLimitMs / 1000));

    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [timeLimitMs, disabled, timerSessionKey]);

  useEffect(() => {
    if (secondsLeft !== 0 || disabled || isSubmitting || !autoSubmitOnTimeout || timeLimitMs <= 0) {
      return;
    }
    if (timeoutFiredRef.current) return;
    timeoutFiredRef.current = true;
    const current = codeRef.current.trim();
    if (current) {
      void onSubmit(codeRef.current);
    }
  }, [secondsLeft, disabled, isSubmitting, autoSubmitOnTimeout, timeLimitMs, onSubmit]);

  const onChange = useCallback((value: string) => {
    setCode(value);
  }, []);

  const onClearCode = () => {
    if (disabled) return;
    setCode(defaultCode);
  };

  const onSendCode = () => {
    if (isSubmitting || disabled || !code.trim()) return;
    void onSubmit(code);
  };

  const editorDisabled = disabled || isSubmitting;
  const timerUrgent = secondsLeft > 0 && secondsLeft <= 30;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-400">
          <Code />
          <span className="text-sm font-semibold uppercase tracking-widest">Редактор кода</span>
        </div>
        <div className="flex items-center gap-4">
          {timeLimitMs > 0 && !disabled && (
            <div
              className={`flex items-center gap-2 text-sm font-mono px-3 py-1 rounded-lg border ${
                timerUrgent
                  ? 'border-rose-500/50 text-rose-400 bg-rose-500/10'
                  : 'border-slate-700 text-slate-300 bg-slate-800/50'
              }`}
            >
              <Clock className="size-4" />
              {formatTimer(secondsLeft)}
            </div>
          )}
          <button
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors disabled:opacity-40"
            disabled={editorDisabled}
            type="button"
            onClick={onClearCode}
          >
            <RefreshCwIcon size={16} />
            Сбросить код
          </button>
        </div>
      </div>

      {disabled && disabledReason && (
        <p className="text-sm text-amber-400/90 bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-3">
          {disabledReason}
        </p>
      )}

      <ReactCodeMirror
        value={code}
        onChange={onChange}
        theme={oneDark}
        extensions={extentions}
        height="500px"
        editable={!editorDisabled}
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
          className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={editorDisabled || !code.trim()}
          type="button"
          onClick={onSendCode}
        >
          {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : <SendHorizonalIcon />}
          {isSubmitting ? 'Отправка...' : 'Отправить на проверку'}
        </button>
      </div>
    </section>
  );
};
