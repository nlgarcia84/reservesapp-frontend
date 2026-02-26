'use client';

import { useState } from 'react';
import { setRooms } from '@/app/services/rooms';
import { LoaderCircle } from 'lucide-react';

const GestioSales = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [error, setError] = useState('');

  const toggleLoading = () => {
    setShowSuccess(false);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    toggleLoading();
    try {
      setRooms(name.trim(), parseInt(capacity, 10)); // { token, role }
    } catch (err: unknown) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <>
      <div className="p-5">
        <h1 className="text-3xl mb-10 border-2 border-emerald-800 rounded-2xl p-7 text-center">
          Panell administrador de gestió de sales
        </h1>
        <div className="text-center mb-2">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col  ml-auto mr-auto"
          >
            <label className="text-xl mb-5" htmlFor="">
              Nom de la sala:{' '}
            </label>
            <input
              type="text"
              placeholder="Nova Sala"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white mb-10 px-2 py-2 rounded-3xl text-stone-900 text-center"
            />

            <label className="text-xl mb-5" htmlFor="">
              Capacitat:{' '}
            </label>
            <input
              type="text"
              placeholder="Capacitat"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="bg-white mb-10 px-2 py-2 rounded-3xl text-stone-900 text-center"
            />
            <div className="w-full md:w-4/5 lg:w-2/3 mx-auto">
              {isLoading ? (
                <div className="text-center">
                  <span className="block text-2xl mb-9">
                    Actualitzant dades ...
                  </span>
                  <LoaderCircle
                    className="mx-auto h-10 w-10 animate-spin text-emerald-400 motion-reduce:animate-none"
                    aria-label="Carregant"
                  />
                </div>
              ) : (
                <>
                  <button
                    type="submit"
                    className="block w-full sm:w-3/4 md:w-full lg:w-full mx-auto text-slate-950 text-lg p-3 border rounded bg-emerald-400 font-mono hover:bg-emerald-300"
                  >
                    Afegir Sala
                  </button>
                  {showSuccess && (
                    <span className="block text-2xl mt-4 text-center text-emerald-300">
                      Sala afegida!
                    </span>
                  )}
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default GestioSales;
