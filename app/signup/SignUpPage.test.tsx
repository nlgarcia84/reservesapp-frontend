import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUpPage from './page'; 

// 1 Simulem el router de Next.js
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

// 2 Simulem la funció fetch del navegador
global.fetch = jest.fn() as jest.Mock;

describe('Formulari de Registre (SignUpPage)', () => {
    it('ha de mostrar un error si les contrasenyes no coincideixen', async () => {
        const user = userEvent.setup();
    
    // Renderitzem el component
        render(<SignUpPage />);

    // Trobem els elements de contrasenya
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    const passwordInput = passwordInputs[0];
    const confirmPasswordInput = passwordInputs[1];
    
    // 1 Escrivim contrasenyes diferents
    await user.type(passwordInput, 'Contrasenya123!');
    await user.type(confirmPasswordInput, 'Diferent456!');

    // 2 Trobem el botó de submit i forcem el submit del formulari
    const submitButton = screen.getByRole('button', { name: /crear compte/i });
    const formElement = submitButton.closest('form');

    // 3 Forcem el Submit directament saltant-nos les validacions HTML natives
    if (formElement) {
        fireEvent.submit(formElement);
    }

    // COMPROVACIÓ
    await waitFor(() => {
        expect(screen.getByText('Les contrasenyes no coincideixen.')).toBeInTheDocument();
    });
    });
});