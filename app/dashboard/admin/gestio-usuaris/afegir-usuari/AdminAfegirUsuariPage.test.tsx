import { render, screen } from '@testing-library/react';

// 1. Configuració de variables d'entorn
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://fake-url.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'fake-anon-key';

import AfegirUsuaris from './page';

// 2. Mocks
// Mock de next/navigation per al BackButton
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

// Mock del formulari per simplificar el test de la pàgina
jest.mock('@/components/admin/AddUserForm', () => ({
    AddUserForm: () => <div data-testid="mock-add-user-form">Formulari d&apos;usuari</div>,
}));

describe('AdminAfegirUsuariPage', () => {
    it('ha de renderitzar el títol de la pàgina correctament', () => {
        render(<AfegirUsuaris />);

        const title = screen.getByText(/Afegir usuaris/i);
        expect(title).toBeInTheDocument();
        // Verifiquem que és un element h1 per semàntica
        expect(title.tagName).toBe('H1');
    });

    it('ha de contenir el component AddUserForm', () => {
        render(<AfegirUsuaris />);

        // Verifiquem que el formulari mockejat està present
        expect(screen.getByTestId('mock-add-user-form')).toBeInTheDocument();
    });

    it('ha de mostrar el botó de tornada amb el text correcte', () => {
        render(<AfegirUsuaris />);

        const backButton = screen.getByRole('button', { name: /Tornar/i });
        expect(backButton).toBeInTheDocument();
    });

    it('ha d\'aplicar les classes d\'estil al contenidor del títol', () => {
        render(<AfegirUsuaris />);

        const titleContainer = screen.getByText(/Afegir usuaris/i);
        // Verifiquem algunes classes clau de Tailwind que has posat al codi
        expect(titleContainer).toHaveClass('bg-zinc-950/70');
        expect(titleContainer).toHaveClass('border-white/10');
    });
});