'use client';

import { AddUserForm } from '@/components/admin/AddUserForm';
import { SquareChevronLeft } from 'lucide-react';
import Link from 'next/link';

const AfegirUsuaris = () => {
  return (
    <>
      <div className="p-5">
        <h1 className="mb-10 rounded-2xl border border-white/10 bg-zinc-950/70 p-7 text-center text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
          Afegir usuaris
        </h1>
        <div className="text-center mb-2">
          <AddUserForm />
        </div>
        <Link href={'/dashboard/admin/gestio-usuaris'}>
          <div className="flex flex-row justify-center text-blue-500 font-semiboldtext-blue-500 font-semibold hover:text-blue-400 cursor-pointer">
            <SquareChevronLeft />
            <span className="pl-2">Tornar</span>
          </div>
        </Link>
      </div>
    </>
  );
};

export default AfegirUsuaris;
