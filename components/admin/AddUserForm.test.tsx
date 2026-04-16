import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddUserForm } from './AddUserForm';
import { useAuth } from '@/app/hooks/useAuth';
import { useLoadingState } from '@/app/hooks/useLoadingState';
import { addUser } from '@/app/services/users';

// Mocks
jest.mock('@/app/hooks/useAuth');
jest.mock('@/app/hooks/useLoadingState');
jest.mock('@/app/services/users');

describe('Component AddUserForm', () => {
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

    it('ha de mostrar un error si s\'intenta enviar amb el nom d\'usuari buit', () => {
        render(<AddUserForm />);

        const botoSubmit = screen.getByRole('button', { name: /Afegir Usuari/i });
        fireEvent.click(botoSubmit);

        // Ha de llançar l'error al hook i no cridar al servei
        expect(mockSetError).toHaveBeenCalledWith("El nom d'usuari és obligatori.");
        expect(addUser).not.toHaveBeenCalled();
    });

    it('ha de cridar addUser amb totes les dades i buidar els camps si tot va bé', async () => {
        // Simulem que la promesa es resol bé
        (addUser as jest.Mock).mockResolvedValue({});

        render(<AddUserForm />);

        // Busquem els tres camps pels seus placeholders
        const inputName = screen.getByPlaceholderText(/Nom de l'usuari/i);
        const inputEmail = screen.getByPlaceholderText(/E-Mail de l'usuari/i);
        const inputPassword = screen.getByPlaceholderText(/••••••••/i);
        const botoSubmit = screen.getByRole('button', { name: /Afegir Usuari/i });

        // Omplim el formulari
        fireEvent.change(inputName, { target: { value: 'Maria' } });
        fireEvent.change(inputEmail, { target: { value: 'maria@test.com' } });
        fireEvent.change(inputPassword, { target: { value: 'Secreta123' } });

        fireEvent.click(botoSubmit);

        // Comprovem l'inici de càrrega
        expect(mockStartLoading).toHaveBeenCalled();

        // Posem totes les comprovacions posteriors dins del waitFor per evitar l'error de timing
        await waitFor(() => {
            // Verifiquem que crida al servei amb tots els paràmetres en l'ordre correcte
            expect(addUser).toHaveBeenCalledWith('Maria', 'maria@test.com', 'Secreta123', 'fake-token-admin');

            // Verifiquem l'aturada de càrrega i èxit
            expect(mockStopLoading).toHaveBeenCalledWith(true);

            // Els tres camps s'haurien d'haver buidat
            expect(inputName).toHaveValue('');
            expect(inputEmail).toHaveValue('');
            expect(inputPassword).toHaveValue('');
        });
    });

    it('ha de capturar errors de l\'API i mostrar-los', async () => {
        // Simulem que el servei llança un error (ex: el correu ja existeix)
        (addUser as jest.Mock).mockRejectedValue(new Error('L\'usuari ja existeix a la base de dades'));

        render(<AddUserForm />);

        const inputName = screen.getByPlaceholderText(/Nom de l'usuari/i);
        const inputEmail = screen.getByPlaceholderText(/E-Mail de l'usuari/i);
        const inputPassword = screen.getByPlaceholderText(/••••••••/i);

        const botoSubmit = screen.getByRole('button', { name: /Afegir Usuari/i });      

        fireEvent.change(inputName, { target: { value: 'Usuari Duplicat' } });
        fireEvent.change(inputEmail, { target: { value: 'test@test.com' } }); 
        fireEvent.change(inputPassword, { target: { value: 'Secreta123' } });
        fireEvent.click(botoSubmit);

        await waitFor(() => {
            // Verifiquem que l'error s'ha passat al hook
            expect(mockSetError).toHaveBeenCalledWith('L\'usuari ja existeix a la base de dades');
            // Verifiquem que s'atura el loading sense èxit 
            expect(mockStopLoading).toHaveBeenCalledWith(false);
        });
    });

    it('ha de mostrar els estats de UI (carregant, èxit, error) correctament', () => {
        // Forcem que el hook retorni els diferents estats
        (useLoadingState as jest.Mock).mockReturnValue({
            isLoading: true,
            showSuccess: true,
            error: 'Error simulat en afegir usuari',
            setError: mockSetError,
            startLoading: mockStartLoading,
            stopLoading: mockStopLoading,
        });

        render(<AddUserForm />);

        expect(screen.getByText('Afegint usuari...')).toBeInTheDocument();
        expect(screen.getByText('Usuari afegit correctament!')).toBeInTheDocument();
        expect(screen.getByText('Error simulat en afegir usuari')).toBeInTheDocument();

        // Comprovem que tots els inputs i el botó estiguin deshabilitats durant la càrrega
        expect(screen.getByPlaceholderText(/Nom de l'usuari/i)).toBeDisabled();
        expect(screen.getByPlaceholderText(/E-Mail de l'usuari/i)).toBeDisabled();
        expect(screen.getByPlaceholderText(/••••••••/i)).toBeDisabled();
        expect(screen.getByRole('button', { name: /Afegir Usuari/i })).toBeDisabled();
    });
});