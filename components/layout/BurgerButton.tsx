'use client';

import { Menu, X } from 'lucide-react';

interface BurgerButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const BurgerButton = ({ isOpen, onToggle }: BurgerButtonProps) => {
  return (
    <button
      onClick={onToggle}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-zinc-900/70 transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <Menu
        className={`absolute h-6 w-6 text-zinc-100 transition-all duration-300 ${
          isOpen ? 'opacity-0 scale-50' : 'opacity-100 scale-100'
        }`}
      />
      <X
        className={`absolute h-6 w-6 text-zinc-100 transition-all duration-300 ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}
      />
    </button>
  );
};
