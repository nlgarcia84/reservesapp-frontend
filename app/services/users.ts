// URL base de l'API obtinguda de les variables d'entorn
const API_URL = process.env.NEXT_PUBLIC_API_URL;

type User = {
  id: number;
  name: string;
  email: string;
  password: string;
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

  // Processar la resposta JSON i ordenar les sales per nom
  const users: User[] = await res.json();
  return users.sort((a, b) => a.name.localeCompare(b.name));
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

  // Retornar les dades de la sala creada
  return res.json();
};

// Funció per eliminar un usuari existent
// Paràmetres: name (usuari a eliminar), token (autenticació)
// Retorna: resposta del servidor confirmant l'eliminació
export const deleteRoom = async (id: number, token: string | null) => {
  // Validar que existeix un token
  if (!token) throw new Error('Token no disponible');

  // Realitzar petició DELETE a l'API per eliminar la sala
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
