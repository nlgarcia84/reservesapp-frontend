import { BurgerButton } from './BurgerButton';

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const Header = ({ sidebarOpen, onToggleSidebar }: HeaderProps) => {
  return (
    <header className="fixed left-0 top-0 z-30 flex h-16 w-full flex-row items-center justify-between border-b border-white/30 bg-black/80 px-4 text-zinc-100 backdrop-blur-sm sm:px-6">
      <BurgerButton isOpen={sidebarOpen} onToggle={onToggleSidebar} />
      <h1 className="text-base font-semibold tracking-tight sm:text-lg">
        Dashboard RoomyApp
      </h1>
    </header>
  );
};
