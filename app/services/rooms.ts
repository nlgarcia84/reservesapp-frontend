const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Room = { id: number; name: string; capacity: number };

export const getRooms = async (token: string | null) => {
  if (!token) throw new Error('Token no disponible');

  // Usar fetchProtected per incloure el token d'autenticació
  const res = await fetch(`${API_URL}/rooms`, {
    method: 'GET',
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Error: ${res.status} ${res.statusText}`);
  }

  const rooms: Room[] = await res.json();
  return rooms.sort((a, b) => a.name.localeCompare(b.name));
};

export const addNewRoom = async (
  name: string,
  capacity: number,
  token: string | null,
) => {
  if (!token) throw new Error('Token no disponible');

  const res = await fetch(`${API_URL}/rooms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, capacity }),
  });

  if (!res.ok) {
    throw new Error(`Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
};

export const deleteRoom = async (name: string, token: string | null) => {
  if (!token) throw new Error('Token no disponible');

  const res = await fetch(`${API_URL}/rooms/${name}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Error: ${res.status} ${res.statusText}`);
  }
};
