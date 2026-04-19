import { createClient } from '@supabase/supabase-js';

// Configurar cliente de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Tipus de dada que representa una sala amb el seu identificador, nom, capacitat, equipament, descripció i imatge.
// S'exporta perquè es pugui utilitzar a qualsevol component o pàgina de l'aplicació.
export type Room = {
  id: number;
  name: string;
  capacity: number;
  // Equipament definit com a array d'opcions tancades segons el component InputSelectForm del Norman
  equipment: ('projector' | 'whiteboard' | 'tv' | 'ac')[];
  description: string;
  imageUrl?: string | null;
};

// Funció per pujar una imatge a Supabase Storage
// Paràmetres: file (fitxer a pujar)
// Retorna: URL pública de la imatge
const uploadImageToSupabase = async (file: File): Promise<string> => {
  // Generar un nom únic per al fitxer
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(7);
  const fileName = `room-${timestamp}-${randomString}-${file.name}`;

  // Pujar fitxer al bucket 'room-images' de Supabase
  const { data, error } = await supabase.storage
    .from('room-images')
    .upload(fileName, file);

  // Verificar si hi ha error en la pujada
  if (error) {
    console.error('Error pujant imatge a Supabase:', error);
    throw new Error(`Error pujant imatge: ${error.message}`);
  }

  // Obtenir URL pública del fitxer pujat
  const { data: publicData } = supabase.storage
    .from('room-images')
    .getPublicUrl(fileName);

  return publicData.publicUrl;
};

// Funció per obtenir totes les sales disponibles
// Paràmetres: token d'autenticació de l'usuari
// Retorna: llista de sales ordenades alfabèticament per nom
export const getRooms = async (token: string | null): Promise<Room[]> => {
  // Validar que existeix un token, sinó llançar un error
  if (!token) throw new Error('Token no disponible');

  try {
    const res = await fetch(`${API_URL}/rooms`, {
      method: 'GET',
      cache: 'no-store', // No utilitzar cache per sempre obtenir dades actualitzades
      headers: { Authorization: `Bearer ${token}` }, // Incloure token a l'encapçalament
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        errorData.error ||
        `Error: ${res.status} ${res.statusText}`;

      console.error('Error getRooms:', {
        status: res.status,
        statusText: res.statusText,
        serverMessage: errorMessage,
        apiUrl: API_URL,
      });

      throw new Error(errorMessage);
    }

    const rooms: Room[] = await res.json();
    return rooms.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Excepció en getRooms:', error);
    throw error;
  }
};

// Funció per obtenir els detalls d'una sala específica
export const getRoomById = async (
  id: string | number,
  token: string | null,
): Promise<Room> => {
  if (!token) throw new Error('Token no disponible');

  try {
    const res = await fetch(`${API_URL}/rooms/${id}`, {
      method: 'GET',
      cache: 'no-store',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error: ${res.status} ${res.statusText}`,
      );
    }

    return await res.json();
  } catch (error) {
    console.error(`Excepció en getRoomById (ID: ${id}):`, error);
    throw error;
  }
};

// Funció per actualitzar/modificar una sala existent
export const updateRoom = async (
  id: string,
  name: string,
  capacity: number,
  equipment: string[],
  description: string,
  token: string | null,
  imageFile?: File,
) => {
  if (!token) throw new Error('Token no disponible');

  // De moment deixem el teu codi amb FormData per no trencar-ho, 
  // però l'haurem d'actualitzar perquè utilitzi Supabase com l'addNewRoom.
  const formData = new FormData();
  formData.append('name', name);
  formData.append('capacity', capacity.toString());
  formData.append('equipment', JSON.stringify(equipment));
  formData.append('description', description);
  if (imageFile) {
    formData.append('image', imageFile);
  }

  const res = await fetch(`${API_URL}/rooms/${id}`, {
    method: 'PUT', 
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error('Error del Backend a updateRoom:', errorData);
    
    throw new Error(
      errorData.message || errorData.error || 'Error actualitzant la sala'
    );
  }

  return res.json();
};

// Funció per crear una nova sala
export const addNewRoom = async (
  name: string,
  capacity: number,
  equipment: string[],
  description: string,
  token: string | null,
  imageFile?: File,
) => {
  if (!token) throw new Error('Token no disponible');

  let imageUrl: string | null = null;

  if (imageFile) {
    try {
      imageUrl = await uploadImageToSupabase(imageFile);
      console.log('Imatge pujada a Supabase:', imageUrl);
    } catch (error) {
      console.error('Error pujant imatge:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Error pujant imatge',
      );
    }
  }

  const res = await fetch(`${API_URL}/rooms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      capacity,
      equipment,
      description,
      imageUrl, 
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error('Error addNewRoom:', {
      status: res.status,
      statusText: res.statusText,
      serverMessage: errorData,
    });
    throw new Error(
      errorData.message || `Error: ${res.status} ${res.statusText}`,
    );
  }

  return res.json();
};

// Funció per eliminar una sala existent
export const deleteRoom = async (id: number, token: string | null) => {
  if (!token) throw new Error('Token no disponible');

  const res = await fetch(`${API_URL}/rooms/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`, // Incloure token a l'encapçalament
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error('Error deleteRoom:', {
      status: res.status,
      statusText: res.statusText,
      serverMessage: errorData,
    });
    throw new Error(
      errorData.message || `Error: ${res.status} ${res.statusText}`,
    );
  }
};