// URL base de l'API obtinguda de les variables d'entorn
const API_URL = process.env.NEXT_PUBLIC_API_URL;

type User = {
  id: number;
  name: string;
  email: string;
  password: string;
};

export type OnlineUsersResponse = {
  count: number;
  updatedAt?: string;
};

export const getUsers = async (token: string | null) => {
  // Validar que existeix un token, sinó llançar un error
  if (!token) throw new Error('Token no disponible');

  // Realitzar petició GET a l'API per obtenir els usuaris amb autenticació
  const res = await fetch(`${API_URL}/users`, {
    method: 'GET',
    cache: 'no-store', // No utilitzar cache per sempre obtenir dades actualitzades
    headers: { Authorization: `Bearer ${token}` }, // Incloure token al encapçalament
  });

  // Verificar que la resposta és correcta
  if (!res.ok) {
    throw new Error(`Error: ${res.status} ${res.statusText}`);
  }

  // Processar la resposta JSON i ordenar els usuaris per ID creixent
  const users: User[] = await res.json();
  return users.sort((a, b) => a.id - b.id);
};

// Funció per a crear un nou usuari
export const addUser = async (
  name: string,
  email: string,
  password: string,
  token: string | null,
) => {
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, email, password }),
  });

  // Verificar que la resposta és correcta
  if (!res.ok) {
    throw new Error(`Error: ${res.status} ${res.statusText}`);
  }

  // Retornar les dades de l'usuari creat
  return res.json();
};

// Funció per eliminar un usuari existent
// Paràmetres: name (usuari a eliminar), token (autenticació)
// Retorna: resposta del servidor confirmant l'eliminació
export const deleteUser = async (
  id: number,
  name: string,
  token: string | null,
) => {
  // Validar que existeix un token
  if (!token) throw new Error('Token no disponible');

  // Realitzar petició DELETE a l'API per eliminar l'usuari
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`, // Incloure token al encapçalament
    },
  });

  // Verificar que la resposta és correcta
  if (!res.ok) {
    throw new Error(`Error: ${res.status} ${res.statusText}`);
  }
};

export const getOnlineUsers = async (
  token: string | null,
): Promise<OnlineUsersResponse> => {
  if (!token) throw new Error('Token no disponible');

  const res = await fetch(`${API_URL}/users/online`, {
    method: 'GET',
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    console.error('❌ getOnlineUsers API Error:', {
      status: res.status,
      statusText: res.statusText,
      timestamp: new Date().toISOString(),
    });
    throw new Error(`Error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  console.debug('🟢 getOnlineUsers Success:', {
    count: data.count,
    updatedAt: data.updatedAt,
    fullResponse: data,
    timestamp: new Date().toISOString(),
  });
  return data;
};

// Funció per obtenir l'ID d'un usuari a partir del seu nom
export const getUserId = async (
  name: string,
  token: string | null,
): Promise<number> => {
  if (!token) throw new Error('Token no disponible');

  const res = await fetch(`${API_URL}/users`, {
    method: 'GET',
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Error: ${res.status} ${res.statusText}`);
  }

  const users: User[] = await res.json();
  const userId = users.find((user) => user.name === name)?.id;
  return userId || 0;
};
