'use client';

import { BackButton } from '@/components/ui/BackButton';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const GestioUsuaris = () => {
  return (
    <div className="p-5 pt-8 sm:pt-12">
      {/* Títol */}
      <h1 className="mb-10 rounded-2xl border border-white/10 bg-zinc-950/70 p-7 text-center text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
        Panell administrador d&apos;usuaris
      </h1>

      <div className="max-w-7xl mx-auto flex flex-col justify-center">
        {/* Botons afegir i esborrar */}
        <div className="mb-12 flex flex-wrap justify-center gap-4">
          <Link href="/dashboard/admin/gestio-usuaris/afegir-usuari">
            <Button className="px-10">Afegir usuari</Button>
          </Link>
          <Link href="/dashboard/admin/gestio-usuaris/esborrar-usuari">
            <Button className="px-10 border-red-500/50 text-red-500 hover:bg-red-500/10">
              Esborrar usuari
            </Button>
          </Link>
        </div>
        <BackButton
          text={'Tornar al Dashboard'}
          previouspage={'/dashboard/admin'}
        />
      </div>
    </div>
  );
};

export default GestioUsuaris;
