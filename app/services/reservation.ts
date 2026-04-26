const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ReservationData {
    room_id: string;
    user_id: string;
    date: string;
    startTime: string;
    endTime: string;
    guests: string[];
}

export const createReservation = async (data: ReservationData, token: string) => {
    const response = await fetch(`${API_URL}/reservations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la reserva');
    }

    return response.json();
};