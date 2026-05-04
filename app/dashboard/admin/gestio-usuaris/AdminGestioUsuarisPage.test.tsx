import { render, screen } from '@testing-library/react';

// 1. Configuració de variables d'entorn
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://fake-url.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'fake-anon-key';

import GestioUsuaris from './page';

// 2. Mocks de navegació
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

describe('AdminGestioUsuarisPage', () => {
    it('ha de renderitzar el títol del panell d\'administració d\'usuaris', () => {
        render(<GestioUsuaris />);

        // Busquem el títol (l'entitat d'apostrofe d'HTML es renderitza com a text normal)
        expect(screen.getByText(/Panell administrador d'usuaris/i)).toBeInTheDocument();
    });

    it('ha de contenir un enllaç correcte per afegir usuaris', () => {
        render(<GestioUsuaris />);

        const link = screen.getByRole('link', { name: /afegir usuari/i });
        expect(link).toHaveAttribute('href', '/dashboard/admin/gestio-usuaris/afegir-usuari');
    });

    it('ha de contenir un enllaç correcte per esborrar usuaris', () => {
        render(<GestioUsuaris />);

        const link = screen.getByRole('link', { name: /esborrar usuari/i });
        expect(link).toHaveAttribute('href', '/dashboard/admin/gestio-usuaris/esborrar-usuari');
    });

    it('ha de mostrar el botó de tornada al dashboard d\'admin', () => {
        render(<GestioUsuaris />);

        const backButton = screen.getByRole('button', { name: /Tornar al Dashboard/i });
        expect(backButton).toBeInTheDocument();
    });

    it('el botó d\'esborrar ha de tenir estils visuals de perill (vermell)', () => {
        render(<GestioUsuaris />);

        const deleteButton = screen.getByText(/Esborrar usuari/i).closest('button');
        // Verifiquem les classes de Tailwind que indiquen vermell
        expect(deleteButton).toHaveClass('text-red-500');
    });
});