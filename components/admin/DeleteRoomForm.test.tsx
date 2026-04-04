import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeleteRoomForm from './DeleteRoomForm';
import { useAuth } from '@/app/hooks/useAuth';
import { useLoadingState } from '@/app/hooks/useLoadingState';
import { deleteRoom } from '@/app/services/rooms';

// Mocks
jest.mock('@/app/hooks/useAuth');
jest.mock('@/app/hooks/useLoadingState');
jest.mock('@/app/services/rooms');

describe('Component DeleteRoomForm', () => {
    const mockSetError = jest.fn();
    const mockStartLoading = jest.fn();
    const mockStopLoading = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        // Simulem el token d'autenticació
        (useAuth as jest.Mock).mockReturnValue({ token: 'fake-token-admin' });

        // Estat per defecte del loading
        (useLoadingState as jest.Mock).mockReturnValue({
            isLoading: false,
            showSuccess: false,
            error: '',
            setError: mockSetError,
            startLoading: mockStartLoading,
            stopLoading: mockStopLoading,
        });
    });

    it('ha de mostrar un error si s\'intenta enviar amb el camp buit', () => {
        render(<DeleteRoomForm />);

        const botoSubmit = screen.getByRole('button', { name: /Eliminar Sala/i });
        fireEvent.click(botoSubmit);

        // Ha de llançar l'error al hook i no cridar al servei
        expect(mockSetError).toHaveBeenCalledWith('El nom de la sala és obligatori');
        expect(deleteRoom).not.toHaveBeenCalled();
    });

    it('ha de cridar la funció deleteRoom correctament i netejar el camp si tot va bé', async () => {
        // Simulem que la promesa es resol bé
        (deleteRoom as jest.Mock).mockResolvedValue({});

        render(<DeleteRoomForm />);

        const input = screen.getByPlaceholderText(/Nom de la Sala p.e: Sala X/i);
        const botoSubmit = screen.getByRole('button', { name: /Eliminar Sala/i });

        // Escrivim i fem submit
        fireEvent.change(input, { target: { value: 'Sala Principal' } });
        fireEvent.click(botoSubmit);

        // Comprovem l'inici de càrrega (això és síncron, passa a l'instant)
        expect(mockStartLoading).toHaveBeenCalled();

        // Posem totes les comprovacions posteriors dins del waitFor
        await waitFor(() => {
            // Verifiquem que crida al servei amb el nom i el token
            expect(deleteRoom).toHaveBeenCalledWith('Sala Principal', 'fake-token-admin');
            // Verifiquem l'aturada de càrrega i èxit
            expect(mockStopLoading).toHaveBeenCalledWith(true);
            // El camp s'hauria d'haver buidat
            expect(input).toHaveValue('');
        });
    });

    it('ha de capturar errors de deleteRoom i mostrar-los', async () => {
        // Simulem que el servei llança un error
        (deleteRoom as jest.Mock).mockRejectedValue(new Error('No es pot eliminar una sala amb reserves'));

        render(<DeleteRoomForm />);

        const input = screen.getByPlaceholderText(/Nom de la Sala p.e: Sala X/i);
        fireEvent.change(input, { target: { value: 'Sala Ocupada' } });
        fireEvent.click(screen.getByRole('button', { name: /Eliminar Sala/i }));

        await waitFor(() => {
            // Verifiquem que l'error s'ha passat al hook
            expect(mockSetError).toHaveBeenCalledWith('No es pot eliminar una sala amb reserves');
            // Verifiquem que s'atura el loading sense èxit (false)
            expect(mockStopLoading).toHaveBeenCalledWith(false);
        });
    });

    it('ha de mostrar els estats de UI (carregant, èxit, error) segons el hook', () => {
        // Forcem que el hook retorni els diferents estats
        (useLoadingState as jest.Mock).mockReturnValue({
            isLoading: true,
            showSuccess: true,
            error: 'Error simulat d\'interfície',
            setError: mockSetError,
            startLoading: mockStartLoading,
            stopLoading: mockStopLoading,
        });

        render(<DeleteRoomForm />);

        expect(screen.getByText('Eliminant sala...')).toBeInTheDocument();
        expect(screen.getByText('✓ Sala eliminada!')).toBeInTheDocument();
        expect(screen.getByText('Error simulat d\'interfície')).toBeInTheDocument();

        // També comprovem que l'input i el botó estiguin deshabilitats
        expect(screen.getByPlaceholderText(/Nom de la Sala p.e: Sala X/i)).toBeDisabled();
        expect(screen.getByRole('button', { name: /Eliminar Sala/i })).toBeDisabled();
    });
});