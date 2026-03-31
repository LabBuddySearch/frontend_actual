type LogoutConfirmModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function LogoutConfirmModal({ open, onOpenChange, onConfirm }: LogoutConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        aria-label="Закрыть"
        className="absolute inset-0 bg-black/60"
        type="button"
        onClick={() => onOpenChange(false)}
      />
      <div
        aria-labelledby="logout-confirm-title"
        aria-modal="true"
        className="relative z-10 w-full max-w-sm rounded-xl border border-border-color bg-surface p-6 shadow-2xl"
        role="dialog"
      >
        <h2
          className="mb-4 text-center text-lg font-semibold text-slate-100"
          id="logout-confirm-title"
        >
          Уверены, что хотите выйти?
        </h2>
        <div className="flex gap-3">
          <button
            className="flex-1 rounded-lg border border-border-color py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5"
            type="button"
            onClick={() => onOpenChange(false)}
          >
            Остаться
          </button>
          <button
            className="flex-1 rounded-lg bg-red-500/90 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-600"
            type="button"
            onClick={onConfirm}
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
}
