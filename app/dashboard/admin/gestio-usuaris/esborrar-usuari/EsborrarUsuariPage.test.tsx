import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import EsborrarUsuari from './page'; 
import { useAuth } from '@/app/hooks/useAuth';
import { getUsers } from '@/app/services/users';

// Mock del hook d'autenticació
jest.mock('@/app/hooks/useAuth', () => ({
    useAuth: jest.fn(),
}));

// Mock del servei que obté els usuaris
jest.mock('@/app/services/users', () => ({
    getUsers: jest.fn(),
}));

// Mock del formulari d'esborrar. 
jest.mock('@/components/admin/DeleteUserForm', () => {
    return function MockDeleteUserForm({ onUserDeleted }: { onUserDeleted: () => void }) {
        return (
            <div data-testid="delete-user-form">
                <button onClick={onUserDeleted}>Simular esborrat d&apos;usuari</button>
            </div>
        );
    };
});

describe('Component EsborrarUsuari', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Per defecte, simulem que estem connectats amb un token vàlid
        (useAuth as jest.Mock).mockReturnValue({ token: 'token-fals-123' });
    });

    it('ha de renderitzar el títol principal', () => {
        // Simulem una resposta buida ràpida perquè no peti res
        (getUsers as jest.Mock).mockResolvedValue([]);

        render(<EsborrarUsuari />);

        expect(screen.getByText('Esborrar usuari')).toBeInTheDocument();
    });

    it('ha de mostrar el missatge "No hi ha usuaris disponibles" si la llista està buida', async () => {
        // Simulem que el backend retorna un array buit
        (getUsers as jest.Mock).mockResolvedValue([]);

        render(<EsborrarUsuari />);

        // Com que és asíncron, esperem a que desaparegui el loading i surti el text
        await waitFor(() => {
            expect(screen.getByText('No hi ha usuaris disponibles')).toBeInTheDocument();
        });
    });

    it('ha de mostrar la llista d\'usuaris si el backend retorna dades', async () => {
        // Simulem que el backend ens retorna dos usuaris
        const usuarisSimulats = [
            { id: 1, name: 'Anna Pérez', email: 'anna@test.com', password: '' },
            { id: 2, name: 'Joan Marc', email: 'joan@test.com', password: '' },
        ];
        (getUsers as jest.Mock).mockResolvedValue(usuarisSimulats);

        render(<EsborrarUsuari />);

        // Esperem a que es pintin a la pantalla
        await waitFor(() => {
            expect(screen.getByText('Anna Pérez')).toBeInTheDocument();
            expect(screen.getByText('Joan Marc')).toBeInTheDocument();
            // Comprovem que també surten les IDs
            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('2')).toBeInTheDocument();
        });
    });

    it('ha de tornar a cridar a getUsers quan el DeleteUserForm executa onUserDeleted', async () => {
        (getUsers as jest.Mock).mockResolvedValue([]);

        render(<EsborrarUsuari />);

        // Esperem a que passi la primera crida inicial del useEffect
        await waitFor(() => {
            expect(getUsers).toHaveBeenCalledTimes(1);
        });

        const botoSimularEsborrat = screen.getByText("Simular esborrat d'usuari");
        fireEvent.click(botoSimularEsborrat);

        // Comprovem que s'ha tornat a cridar a l'API per refrescar la llista (ara haurien de ser 2 vegades)
        await waitFor(() => {
            expect(getUsers).toHaveBeenCalledTimes(2);
            // Ens assegurem que es crida amb el token correcte
            expect(getUsers).toHaveBeenLastCalledWith('token-fals-123');
        });
    });
});