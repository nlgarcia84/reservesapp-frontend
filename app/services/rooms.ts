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
<<<<<<< Updated upstream
// Paràmetres: token d'autenticació de l'usuari
// Retorna: llista de sales ordenades alfabèticament per nom
export const getRooms = async (token: string | null): Promise<Room[]> => {
  // Validar que existeix un token, sinó llançar un error
=======
// Paràmetres: token (string | null) - token d'autenticació de l'usuari
// Retorna: Promise<Room[]> - llista de sales ordenades alfabèticament per nom
export const getRooms = async (token: string | null) => {
  // Validar que existeix un token, si no existeix llançar un error
>>>>>>> Stashed changes
  if (!token) throw new Error('Token no disponible');

  // Envoltall la lògica amb try-catch per capturar excepcions
  try {
    // Realitzar una petició HTTP GET a l'endpoint /rooms de l'API
    const res = await fetch(`${API_URL}/rooms`, {
<<<<<<< Updated upstream
      method: 'GET',
      cache: 'no-store', // No utilitzar cache per sempre obtenir dades actualitzades
      headers: { Authorization: `Bearer ${token}` }, // Incloure token a l'encapçalament
=======
      method: 'GET', // Mètode HTTP GET per obtenir dades
      cache: 'no-store', // No utilitzar cache, sempre obtenir dades fresques del servidor
      headers: { Authorization: `Bearer ${token}` }, // Afegir token d'autenticació al encapçalament
>>>>>>> Stashed changes
    });

    // Verificar si la resposta HTTP no és exitosa (status 4xx o 5xx)
    if (!res.ok) {
      // Intentar obtenir el cos de la resposta com a JSON, si falla retornar object buit
      const errorData = await res.json().catch(() => ({}));

      // Construir missatge d'error prioritzant: missatge del servidor → error del servidor → status HTTP
      const errorMessage =
        errorData.message ||
        errorData.error ||
        `Error: ${res.status} ${res.statusText}`;

      // Registrar l'error en la consola amb informació detallada
      console.error('Error getRooms:', {
<<<<<<< Updated upstream
        status: res.status,
        statusText: res.statusText,
        serverMessage: errorMessage,
        apiUrl: API_URL,
=======
        status: res.status, // Codi d'estat HTTP (ex: 404, 500)
        statusText: res.statusText, // Descripció de l'estat (ex: "Not Found", "Internal Server Error")
        serverMessage: errorMessage, // Missatge d'error obtingut del servidor
>>>>>>> Stashed changes
      });

      // Llançar una excepció amb el missatge d'error
      throw new Error(errorMessage);
    }

    // Convertir la resposta JSON a un array de tipus Room
    const rooms: Room[] = await res.json();

    // Retornar les sales ordenades alfabèticament comparant els noms
    // localeCompare() compara strings seguint les regles de localització (ex: acentos)
    return rooms.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    // Capturar qualsevol excepció (errors de xarxa, parsing JSON, validació, etc.)

    // Registrar l'error en la consola per a debugging
    console.error('Excepció en getRooms:', error);

    // Relançar l'error perquè el codi que crida aquesta funció la pugui gestionar
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