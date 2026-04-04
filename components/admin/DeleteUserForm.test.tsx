import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeleteUserForm from './DeleteUserForm';
import { useAuth } from '@/app/hooks/useAuth';
import { useLoadingState } from '@/app/hooks/useLoadingState';

// Mocks dels hooks
jest.mock('@/app/hooks/useAuth');
jest.mock('@/app/hooks/useLoadingState');

// Mock del fetch global
global.fetch = jest.fn();

describe('Component DeleteUserForm', () => {
    const mockOnUserDeleted = jest.fn();
    const mockSetError = jest.fn();
    const mockStartLoading = jest.fn();
    const mockStopLoading = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        // Configuració per defecte del hook useAuth
        (useAuth as jest.Mock).mockReturnValue({ token: 'fake-token-123' });

        // Configuració per defecte del hook useLoadingState
        (useLoadingState as jest.Mock).mockReturnValue({
            isLoading: false,
            showSuccess: false,
            error: '',
            setError: mockSetError,
            startLoading: mockStartLoading,
            stopLoading: mockStopLoading,
        });
    });

    it('ha de mostrar un error si el camp del nom està buit en enviar', async () => {
        render(<DeleteUserForm onUserDeleted={mockOnUserDeleted} />);

        const botoSubmit = screen.getByRole('button', { name: /Esborrar Usuari/i });
        fireEvent.click(botoSubmit);

        // Verifiquem que crida a setError del hook
        expect(mockSetError).toHaveBeenCalledWith("El nom de l'usuari és obligatori");
        // I que no ha intentat fer cap fetch
        expect(global.fetch).not.toHaveBeenCalled();
    });

    it('ha de realitzar la crida DELETE correctament quan el nom és vàlid', async () => {
        // Simulem una resposta "ok" del servidor
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
        });

        render(<DeleteUserForm onUserDeleted={mockOnUserDeleted} />);

        const input = screen.getByPlaceholderText(/Nom usuari p.e: admin/i);
        const botoSubmit = screen.getByRole('button', { name: /Esborrar Usuari/i });

        // Escrivim un nom i enviem
        fireEvent.change(input, { target: { value: 'testuser' } });
        fireEvent.click(botoSubmit);

        expect(mockStartLoading).toHaveBeenCalled();

        // Verifiquem la crida fetch
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/users/testuser'),
                expect.objectContaining({
                    method: 'DELETE',
                    headers: { Authorization: 'Bearer fake-token-123' },
                })
            );
        });

        // Verifiquem que s'aturen els estats de càrrega i es crida el callback
        expect(mockStopLoading).toHaveBeenCalledWith(true);
        expect(mockOnUserDeleted).toHaveBeenCalled();
    });

    it('ha de gestionar un error de resposta del servidor (ex: 404)', async () => {
        // Simulem que el servidor diu que NO està bé (ok: false)
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            status: 404,
            statusText: 'Not Found',
        });

        render(<DeleteUserForm onUserDeleted={mockOnUserDeleted} />);

        const input = screen.getByPlaceholderText(/Nom usuari p.e: admin/i);
        fireEvent.change(input, { target: { value: 'usuari-inexistent' } });
        fireEvent.click(screen.getByRole('button', { name: /Esborrar Usuari/i }));

        await waitFor(() => {
            expect(mockSetError).toHaveBeenCalledWith('Error: 404 Not Found');
            expect(mockStopLoading).toHaveBeenCalledWith(false);
        });
    });

    it('ha de mostrar els missatges de carregament, èxit i error segons l\'estat del hook', () => {
        // Aquí forcem que el hook retorni estats actius per veure si es pinten els components
        (useLoadingState as jest.Mock).mockReturnValue({
            isLoading: true,
            showSuccess: true,
            error: 'Error de prova',
            setError: mockSetError,
            startLoading: mockStartLoading,
            stopLoading: mockStopLoading,
        });

        render(<DeleteUserForm />);

        expect(screen.getByText('Esborrant usuari...')).toBeInTheDocument();
        expect(screen.getByText('Usuari esborrat correctament!')).toBeInTheDocument();
        expect(screen.getByText('Error de prova')).toBeInTheDocument();
    });
});