import { render, screen, waitFor } from '@testing-library/react';
import EsborrarUsuari from './page';
import { useAuth } from '@/app/hooks/useAuth';
import { getUsers } from '@/app/services/users';

// 1. Mock de Next.js per a useRouter i useParams
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        refresh: jest.fn(),
        back: jest.fn(),
    }),
    useParams: () => ({ id: '1' }),
    useSearchParams: () => ({
        get: jest.fn(),
    }),
}));

// Mock de Supabase
jest.mock('@supabase/supabase-js', () => ({
    createClient: jest.fn(() => ({
        storage: {
            from: jest.fn(() => ({
                upload: jest.fn(),
                getPublicUrl: jest.fn(() => ({ data: { publicUrl: 'http://fake-url.com' } })),
            })),
        },
    })),
}));

process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://fake.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'fake-key';

jest.mock('@/app/hooks/useAuth', () => ({
    useAuth: jest.fn(),
}));

jest.mock('@/app/services/users', () => ({
    getUsers: jest.fn(),
}));

jest.mock('@/components/admin/DeleteUserForm', () => {
    // eslint-disable-next-line react/display-name
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
        // Simulem un usuari autenticat amb token
        (useAuth as jest.Mock).mockReturnValue({
            token: 'token-fals-123',
            isAuthenticated: true
        });
    });

    it('ha de renderitzar el títol principal', async () => {
        (getUsers as jest.Mock).mockResolvedValue([]);
        render(<EsborrarUsuari />);

        await waitFor(() => {
            // Usem i per ignorar majúscules/minúscules, és més flexible
            expect(screen.getByText(/esborrar usuari/i)).toBeInTheDocument();
        });
    });

    it('ha de mostrar el missatge "No hi ha usuaris disponibles" si la llista està buida', async () => {
        (getUsers as jest.Mock).mockResolvedValue([]);
        render(<EsborrarUsuari />);

        await waitFor(() => {
            expect(screen.getByText(/no hi ha usuaris disponibles/i)).toBeInTheDocument();
        });
    });

    it('ha de mostrar la llista d\'usuaris si el backend retorna dades', async () => {
        const usuarisSimulats = [
            { id: 1, name: 'Anna Pérez', email: 'anna@test.com', password: '' },
            { id: 2, name: 'Joan Marc', email: 'joan@test.com', password: '' },
        ];
        (getUsers as jest.Mock).mockResolvedValue(usuarisSimulats);

        render(<EsborrarUsuari />);

        await waitFor(() => {
            expect(screen.getByText('Anna Pérez')).toBeInTheDocument();
            expect(screen.getByText('Joan Marc')).toBeInTheDocument();
            // Verifiquem els IDs de la taula
            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('2')).toBeInTheDocument();
        });
    });
});