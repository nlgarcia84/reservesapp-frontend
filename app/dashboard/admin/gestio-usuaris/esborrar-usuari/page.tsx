'use client';

import { useEffect, useState } from 'react';
import DeleteUserForm from '@/components/admin/DeleteUserForm';
import { Card } from '@/components/ui/Card';
import { UsersRound, LoaderCircle } from 'lucide-react';
import { getUsers } from '@/app/services/users';
import { useAuth } from '@/app/hooks/useAuth';

type User = {
  id: number;
  name: string;
  email: string;
  password: string;
};

export default function EsborrarUsuari() {
  // Token d'autenticació de l'usuari
  const { token } = useAuth();
  // Estat dels usuaris carregats
  const [users, setUsers] = useState<User[]>([]);
  // Estat per controlar si s'està carregant la llista
  const [usersLoading, setUsersLoading] = useState(true);

  // Funció per actualitzar la llista d'usuaris (s'usa com callback del formulari)
  const refetchUsers = async () => {
    if (!token) return;
    try {
      const data = await getUsers(token);
      setUsers(data);
    } catch (err) {
      console.error('Error obtenint usuaris:', err);
    }
  };

  // Effect que s'executa en carregar la pàgina per obtenir la llista d'usuaris
  useEffect(() => {
    if (!token) return;

    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        // Obté la llista d'usuaris de l'API
        const data = await getUsers(token);
        setUsers(data);
      } catch (err) {
        console.error('Error obtenint usuaris:', err);
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, [token]); // Es re-executa si el token canvia
  return (
    <>
      <div className="p-5">
        <h1 className="mb-10 rounded-2xl border border-white/10 bg-zinc-950/70 p-7 text-center text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
          Esborrar usuari
        </h1>
        {/* Tarjeta que mostra la llista d'usuaris */}
        <Card title={"Llistat d'usuaris"} icon={UsersRound}>
          {/* Mostra carregador mentre s'obtenen els usuaris */}
          {usersLoading ? (
            <div className="text-center">
              <LoaderCircle className="mx-auto h-6 w-6 animate-spin text-blue-400" />
            </div>
          ) : users.length === 0 ? (
            // Missatge si no hi ha usuaris
            <p className="text-center text-zinc-400">
              No hi ha usuaris disponibles
            </p>
          ) : (
            // Llista d'usuaris carregada
            <ul className="space-y-2">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="p-2 rounded bg-zinc-800/50 flex flex-row justify-between"
                >
                  <span className="font-medium text-zinc-100">{user.id}</span>
                  <span className="font-medium text-zinc-100">{user.name}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
        {/* Formulari per esborrar usuaris amb callback per actualitzar la llista */}
        <div className="text-center mb-2">
          <DeleteUserForm onUserDeleted={refetchUsers} />
        </div>
      </div>
    </>
  );
}
