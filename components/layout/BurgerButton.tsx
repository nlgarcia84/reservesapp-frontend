'use client';

import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export const BurgerButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <button
      onClick={() => setOpen(!open)}
      className="flex items-center p-2 rounded-md hover:bg-gray-200 focus:outline-none transition"
    >
      <Menu
        className={`w-6 h-6 text-gray-700 absolute transition-all duration-300 ${
          open ? 'opacity-0 scale-50' : 'opacity-100 scale-100'
        }`}
      />
      <X
        className={`w-6 h-6 text-gray-700 absolute transition-all duration-300 ${
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}
      />
    </button>
  );
};
