process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://fake-url.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'fake-key';

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DeleteButton } from './DeleteButton';
import { deleteRoom } from '@/app/services/rooms';
import { deleteUser } from '@/app/services/users';
import { useAuth } from '@/app/hooks/useAuth';

// Mocks dels serveis i el hook d'auth
jest.mock('@/app/services/rooms', () => ({
    deleteRoom: jest.fn(),
}));

jest.mock('@/app/services/users', () => ({
    deleteUser: jest.fn(),
}));

jest.mock('@/app/hooks/useAuth', () => ({
    useAuth: jest.fn(),
}));

describe('Component DeleteButton', () => {
    const mockToken = 'fake-token';
    const mockOnDeleted = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useAuth as jest.Mock).mockReturnValue({ token: mockToken });
        // Fem mock de les funcions globals del navegador
        window.confirm = jest.fn();
        window.alert = jest.fn();
        // Silenciem els console.error per no embrutar la sortida del test
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    it('ha de renderitzar-se amb el títol correcte per a una sala', () => {
        render(<DeleteButton codi={1} name="Sala 101" type="room" />);
        expect(screen.getByTitle('Eliminar sala')).toBeInTheDocument();
    });

    it('ha de demanar confirmació i cridar deleteRoom si el tipus és "room"', async () => {
        (window.confirm as jest.Mock).mockReturnValue(true);
        (deleteRoom as jest.Mock).mockResolvedValue({});

        render(<DeleteButton codi={1} name="Sala 101" type="room" onDeleted={mockOnDeleted} />);

        fireEvent.click(screen.getByRole('button'));

        expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining('la sala "Sala 101"'));

        await waitFor(() => {
            expect(deleteRoom).toHaveBeenCalledWith(1, mockToken);
            expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('eliminada'));
            expect(mockOnDeleted).toHaveBeenCalled();
        });
    });

    it('ha de demanar confirmació i cridar deleteUser si el tipus és "user"', async () => {
        (window.confirm as jest.Mock).mockReturnValue(true);
        (deleteUser as jest.Mock).mockResolvedValue({});

        render(<DeleteButton codi={5} name="Joan" type="user" onDeleted={mockOnDeleted} />);

        fireEvent.click(screen.getByRole('button'));

        expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining('l\'usuari "Joan"'));

        await waitFor(() => {
            expect(deleteUser).toHaveBeenCalledWith(5, "Joan", mockToken);
            expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('eliminat'));
            expect(mockOnDeleted).toHaveBeenCalled();
        });
    });

    it('no ha de fer res si l\'usuari cancel·la la confirmació', async () => {
        (window.confirm as jest.Mock).mockReturnValue(false);

        render(<DeleteButton codi={1} name="Sala Test" type="room" />);

        fireEvent.click(screen.getByRole('button'));

        expect(deleteRoom).not.toHaveBeenCalled();
        expect(mockOnDeleted).not.toHaveBeenCalled();
    });

    it('ha de mostrar un error si la crida al servei falla', async () => {
        (window.confirm as jest.Mock).mockReturnValue(true);
        (deleteRoom as jest.Mock).mockRejectedValue(new Error('API Error'));

        render(<DeleteButton codi={1} name="Sala Test" type="room" />);

        fireEvent.click(screen.getByRole('button'));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('error intentant eliminar'));
        });
    });
});