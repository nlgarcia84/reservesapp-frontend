process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://fake-url.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'fake-key';

import { render, screen, fireEvent } from '@testing-library/react';
import { RoomCard } from './RoomCard';
import { Room } from '@/app/services/rooms';

// Fem mock del servei per evitar crides reals o càrregues innecessàries
jest.mock('@/app/services/rooms', () => ({
    deleteRoom: jest.fn(),
}));

const mockRoom: Room = {
    id: 1,
    name: 'Sala de Test',
    capacity: 8,
    description: 'Una descripció de prova',
    equipment: ['projector', 'tv'],
    imageUrl: 'http://example.com/image.jpg',
    hasProjector: true,
    hasWhiteboard: false,
    hasTv: true,
    hasAirConditioning: false
};

describe('Component RoomCard', () => {
    const mockOnClick = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('ha de renderitzar la informació bàsica de la sala', () => {
        render(
            <RoomCard
                room={mockRoom}
                isAdmin={false}
                isSelected={false}
                onClick={mockOnClick}
            />
        );

        expect(screen.getByText('Sala de Test')).toBeInTheDocument();
        expect(screen.getByText(/8 persones/i)).toBeInTheDocument();
    });

    it('ha de cridar onClick quan es clica la card', () => {
        render(
            <RoomCard
                room={mockRoom}
                isAdmin={false}
                isSelected={false}
                onClick={mockOnClick}
            />
        );

        const card = screen.getByText('Sala de Test').closest('div');
        if (card) fireEvent.click(card);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('ha de mostrar el missatge "Sense imatge" si imageUrl és null', () => {
        const roomWithoutImage = { ...mockRoom, imageUrl: null };

        render(
            <RoomCard
                room={roomWithoutImage}
                isAdmin={false}
                isSelected={false}
                onClick={mockOnClick}
            />
        );

        expect(screen.getByText(/sense imatge/i)).toBeInTheDocument();
    });
});