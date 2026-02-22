import { BurgerButton } from './BurgerButton';

export const Header = () => {
  return (
    <header className="flex flex-row justify-between h-15 border-b bg-emerald-400 text-emerald-950 items-center px-6">
      <BurgerButton />
      <h1 className="text-xl font-bold">Dashboard ReservesApp</h1>
    </header>
  );
};
