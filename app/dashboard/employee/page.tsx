'use client';

import { useAuth } from '@/app/hooks/useAuth';
import { useTimeGreeting } from '@/app/hooks/useTimeGreeting';
import { Hand } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { getRooms, type Room } from '@/app/services/rooms';
import { RoomList } from '@/components/ui/RoomList';

const EmployeePage = () => {
  const router = useRouter();
  // Extraiem també el token per poder fer la crida a l'API
  const { name, isAuthenticated, token } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  // Estats per a la llista de sales del catàleg
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);

  const { greeting, icon } = useTimeGreeting();

  // 1. Comprovació de seguretat: redirigeix al login si l'usuari no està autenticat
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

  // 2. Funció memoritzada per obtenir les sales de la base de dades
  // Evita recàrregues innecessàries gràcies a useCallback
  // Paràmetres: cap (utilitza el token del contexte d'autenticació)
  // Retorna: cap (actualitza els estats de rooms i isLoadingRooms)
  const fetchRooms = useCallback(async () => {
    if (!token) return;
    try {
      setIsLoadingRooms(true);
      const data = await getRooms(token);
      setRooms(data);
    } catch (err) {
      console.error('Error carregant les sales:', err);
    } finally {
      setIsLoadingRooms(false);
    }
  }, [token]);

  // 3. Efecte que dispara la crida a les sales quan l'usuari s'autentica
  useEffect(() => {
    if (isAuthenticated) {
      fetchRooms();
    }
  }, [isAuthenticated, fetchRooms]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-zinc-400">Carregant...</p>
      </div>
    );
  }

  return (
    <div className="mb-5 p-2 sm:p-4 max-w-7xl mx-auto">
      {/* Secció de capçalera amb el greeting personalitzat segons la hora del dia */}
      <div className="mb-8">
        <div className="flex flex-row items-center mb-2">
          <h1 className="mr-3 text-3xl font-bold tracking-tight">
            {icon + ' '} {greeting}, {name}
          </h1>
          <Hand className="text-blue-400" size={28} />
        </div>

        {/* Subtítol informatiu sobre el catàleg de sales */}
        <h2 className="text-base text-zinc-400 sm:text-lg font-light">
          Aquí tens un resum de les sales disponibles per a les teves reunions.
        </h2>
      </div>

      {/* Secció principal: Catàleg de sales disponibles */}
      <div className="mt-8">
        {/* Capçalera del catàleg amb contador de sales */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-zinc-200">
            Catàleg de sales
          </h3>
          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400">
            {rooms.length} disponibles
          </span>
        </div>

        {/* Mostrar carregant mentre es consulten les dades del servidor */}
        {isLoadingRooms ? (
          <div className="flex justify-center p-10 text-zinc-400">
            <p>Carregant dades des del servidor...</p>
          </div>
        ) : (
          /* Llistat de sales: els empleats no veuen els botons d'esborrar */
          <RoomList
            rooms={rooms}
            isAdmin={false} // isAdmin a false: els empleats veuen només catàleg sense opcions d'administració
          />
        )}
      </div>
    </div>
  );
};

export default EmployeePage;
