import { createClient } from '@supabase/supabase-js';

// Configurar client de Supabase
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
  equipment: ('projector' | 'whiteboard' | 'tv' | 'ac')[];
  description: string;
  imageUrl?: string | null;
  // Nous camps booleans per a la base de dades
  has_projector?: boolean;
  has_whiteboard?: boolean;
  has_tv?: boolean;
  has_air_conditioning?: boolean;
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
  const { error } = await supabase.storage
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

    // Reconstruïm l'array 'equipment' per a cada sala perquè el frontend el pugui llegir
    const mappedRooms = rooms.map((room) => ({
      ...room,
      equipment: [
        ...(room.has_projector ? ['projector' as const] : []),
        ...(room.has_whiteboard ? ['whiteboard' as const] : []),
        ...(room.has_tv ? ['tv' as const] : []),
        ...(room.has_air_conditioning ? ['ac' as const] : []),
      ],
    }));

    return mappedRooms.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Excepció en getRooms:', error);
    throw error;
  }
};

// Funció per obtenir els detalls d'una sala específica
export const getRoomById = async (
  id: string | number, // id: identificador únic de la sala (pot ser string o number)
  token: string | null, // token: token JWT d'autenticació de l'usuari
): Promise<Room> => {
  // Comprovem que el token existeix, si no, llancem un error
  if (!token) throw new Error('Token no disponible');

  try {
    // Fem una petició GET a l'API per obtenir la sala amb l'id indicat
    const res = await fetch(`${API_URL}/rooms/${id}`, {
      method: 'GET', // Mètode HTTP GET per obtenir dades
      cache: 'no-store', // No utilitzar cache, sempre obtenir dades fresques del servidor
      headers: { Authorization: `Bearer ${token}` }, // Afegim el token JWT a l'encapçalament per autorització
    });

    // Si la resposta no és correcta (ex: sala no trobada o error del servidor)
    if (!res.ok) {
      // Intentem obtenir el missatge d'error del servidor (si és JSON)
      const errorData = await res.json().catch(() => ({}));
      // Llancem un error amb el missatge del servidor o amb el codi d'estat HTTP
      throw new Error(
        errorData.message || `Error: ${res.status} ${res.statusText}`,
      );
    }

    // Parsejem la resposta JSON a un objecte Room
    const room: Room = await res.json();

    // Reconstruïm l'array 'equipment' a partir dels camps booleans per facilitar el tractament al frontend
    return {
      ...room,
      equipment: [
        ...(room.has_projector ? ['projector' as const] : []),
        ...(room.has_whiteboard ? ['whiteboard' as const] : []),
        ...(room.has_tv ? ['tv' as const] : []),
        ...(room.has_air_conditioning ? ['ac' as const] : []),
      ],
    };
  } catch (error) {
    // Si hi ha qualsevol error (de xarxa, parsing, etc.), el mostrem per consola per debugging
    console.error(`Excepció en getRoomById (ID: ${id}):`, error);
    // Relancem l'error perquè el component que crida la funció el pugui gestionar
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
  existingImageUrl?: string,
) => {
  if (!token) throw new Error('Token no disponible');

  let finalImageUrl: string | undefined = existingImageUrl;

  // 1. Si l'usuari ha seleccionat una fotografia nova, la pugem a Supabase
  if (imageFile) {
    try {
      finalImageUrl = await uploadImageToSupabase(imageFile);
    } catch (error) {
      console.error('Error pujant la nova imatge:', error);
      throw new Error('Error en pujar la imatge a Supabase.');
    }
  }

  // 2. Preparem el cos de la petició amb les dades actualitzades, incloent la nova URL de la imatge si s'ha pujat una nova
  // Traduim l'array d'strings als booleans de la BD
  const requestBody = {
    name,
    capacity,
    description,
    imageUrl: finalImageUrl,
    has_projector: equipment.includes('projector'),
    has_whiteboard: equipment.includes('whiteboard'),
    has_tv: equipment.includes('tv'),
    has_air_conditioning: equipment.includes('ac'),
  };

  // 3. Enviem la petició PUT com a JSON
  const res = await fetch(`${API_URL}/rooms/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error('Error del Backend a updateRoom:', errorData);
    throw new Error(
      errorData.message || errorData.error || 'Error actualitzant la sala',
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

  // Traduim l'array d'strings als booleans de la BD
  const bodyData = {
    name,
    capacity,
    description,
    imageUrl: imageUrl, // o imageUrl en el cas de addNewRoom
    // Format snake_case (el de la teva captura de Supabase)
    has_projector: equipment.includes('projector'),
    has_whiteboard: equipment.includes('whiteboard'),
    has_tv: equipment.includes('tv'),
    has_air_conditioning: equipment.includes('ac'),
    // Format camelCase (el que sol esperar Java per defecte)
    hasProjector: equipment.includes('projector'),
    hasWhiteboard: equipment.includes('whiteboard'),
    hasTv: equipment.includes('tv'),
    hasAirConditioning: equipment.includes('ac'),
  };

  const res = await fetch(`${API_URL}/rooms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bodyData),
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
