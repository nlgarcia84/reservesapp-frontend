import { logout } from '@/app/services/auth';
import { BurgerButton } from './BurgerButton';

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const Header = ({ sidebarOpen, onToggleSidebar }: HeaderProps) => {
  const handleLogout = () => {
    logout();
    console.log('Logout clicked');
  };

  return (
    <header className="fixed left-0 top-0 z-30 flex h-16 w-full flex-row items-center justify-between border-b border-white/30 bg-black/80 px-4 text-zinc-100 backdrop-blur-sm sm:px-6">
      <BurgerButton isOpen={sidebarOpen} onToggle={onToggleSidebar} />
      <h1 className="text-base font-semibold tracking-tight sm:text-lg">
        Dashboard RoomyApp
      </h1>

      {/* Botó de Logout */}
      <button
        onClick={handleLogout}
        className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-100 hover:bg-zinc-700 transition-colors border border-zinc-700 hover:border-zinc-600 font-medium text-sm"
      >
        Tancar sessió
      </button>
    </header>
  );
};
