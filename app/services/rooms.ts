import { createClient } from '@supabase/supabase-js';

// Configurar cliente de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type Room = {
  id: number;
  name: string;
  capacity: number;
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
export const getRooms = async (token: string | null) => {
  if (!token) throw new Error('Token no disponible');

  try {
    const res = await fetch(`${API_URL}/rooms`, {
      method: 'GET',
      cache: 'no-store',
      headers: { Authorization: `Bearer ${token}` },
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
  id: number,
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

// Funció per crear una nova sala
// Paràmetres: name (nom), capacity (capacitat), equipment (equipaments), description (descripció), token (autenticació), imageFile (imatge opcional)
// Retorna: resposta del servidor amb les dades de la sala creada
export const addNewRoom = async (
  name: string,
  capacity: number,
  equipment: ('projector' | 'whiteboard' | 'tv' | 'ac')[],
  description: string,
  token: string | null,
  imageFile?: File,
) => {
  // Validar que existeix un token
  if (!token) throw new Error('Token no disponible');

  let imageUrl: string | null = null;

  // Si hi ha imatge, pujar-la a Supabase
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

  // Enviar dades al backend com a JSON
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
      imageUrl, // URL de la imatge a Supabase
    }),
  });

  // Verificar que la resposta és correcta
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

  // Retornar les dades de la sala creada
  return res.json();
};

// Funció per eliminar una sala existent
export const deleteRoom = async (id: number, token: string | null) => {
  if (!token) throw new Error('Token no disponible');

  const res = await fetch(`${API_URL}/rooms/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
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

  return res.json();
};
