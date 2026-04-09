'use client';

import { useAuth } from '@/app/hooks/useAuth';
import { useTimeGreeting } from '@/app/hooks/useTimeGreeting';
import { Hand } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const EmployeePage = () => {
  const router = useRouter();
  const { name, isAuthenticated } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const { greeting, icon } = useTimeGreeting();

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
    <div className="mb-5 p-2 sm:p-4">
      <div className="flex flex-row">
        <h1 className="mb-2 mr-3 text-3xl font-bold tracking-tight">
          {icon}
          {greeting}, {name}
        </h1>
        <Hand className="text-blue-400" />
      </div>

      <h2 className="text-base text-zinc-400 sm:text-lg font-light">
        Aqui tens un resum de les teves sales i reserves.
      </h2>
    </div>
  );
};

export default EmployeePage;
