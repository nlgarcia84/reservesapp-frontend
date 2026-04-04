'use client';

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
    <header className="left-0 top-0 z-30 flex h-16 w-full flex-row items-center justify-center border-b border-white/30 bg-black/80 px-4 text-zinc-100 backdrop-blur-sm sm:px-6 relative">
      <div className="absolute left-4 sm:left-6">
        <BurgerButton isOpen={sidebarOpen} onToggle={onToggleSidebar} />
      </div>
      <div className="flex flex-col items-center">
        <h1 className="text-lg font-semibold tracking-tight sm:text-2xl">
          RoomyApp Dashboard
        </h1>
      </div>

      {/* Botó de Logout */}
      <button
        onClick={handleLogout}
        className="absolute right-2 px-2 py-1 rounded-md bg-zinc-800 text-zinc-100 hover:bg-zinc-700 transition-colors font-semibold text-xs active:scale-95 active:shadow-inner duration-150 sm:right-6 sm:px-4 sm:py-2 sm:rounded-lg sm:border sm:border-zinc-700 sm:hover:border-zinc-600 sm:text-sm"
      >
        Sortir
      </button>
    </header>
  );
};
