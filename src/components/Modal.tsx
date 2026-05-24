import { XIcon } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** Разметка под печать отчёта: классы в global.css убирают fixed/backdrop из потока */
  adminReportPrint?: boolean;
}

export function Modal({ isOpen, onClose, title, children, adminReportPrint }: ModalProps) {
  if (!isOpen) return null;

  const print = Boolean(adminReportPrint);

  return (
    <div
      className={
        print
          ? 'admin-report-print-modal fixed inset-0 z-50 flex items-center justify-center p-4'
          : 'fixed inset-0 z-50 flex items-center justify-center p-4'
      }
    >
      <div
        className={
          print
            ? 'admin-report-print-modal-backdrop fixed inset-0 bg-black/50'
            : 'fixed inset-0 bg-black/50'
        }
        onClick={onClose}
      />
      <div
        className={
          print
            ? 'admin-report-print-modal-panel relative z-10 flex max-h-[min(90vh,900px)] w-full max-w-3xl flex-col rounded-lg bg-surface-dark'
            : 'relative z-10 flex max-h-[min(90vh,900px)] w-full max-w-3xl flex-col rounded-lg bg-surface-dark'
        }
      >
        <div
          className={
            print
              ? 'admin-report-print-modal-chrome flex shrink-0 justify-between border-b-1 border-slate-600 p-6'
              : 'flex shrink-0 justify-between border-b-1 border-slate-600 p-6'
          }
        >
          <span className="text-xl text-slate-100">{title}</span>
          <button aria-label="Закрыть" className="border-0 bg-transparent p-0" type="button" onClick={onClose}>
            <XIcon className="text-slate-500 hover:text-slate-300 h-7 w-7 cursor-pointer" />
          </button>
        </div>
        <div
          className={
            print
              ? 'admin-report-print-modal-body overflow-y-auto p-6'
              : 'overflow-y-auto p-6'
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
}
