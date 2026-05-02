const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Dades de lectura del backend
export interface Reservation {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  userId: number | string;

  // Relaciones y datos adicionales
  room?: {
    id: number;
    name?: string;
  };
  roomId?: number;
  room_id?: number;

  // AÑADE ESTA LÍNEA:
  guests?: number[] | string[];
}

// Dades per enviar al backend
export interface ReservationRequest {
  room_id: number;
  user_id: number;
  date: string;
  start_time: string;
  end_time: string;
  guests: number[];
}

// Funció per portar totes les reserves
export const getAllReservations = async (
  token: string,
): Promise<Reservation[]> => {
  const res = await fetch(`${API_URL}/reservations`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });

  if (!res.ok) throw new Error('No s’han pogut carregar les teves reserves');
  return res.json();
};

// Funció per crear una nova reserva
export const createReservation = async (
  data: ReservationRequest,
  token: string,
): Promise<void> => {
  const res = await fetch(`${API_URL}/reservations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Error al realitzar la reserva');
  }
};

// Funció per obtenir les reserves de l'usuari actual
export const getMyReservations = async (
  token: string,
): Promise<Reservation[]> => {
  const res = await fetch(`${API_URL}/reservations/my-bookings`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-store',
    },
  });

  if (!res.ok) throw new Error('No s’han pogut carregar les teves reserves');
  return res.json();
};

// Funció per actualitzar una reserva
export const updateReservation = async (
  id: number,
  data: Partial<ReservationRequest>,
  token: string,
): Promise<void> => {
  const res = await fetch(`${API_URL}/reservations/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Error en actualitzar la reserva');
};

// Funció per eliminar una reserva
export const deleteReservation = async (
  id: number,
  token: string,
): Promise<void> => {
  const res = await fetch(`${API_URL}/reservations/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Error en cancel·lar la reserva');
  }
};

export const getReservationsByRoom = async (roomId: number, token: string) => {
  const response = await fetch(
    `http://localhost:8080/reservations/room/${roomId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    throw new Error('Error en recuperar les reserves de la sala');
  }

  return response.json();
};
