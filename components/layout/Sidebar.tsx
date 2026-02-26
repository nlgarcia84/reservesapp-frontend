'use client';

type Sidebar = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const Sidebar = ({ open, onClose, children }: Sidebar) => {
  return (
    <aside
      className={[
        'fixed left-0 top-0 z-50 h-dvh w-64',
        'bg-emerald-400 text-slate-800',
        'transform transition-transform duration-300 ease-in-out will-change-transform',
        open ? 'translate-x-0' : '-translate-x-full',
      ].join(' ')}
      aria-hidden={!open}
    >
      <nav className="p-10 flex flex-col gap-4 text-2xl">
        {children}
        <button
          type="button"
          onClick={onClose}
          className="mt-6 text-base underline"
        >
          Amaga
        </button>
      </nav>
    </aside>
  );
};
