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

    // Trobem els inputs de nom i email
    const nameInput = screen.getByPlaceholderText('Nom complet');
    const emailInput = screen.getByPlaceholderText('nom@empresa.cat');

    // Omplim nom i email (necessari per arribar a la validació de contrasenyes)
    await user.type(nameInput, 'Testimoni Usuari');
    await user.type(emailInput, 'test@example.com');

    // Trobem els elements de contrasenya
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    const passwordInput = passwordInputs[0];
    const confirmPasswordInput = passwordInputs[1];

    // Escrivim contrasenyes diferents
    await user.type(passwordInput, 'Contrasenya123!');
    await user.type(confirmPasswordInput, 'Diferent456!');

    // Marca el checkbox de termes
    const termsCheckbox = screen.getByRole('checkbox');
    await user.click(termsCheckbox);

    // Trobem el botó de submit i forcem el submit del formulari
    const submitButton = screen.getByRole('button', { name: /crear compte/i });
    const formElement = submitButton.closest('form');

    // Forcem el Submit directament saltant-nos les validacions HTML natives
    if (formElement) {
      fireEvent.submit(formElement);
    }

    // COMPROVACIÓ
    await waitFor(() => {
      expect(
        screen.getByText('Les contrasenyes no coincideixen.'),
      ).toBeInTheDocument();
    });
  });
});
