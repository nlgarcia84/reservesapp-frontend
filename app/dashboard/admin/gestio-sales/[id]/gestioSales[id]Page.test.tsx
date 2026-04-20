process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://fake-url.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'fake-key';

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditRoomPage from './page';
import { getRoomById, getRooms, updateRoom } from '@/app/services/rooms';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';

// Mocks de les llibreries de Next.js i Auth
jest.mock('next/navigation', () => ({
    useParams: jest.fn(),
    useRouter: jest.fn(),
}));

jest.mock('@/app/hooks/useAuth', () => ({
    useAuth: jest.fn(),
}));

// Mock del servei de rooms
jest.mock('@/app/services/rooms', () => ({
    getRoomById: jest.fn(),
    getRooms: jest.fn(),
    updateRoom: jest.fn(),
}));

const mockRoom = {
    id: 123,
    name: 'Sala Alpha',
    capacity: 15,
    description: 'Descripció original',
    equipment: ['projector', 'tv'],
    imageUrl: null,
    hasProjector: true,
    hasTv: true,
    hasWhiteboard: false,
    hasAirConditioning: false
};

describe('EditRoomPage Component', () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useParams as jest.Mock).mockReturnValue({ id: '123' });
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (useAuth as jest.Mock).mockReturnValue({ token: 'fake-token' });

        (getRoomById as jest.Mock).mockResolvedValue(mockRoom);
        (getRooms as jest.Mock).mockResolvedValue([mockRoom]);
    });

    it('ha de carregar i mostrar les dades de la sala correctament', async () => {
        render(<EditRoomPage />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Sala Alpha')).toBeInTheDocument();
            expect(screen.getByDisplayValue('15')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Descripció original')).toBeInTheDocument();
        });

        expect(screen.getByLabelText(/Projector \+ pantalla/i)).toBeChecked();
        expect(screen.getByLabelText(/Televisor 55" 4K/i)).toBeChecked();
    });

    it('ha de validar que el nom no sigui buit en desar', async () => {
        render(<EditRoomPage />);

        await waitFor(() => screen.getByDisplayValue('Sala Alpha'));

        // CANVI: Busquem pel placeholder en lloc de la label per evitar l'error de vinculació
        const inputNom = screen.getByPlaceholderText(/Ex: Sala de reunions A/i);
        fireEvent.change(inputNom, { target: { value: '   ' } });

        const botoDesar = screen.getByRole('button', { name: /desar canvis/i });
        fireEvent.click(botoDesar);

        expect(await screen.findByText(/El nom de la sala és obligatori/i)).toBeInTheDocument();
        expect(updateRoom).not.toHaveBeenCalled();
    });

    it('ha de detectar noms duplicats d\'altres sales', async () => {
        (getRooms as jest.Mock).mockResolvedValue([
            { id: 123, name: 'Sala Alpha' },
            { id: 456, name: 'Sala Gamma' }
        ]);

        render(<EditRoomPage />);
        await waitFor(() => screen.getByDisplayValue('Sala Alpha'));

        // CANVI: Busquem pel placeholder
        const inputNom = screen.getByPlaceholderText(/Ex: Sala de reunions A/i);
        fireEvent.change(inputNom, { target: { value: 'Sala Gamma' } });

        fireEvent.click(screen.getByRole('button', { name: /desar canvis/i }));

        expect(await screen.findByText(/Ja existeix una sala amb el nom "Sala Gamma"/i)).toBeInTheDocument();
    });

    it('ha de cridar updateRoom i redirigir si tot és correcte', async () => {
        (updateRoom as jest.Mock).mockResolvedValue({ success: true });

        render(<EditRoomPage />);
        await waitFor(() => screen.getByDisplayValue('Sala Alpha'));

        // CANVI: Busquem pel placeholder
        const inputCapacitat = screen.getByPlaceholderText(/Capacitat/i);
        fireEvent.change(inputCapacitat, { target: { value: '20' } });

        const botoDesar = screen.getByRole('button', { name: /desar canvis/i });
        fireEvent.click(botoDesar);

        await waitFor(() => {
            expect(updateRoom).toHaveBeenCalled();
            expect(mockPush).toHaveBeenCalledWith('/dashboard/admin/gestio-sales');
        });
    });
});