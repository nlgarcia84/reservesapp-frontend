process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://fake-url.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'fake-key';

import { render, screen, waitFor } from '@testing-library/react';
import EmployeePage from './page';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';

// Fem el mock dels serveis de sales perquè no facin petar el test per falta de variables d'entorn o connexió a Supabase
jest.mock('@/app/services/rooms', () => ({
    getRooms: jest.fn(() => Promise.resolve([])),
    getRoomById: jest.fn(() => Promise.resolve({})),
}));

// Fem mock del router
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

// Fem mock del hook d'autenticació
jest.mock('@/app/hooks/useAuth', () => ({
    useAuth: jest.fn(),
}));

// Xarxa de seguretat per evitar que el test peti per falta de variables d'entorn de Supabase
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://fake-url.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'fake-key';

describe('EmployeePage Component', () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        // Configurem el router fals perquè ens deixi espiar la funció push
        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
        });
    });

    it('ha de renderitzar l\'estat de càrrega inicialment', () => {
        // Simulem un usuari actiu
        (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, name: 'Esteve' });

        render(<EmployeePage />);

        // Just al moment de muntar-se, el setTimeout encara no ha acabat, així que ha de sortir "Carregant..."
        expect(screen.getByText('Carregant...')).toBeInTheDocument();
    });

    it('ha de redirigir a /login si l\'usuari no està autenticat', async () => {
        // Simulem un usuari desconnectat
        (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false, name: null });

        render(<EmployeePage />);

        // Esperem que s'hagi executat el setTimeout i s'hagi cridat la redirecció
        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/login');
        });
    });

    it('ha de mostrar el nom de l\'usuari si està autenticat i amagar el "Carregant..."', async () => {
        (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, name: 'Esteve' });

        render(<EmployeePage />);

        // Busquem el text que realment apareix a la teva consola
        await waitFor(() => {
            expect(screen.getByText(/sales disponibles per a les teves reunions/i)).toBeInTheDocument();
        });

        expect(screen.getByText(/Esteve/i)).toBeInTheDocument();
        expect(screen.queryByText('Carregant...')).not.toBeInTheDocument();
    });

    it('ha de mostrar la benvinguda per defecte si està autenticat però no té nom', async () => {
        (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, name: '' });

        render(<EmployeePage />);

        await waitFor(() => {
            // Fem servir el text real aquí també
            expect(screen.getByText(/sales disponibles per a les teves reunions/i)).toBeInTheDocument();
        });
    });
});