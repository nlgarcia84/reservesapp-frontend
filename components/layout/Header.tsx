import { BurgerButton } from './BurgerButton';

interface HeaderProps {
  sidebar: () => void;
}

export const Header = ({ sidebar }: HeaderProps) => {
  return (
    <header className="flex flex-row justify-between h-15 border-b bg-emerald-400 text-emerald-950 items-center px-6">
      <BurgerButton sidebar={sidebar} />
      <h1 className="text-xl font-bold">Dashboard ReservesApp</h1>
    </header>
  );
};
