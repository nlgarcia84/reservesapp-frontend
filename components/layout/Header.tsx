import { logout } from '@/app/services/auth';
import { BurgerButton } from './BurgerButton';

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const Header = ({ sidebarOpen, onToggleSidebar }: HeaderProps) => {
  const handleLogout = () => {
    try {
      logout();
    } catch (error) {
      console.error('Error durante logout:', error);
      window.location.href = '/login';
    }
  };

  return (
    <header className="fixed left-0 top-0 z-30 flex h-16 w-full flex-row items-center justify-center border-b border-white/30 bg-black/80 px-4 text-zinc-100 backdrop-blur-sm sm:px-6 relative">
      <div className="absolute left-4 sm:left-6">
        <BurgerButton isOpen={sidebarOpen} onToggle={onToggleSidebar} />
      </div>
      <h1 className="text-lg font-semibold tracking-tight sm:text-2xl">
        RoomyApp Dashboard
      </h1>

      {/* Botó de Logout */}
      <button
        onClick={handleLogout}
        className="absolute right-2 sm:right-6 px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-zinc-800 text-zinc-100 hover:bg-zinc-700 transition-colors border border-zinc-700 hover:border-zinc-600 font-medium text-xs sm:text-sm"
      >
        Tancar sessió
      </button>
    </header>
  );
};
