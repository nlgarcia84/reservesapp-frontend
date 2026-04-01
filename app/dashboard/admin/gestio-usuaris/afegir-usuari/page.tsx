'use client';

import { AddUserForm } from '@/components/admin/AddUserForm';

export default function AfegirUsuaris() {
  return (
    <>
      <div className="p-5">
        <h1 className="mb-10 rounded-2xl border border-white/10 bg-zinc-950/70 p-7 text-center text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
          Afegir usuaris
        </h1>
        <div className="text-center mb-2">
          <AddUserForm />
        </div>
      </div>
    </>
  );
}
