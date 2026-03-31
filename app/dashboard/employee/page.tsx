'use client';

import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const EmployeePage = () => {
  const router = useRouter();
  const { name, isAuthenticated } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Pequeño delay para permitir que useAuth se inicialice
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.push('/login');
      } else {
        setIsChecking(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-zinc-400">Carregant...</p>
      </div>
    );
  }

  return (
    <section className="mx-auto w-full max-w-3xl rounded-2xl border border-white/10 bg-zinc-950/70 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
        Bon dia {name || 'usuari'}
      </h1>
      <p className="mt-2 text-zinc-400">Panell d&apos;empleat en preparació.</p>
    </section>
  );
};

export default EmployeePage;
