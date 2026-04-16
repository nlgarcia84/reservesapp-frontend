// URL base de l'API obtinguda de les variables d'entorn
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Tipus de dada que representa una sala amb el seu identificador, nom, capacitat, equipament i descripció
type Room = { 
  id: number; 
  name: string; 
  capacity: number;
  equipment: string;
  description: string;
};

// Funció per obtenir totes les sales disponibles
// Paràmetres: token d'autenticació de l'usuari
// Retorna: llista de sales ordenades alfabèticament per nom
export const getRooms = async (token: string | null) => {
  // Validar que existeix un token, sinó llançar un error
  if (!token) throw new Error('Token no disponible');

  try {
    // Realitzar petició GET a l'API per obtenir les sales amb autenticació
    const res = await fetch(`${API_URL}/rooms`, {
      method: 'GET',
      cache: 'no-store', // No utilitzar cache per sempre obtenir dades actualitzades
      headers: { Authorization: `Bearer ${token}` }, // Incloure token al encapçalament
    });

    // Verificar que la resposta és correcta
    if (!res.ok) {
      // Intentar obtenir el missatge d'error del servidor
      const errorData = await res.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        errorData.error ||
        `Error: ${res.status} ${res.statusText}`;

      console.error('Error getRooms:', {
        status: res.status,
        statusText: res.statusText,
        serverMessage: errorMessage,
        fullResponse: errorData,
        apiUrl: API_URL,
        token: token ? `${token.substring(0, 20)}...` : 'null',
      });

      throw new Error(errorMessage);
    }

    // Processar la resposta JSON i ordenar les sales per nom
    const rooms: Room[] = await res.json();
    return rooms.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Exception en getRooms:', error);
    throw error;
  }
};

// Funció per obtenir els detalls d'una sala específica
// Paràmetres: id (identificador de la sala), token d'autenticació
// Retorna: les dades detallades de la sala (US2)
export const getRoomById = async (id: number, token: string | null): Promise<Room> => {
  // Validar que existeix un token
  if (!token) throw new Error('Token no disponible');

  try {
    // Realitzar petició GET a l'API per obtenir una sala concreta
    const res = await fetch(`${API_URL}/rooms/${id}`, {
      method: 'GET',
      cache: 'no-store',
      headers: { Authorization: `Bearer ${token}` },
    });

    // Verificar que la resposta és correcta (ex: 404 si la sala no existeix)
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Error: ${res.status} ${res.statusText}`);
    }

    // Retornar les dades de la sala
    return await res.json();
  } catch (error) {
    console.error(`Exception en getRoomById (ID: ${id}):`, error);
    throw error;
  }
};

// Funció per crear una nova sala
// Paràmetres: name (nom de la sala), capacity (capacitat màxima), equipment (equipament), description (descripció), token (autenticació)
// Retorna: resposta del servidor amb les dades de la sala creada
export const addNewRoom = async (
  name: string,
  capacity: number,
  equipment: string,
  description: string,
  token: string | null,
) => {
  // Validar que existeix un token
  if (!token) throw new Error('Token no disponible');

  // Realitzar petició POST a l'API per crear una nova sala
  const res = await fetch(`${API_URL}/rooms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // Especificar que el cos és JSON
      Authorization: `Bearer ${token}`, // Incloure token al encapçalament
    },
    body: JSON.stringify({ name, capacity, equipment, description }), // Enviar totes les dades al backend
  });

  // Verificar que la resposta és correcta
  if (!res.ok) {
    // Afegim captura d'error del backend per si de cas
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Error: ${res.status} ${res.statusText}`);
  }

  // Retornar les dades de la sala creada
  return res.json();
};

// Funció per eliminar una sala existent
// Paràmetres: id (id de la sala a eliminar), token (autenticació)
// Retorna: resposta del servidor confirmant l'eliminació
export const deleteRoom = async (id: number, token: string | null) => {
  // Validar que existeix un token
  if (!token) throw new Error('Token no disponible');

  // Realitzar petició DELETE a l'API per eliminar la sala
  const res = await fetch(`${API_URL}/rooms/${id}`, {
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