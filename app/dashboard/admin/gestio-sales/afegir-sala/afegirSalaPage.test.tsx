process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://fake-url.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'fake-key';

import { render, screen, waitFor } from '@testing-library/react';
import GestioSales from '../page';
import { getRooms } from '@/app/services/rooms';
import { useAuth } from '@/app/hooks/useAuth';

// Mocks de les dependències
jest.mock('@/app/services/rooms', () => ({
    getRooms: jest.fn(),
}));

jest.mock('@/app/hooks/useAuth', () => ({
    useAuth: jest.fn(),
}));

// Mock de Link de Next.js perquè no doni problemes de rutes
jest.mock('next/link', () => {
    // eslint-disable-next-line react/display-name
    return ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    );
});

const mockRooms = [
    {
        id: 1,
        name: 'Sala Alpha',
        capacity: 10,
        equipment: ['tv'],
        description: 'Descripció Alpha',
        imageUrl: null,
        hasTv: true,
        hasProjector: false,
        hasWhiteboard: false,
        hasAirConditioning: false
    },
    {
        id: 2,
        name: 'Sala Beta',
        capacity: 20,
        equipment: ['projector'],
        description: 'Descripció Beta',
        imageUrl: null,
        hasTv: false,
        hasProjector: true,
        hasWhiteboard: false,
        hasAirConditioning: false
    }
];

describe('Pàgina GestioSales', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useAuth as jest.Mock).mockReturnValue({ token: 'fake-token' });
    });

    it('ha de mostrar l\'estat de càrrega inicialment', () => {
        // Fem que el mock es quedi "pendent" un moment
        (getRooms as jest.Mock).mockReturnValue(new Promise(() => { }));

        render(<GestioSales />);

        expect(screen.getByText(/carregant sales.../i)).toBeInTheDocument();
    });

    it('ha de carregar i mostrar la llista de sales correctament', async () => {
        (getRooms as jest.Mock).mockResolvedValue(mockRooms);

        render(<GestioSales />);

        // Esperem que les dades apareguin
        await waitFor(() => {
            expect(screen.getByText('Sala Alpha')).toBeInTheDocument();
            expect(screen.getByText('Sala Beta')).toBeInTheDocument();
        });

        // Verifiquem el comptador de "totals"
        expect(screen.getByText(/2 totals/i)).toBeInTheDocument();
    });

    it('ha de tenir un enllaç correcte per afegir una nova sala', () => {
        (getRooms as jest.Mock).mockResolvedValue([]);

        render(<GestioSales />);

        const addButton = screen.getByRole('link', { name: /afegir nova sala/i });
        expect(addButton).toHaveAttribute('href', '/dashboard/admin/gestio-sales/afegir-sala');
    });

    it('ha de gestionar l\'error si la crida al servei falla', async () => {
        // Silenciem el console.error per al test
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        (getRooms as jest.Mock).mockRejectedValue(new Error('Error de xarxa'));

        render(<GestioSales />);

        await waitFor(() => {
            expect(getRooms).toHaveBeenCalled();
            expect(screen.queryByText(/carregant sales.../i)).not.toBeInTheDocument();
        });

        consoleSpy.mockRestore();
    });

    it('no ha de cridar a getRooms si no hi ha token', () => {
        (useAuth as jest.Mock).mockReturnValue({ token: null });

        render(<GestioSales />);

        expect(getRooms).not.toHaveBeenCalled();
    });
});