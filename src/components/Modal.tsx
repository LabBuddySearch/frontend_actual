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
          ? 'admin-report-print-modal fixed inset-0 z-50 flex items-center justify-center'
          : 'fixed inset-0 z-50 flex items-center justify-center'
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
            ? 'admin-report-print-modal-panel relative z-10 min-w-[300px] rounded-lg bg-surface-dark'
            : 'relative z-10 min-w-[300px] rounded-lg bg-surface-dark'
        }
      >
        <div
          className={
            print
              ? 'admin-report-print-modal-chrome flex justify-between border-b-1 border-slate-600 p-6'
              : 'flex justify-between border-b-1 border-slate-600 p-6'
          }
        >
          <span className="text-xl text-slate-100">{title}</span>
          <XIcon className="text-slate-500 hover:text-slate-300 h-7 w-7" onClick={onClose} />
        </div>
        <div className={print ? 'admin-report-print-modal-body p-6' : 'p-6'}>{children}</div>
      </div>
    </div>
  );
}
