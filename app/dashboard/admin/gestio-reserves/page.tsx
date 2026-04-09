'use client';

import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const GestioReserves = () => {
  return (
    <>
      <div className="p-5 pt-8 sm:pt-12">
        <h1 className="mb-10 rounded-2xl border border-white/10 bg-zinc-950/70 p-7 text-center text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
          Panell administrador de reserves
        </h1>
        <div className="text-center mb-2 flex flex-col gap-4 sm:flex-col sm:justify-center sm:gap-6">
          {/* Add reserve management options here */}
        </div>
      </div>
    </>
  );
};

export default GestioReserves;
