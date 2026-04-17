'use client';

import { useAuth } from '@/app/hooks/useAuth';
import { useTimeGreeting } from '@/app/hooks/useTimeGreeting';
import { Hand } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getRooms } from '@/app/services/rooms';
import { RoomList } from '@/components/ui/RoomList';

const EmployeePage = () => {
  const router = useRouter();
  // Extraiem també el token per poder fer la crida a l'API
  const { name, isAuthenticated, token } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  
  // Nous estats per a la llista de sales
  const [rooms, setRooms] = useState([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  
  const { greeting, icon } = useTimeGreeting();

  // 1. Comprovació de seguretat (el teu codi original)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.push('/login');
      } else {
        setIsChecking(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  // 2. Obtenció de les sales de la base de dades
  useEffect(() => {
    if (isAuthenticated && token) {
      setIsLoadingRooms(true);
      getRooms(token)
        .then((data) => setRooms(data))
        .catch((err) => console.error('Error carregant les sales:', err))
        .finally(() => setIsLoadingRooms(false));
    }
  }, [isAuthenticated, token]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-zinc-400">Carregant...</p>
      </div>
    );
  }

  return (
    <div className="mb-5 p-2 sm:p-4 max-w-7xl mx-auto">
      {/* Capçalera i Salutació */}
      <div className="mb-8">
        <div className="flex flex-row items-center mb-2">
          <h1 className="mr-3 text-3xl font-bold tracking-tight">
            {icon} {greeting}, {name}
          </h1>
          <Hand className="text-blue-400" size={28} />
        </div>

        <h2 className="text-base text-zinc-400 sm:text-lg font-light">
          Aquí tens un resum de les sales disponibles per a les teves reunions.
        </h2>
      </div>

      {/* Llistat de Sales */}
      <div className="mt-8">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-zinc-200">Catàleg de Sales</h3>
          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400">
            {rooms.length} disponibles
          </span>
        </div>

        {/* Control d'estat de càrrega */}
        {isLoadingRooms ? (
          <div className="flex justify-center p-10 text-zinc-400">
            <p>Carregant dades des del servidor...</p>
          </div>
        ) : (
          <RoomList 
            rooms={rooms} 
            isAdmin={false} // Vital: Això fa que no surti el botó d'eliminar!
          />
        )}
      </div>
    </div>
  );
};

export default EmployeePage;