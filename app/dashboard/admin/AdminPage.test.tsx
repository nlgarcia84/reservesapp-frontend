import { render, screen, waitFor } from '@testing-library/react';
import AdminPage from './page';
import { useAuth } from '@/app/hooks/useAuth';
import { getRooms } from '@/app/services/rooms';

// 1 Mock del hook d'autenticació
jest.mock('@/app/hooks/useAuth', () => ({
    useAuth: jest.fn(),
}));

// 2 Mock del servei de sales
jest.mock('@/app/services/rooms', () => ({
    getRooms: jest.fn(),
}));

describe('Component AdminPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('ha de mostrar "Carregant..." inicialment mentre s\'obtenen les dades', () => {
        (useAuth as jest.Mock).mockReturnValue({ token: 'token-valid' });

        // Simulem una promesa que "no es resol mai" per poder veure l'estat de càrrega
        (getRooms as jest.Mock).mockReturnValue(new Promise(() => { }));

        render(<AdminPage />);

        expect(screen.getByText('Carregant...')).toBeInTheDocument();
    });

    it('ha de mostrar un error si la petició de sales falla', async () => {
        (useAuth as jest.Mock).mockReturnValue({ token: 'token-valid' });

        // Simulem que el backend retorna un error
        (getRooms as jest.Mock).mockRejectedValue(new Error('Error de connexió amb el servidor'));

        render(<AdminPage />);

        // Esperem que l'error aparegui per pantalla
        await waitFor(() => {
            expect(screen.getByText('Error: Error de connexió amb el servidor')).toBeInTheDocument();
        });
    });

    it('ha de carregar i mostrar correctament les sales i els càlculs totals', async () => {
        (useAuth as jest.Mock).mockReturnValue({ token: 'token-valid' });

        // Creem unes dades falses per comprovar que les matemàtiques funcionen
        const salesFalses = [
            { id: 1, name: 'Sala A', capacity: 10 },
            { id: 2, name: 'Sala B', capacity: 25 },
            { id: 3, name: 'Sala C', capacity: 15 },
        ];
        (getRooms as jest.Mock).mockResolvedValue(salesFalses);

        render(<AdminPage />);

        // Esperem a que desaparegui el "Carregant..." i aparegui el títol
        await waitFor(() => {
            expect(screen.getByText(/Admin/i)).toBeInTheDocument();
        });

        // 1 Comprovem els càlculs totals 
        // Hi ha 3 sales
        expect(screen.getByText('3')).toBeInTheDocument();
        // La capacitat sumada ha de ser 50 (10 + 25 + 15)
        expect(screen.getByText('50')).toBeInTheDocument();

        // 2 Comprovem que es llisten les sales correctament
        expect(screen.getByText('Sala A')).toBeInTheDocument();
        expect(screen.getByText('10 places')).toBeInTheDocument();

        expect(screen.getByText('Sala B')).toBeInTheDocument();
        expect(screen.getByText('25 places')).toBeInTheDocument();

        expect(screen.getByText('Sala C')).toBeInTheDocument();
        expect(screen.getByText('15 places')).toBeInTheDocument();

        // 3 Comprovem els textos de les reserves (encara no estan implementades, així que esperem els 0)
        const elementsAmbZero = screen.getAllByText('0');
        // Hi ha un '0' per Reserves Totals i un altre '0' per Reserves Avui
        expect(elementsAmbZero.length).toBeGreaterThanOrEqual(2);
        expect(screen.getByText('No hi ha reserves registrades')).toBeInTheDocument();
    });
});