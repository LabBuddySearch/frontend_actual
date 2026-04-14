import { ChevronDown } from 'lucide-react';
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';

export type AdminSelectOption<T extends string | number> = {
  value: T;
  label: string;
};

type AdminCustomSelectProps<T extends string | number> = {
  value: T;
  onChange: (value: T) => void;
  options: AdminSelectOption<T>[];
  /** md = как поле «Все статусы» (h-11), sm = как селект в пагинации (h-9) */
  size?: 'md' | 'sm';
  id?: string;
  ariaLabel?: string;
};

const triggerMd =
  'relative inline-flex h-11 w-full min-w-0 items-center rounded-lg border border-border-color bg-surface py-0 pl-4 pr-10 text-left shadow-md shadow-black/25 transition-colors hover:bg-white/5 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none dark:border-border-dark';

const triggerSm =
  'relative inline-flex h-9 w-full min-w-[3.25rem] items-center rounded border border-border-color bg-surface py-0 pl-2 pr-8 shadow-sm transition-colors hover:bg-white/5 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none dark:border-border-dark';

const labelMd = 'block min-w-0 flex-1 truncate text-left text-sm font-medium text-slate-200';
const labelSm =
  'block w-full truncate text-center text-sm font-medium tabular-nums text-slate-200';

const optionMd =
  'flex h-11 w-full items-center border-0 bg-transparent px-4 text-left text-sm font-medium text-slate-200 transition-colors hover:bg-white/5';
const optionSm =
  'flex h-9 w-full items-center justify-center border-0 bg-transparent px-2 text-center text-sm font-medium tabular-nums text-slate-200 transition-colors hover:bg-white/5';

const optionSelected = 'bg-white/10';

/** max-h-60 = 15rem ≈ 240px */
const LIST_MAX_HEIGHT_PX = 240;

const listPanelBase =
  'absolute left-0 right-0 z-50 max-h-60 min-w-full overflow-auto rounded-lg border border-border-color bg-surface py-1 shadow-lg dark:border-border-dark';

export function AdminCustomSelect<T extends string | number>({
  value,
  onChange,
  options,
  size = 'md',
  id: idProp,
  ariaLabel,
}: AdminCustomSelectProps<T>) {
  const autoId = useId();
  const id = idProp ?? `admin-select-${autoId}`;
  const listId = `${id}-listbox`;
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? '';

  useLayoutEffect(() => {
    if (!open) {
      setOpenUp(false);
      return;
    }

    const updatePlacement = () => {
      const el = triggerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const spaceBelow = window.innerHeight - r.bottom;
      const spaceAbove = r.top;
      if (spaceBelow >= LIST_MAX_HEIGHT_PX) {
        setOpenUp(false);
      } else if (spaceAbove >= LIST_MAX_HEIGHT_PX) {
        setOpenUp(true);
      } else {
        setOpenUp(spaceAbove > spaceBelow);
      }
    };

    updatePlacement();
    window.addEventListener('resize', updatePlacement);
    window.addEventListener('scroll', updatePlacement, true);
    return () => {
      window.removeEventListener('resize', updatePlacement);
      window.removeEventListener('scroll', updatePlacement, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const triggerClass = size === 'md' ? triggerMd : triggerSm;
  const labelClass = size === 'md' ? labelMd : labelSm;
  const rowClass = size === 'md' ? optionMd : optionSm;

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        ref={triggerRef}
        aria-expanded={open}
        aria-controls={listId}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className={triggerClass}
        id={id}
        type="button"
        onClick={() => setOpen((v) => !v)}
      >
        <span className={labelClass}>{selectedLabel}</span>
        <ChevronDown
          aria-hidden
          className={`pointer-events-none absolute top-1/2 shrink-0 -translate-y-1/2 text-slate-400 ${size === 'md' ? 'right-3 size-5' : 'right-2 size-3.5'}`}
        />
      </button>
      {open && (
        <ul
          className={`${listPanelBase} ${openUp ? 'bottom-full mb-1' : 'top-full mt-1'}`}
          id={listId}
          role="listbox"
          tabIndex={-1}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li key={String(opt.value)} className="list-none" role="presentation">
                <button
                  className={`${rowClass} ${isSelected ? optionSelected : ''} cursor-pointer`}
                  role="option"
                  type="button"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                >
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
