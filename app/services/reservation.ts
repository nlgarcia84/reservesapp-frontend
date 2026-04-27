const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Interfície per a les dades que rebem del backend (lectura)
export interface Reservation {
    id: number;
    room_id: string;
    user_id: string;
    date: string;
    startTime: string;
    endTime: string;
    room_name?: string;
    is_organizer?: boolean;
    guests?: { id: number; name: string }[];
}

// Interfície per a les dades que enviem (creació i edició)
export interface ReservationRequest {
    room_id: string;
    user_id: string;
    date: string;
    startTime: string;
    endTime: string;
    guests: string[]; // IDs dels convidats com a strings
}

// Crear una nova reserva
export const createReservation = async (data: ReservationRequest, token: string): Promise<void> => {
    const res = await fetch(`${API_URL}/reservations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al realitzar la reserva');
    }
};

// Llegir totes les reserves de l'usuari (les propies i les que m'han convidat)
export const getMyReservations = async (token: string): Promise<Reservation[]> => {
    const res = await fetch(`${API_URL}/reservations/my-bookings`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-store'
        },
    });

    if (!res.ok) {
        throw new Error('No s’han pogut carregar les teves reserves');
    }

    return res.json();
};

// Editar una reserva existent
export const updateReservation = async (
    id: number,
    data: Partial<ReservationRequest>,
    token: string
): Promise<void> => {
    const res = await fetch(`${API_URL}/reservations/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error('Error en actualitzar la reserva');
    }
};

// Eliminar una reserva
export const deleteReservation = async (id: number, token: string): Promise<void> => {
    const res = await fetch(`${API_URL}/reservations/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error en cancel·lar la reserva');
    }
};