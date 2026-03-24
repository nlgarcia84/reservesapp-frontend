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
        'border-r border-white/10 bg-zinc-950 text-zinc-100 shadow-2xl',
        'transform transition-transform duration-300 ease-in-out will-change-transform',
        open ? 'translate-x-0' : '-translate-x-full',
      ].join(' ')}
    >
      <nav className="flex flex-col gap-3 p-6 text-base font-medium [&>a]:rounded-lg [&>a]:border [&>a]:border-white/10 [&>a]:bg-zinc-900/70 [&>a]:px-4 [&>a]:py-2.5 [&>a]:transition-colors [&>a]:hover:bg-zinc-800">
        {/* Aqui va el Sidebar */}
        {children}
        <button
          type="button"
          onClick={onClose}
          className="mt-4 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-zinc-100"
        >
          Amaga
        </button>
      </nav>
    </aside>
  );
};
