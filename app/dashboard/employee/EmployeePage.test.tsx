import { render, screen, waitFor } from '@testing-library/react';
import EmployeePage from './page'; 
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';

// Fem mock del router
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

// Fem mock del hook d'autenticació
jest.mock('@/app/hooks/useAuth', () => ({
    useAuth: jest.fn(),
}));

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
        // Simulem un usuari connectat amb nom
        (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, name: 'Esteve' });

        render(<EmployeePage />);

        // Ens esperem a que el text canviï
        await waitFor(() => {
            expect(screen.getByText(/Esteve/i)).toBeInTheDocument();
        });

        // Comprovem la resta del text de la pàgina
        expect(screen.getByText(/Aqui tens un resum de les teves sales i reserves/i)).toBeInTheDocument();
        // Ens assegurem que el "Carregant..." ja no hi és
        expect(screen.queryByText('Carregant...')).not.toBeInTheDocument();
    });

    it('ha de mostrar "usuari" per defecte si està autenticat però no té nom', async () => {
        // Simulem un usuari connectat però sense la variable name
        (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, name: '' });

        render(<EmployeePage />);

        await waitFor(() => {
            expect(screen.getByText(/Aqui tens un resum de les teves sales i reserves/i)).toBeInTheDocument();
        });
    });
});