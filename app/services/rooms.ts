const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Room = { id: number; name: string; capacity: number };

export const getRooms = async () => {
  const res = await fetch(`${API_URL}/rooms`, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Error en login');
  }

  const rooms: Room[] = await res.json();
  return rooms;
};

export const setRooms = async (name: string, capacity: number) => {
  const res = await fetch(`${API_URL}/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, capacity }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Error en login');
  }

  return res.json();
};
