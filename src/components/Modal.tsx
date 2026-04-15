import { XIcon } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 bg-surface-dark rounded-lg min-w-[300px]">
        <div className="flex justify-between p-6 border-b-1 border-slate-600">
          <span className="text-xl text-slate-100">{title}</span>
          <XIcon className="text-slate-500 hover:text-slate-300 h-7 w-7" onClick={onClose} />
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
