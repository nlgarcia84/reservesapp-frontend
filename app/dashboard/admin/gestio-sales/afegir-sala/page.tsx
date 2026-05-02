'use client';

import { AddRoomForm } from '@/components/admin/AddRoomForm';
import { BackButton } from '@/components/ui/BackButton';

const AfegirSala = () => {
  return (
    <div className="p-5">
      <h1 className="mb-10 rounded-2xl border border-white/10 bg-zinc-950/70 p-7 text-center text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
        Afegir sala
      </h1>
      <div className="text-center mb-2">
        <AddRoomForm />
      </div>
      <div className="flex justify-center">
        <BackButton previouspage={'/dashboard/admin/gestio-sales'} />
      </div>
    </div>
  );
};

export default AfegirSala;
