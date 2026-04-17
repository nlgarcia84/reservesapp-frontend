'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';
import { getRooms } from '@/app/services/rooms';
import { RoomList } from '@/components/ui/RoomList';

const GestioSales = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  const fetchRooms = useCallback(async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const data = await getRooms(token);
      setRooms(data);
    } catch (error) {
      console.error('Error carregant les sales:', error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return (
    <div className="p-5 pt-8 sm:pt-12 max-w-7xl mx-auto">
      <h1 className="mb-10 rounded-2xl border border-white/10 bg-zinc-950/70 p-7 text-center text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
        Panell administrador de sales
      </h1>

      {/* Ara només deixem el botó d'afegir, l'esborrat es fa des de cada sala */}
      <div className="mb-12 flex justify-center">
        <Link href="/dashboard/admin/gestio-sales/afegir-sala">
          <Button className="px-10">Afegir nova sala</Button>
        </Link>
      </div>

      <div>
        <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
          <h2 className="text-xl font-semibold text-zinc-200">Sales registrades</h2>
          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400">
            {rooms.length} totals
          </span>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-20 text-zinc-400">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
              <p>Carregant sales...</p>
            </div>
          </div>
        ) : (
          <RoomList 
            rooms={rooms} 
            isAdmin={true} 
            onRefresh={fetchRooms} 
          />
        )}
      </div>
    </div>
  );
};

export default GestioSales;