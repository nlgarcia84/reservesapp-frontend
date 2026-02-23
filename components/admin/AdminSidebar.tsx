'use client';

type AdminSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export const AdminSidebar = ({ open, onClose }: AdminSidebarProps) => {
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
        <a href="">Dashboard</a>
        <a href="">Gestió de Sales</a>
        <a href="">Gestió Usuaris</a>
        <a href="">Gestió Reserves</a>
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
