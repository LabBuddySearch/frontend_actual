import { useNavigate } from 'react-router-dom';

type RegisterSuccessModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RegisterSuccessModal({ open, onOpenChange }: RegisterSuccessModalProps) {
  const navigate = useNavigate();

  if (!open) return null;

  const goLogin = () => {
    onOpenChange(false);
    navigate('/login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        aria-label="Закрыть"
        className="absolute inset-0 bg-black/60"
        type="button"
        onClick={() => onOpenChange(false)}
      />
      <div
        aria-labelledby="register-success-title"
        aria-modal="true"
        className="relative z-10 w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-2xl dark:border-border-dark dark:bg-surface-dark"
        role="dialog"
      >
        <h2
          className="mb-4 text-center text-lg font-semibold text-slate-900 dark:text-slate-100"
          id="register-success-title"
        >
          Поздравляем с регистрацией!
        </h2>
        <p className="mb-8 text-center text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Для подтверждения email на вашу почту было направлено письмо.
        </p>
        <button
          className="w-full rounded-lg bg-primary py-3.5 text-center text-base font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-[0.98]"
          type="button"
          onClick={goLogin}
        >
          Перейти на страницу входа →
        </button>
      </div>
    </div>
  );
}
