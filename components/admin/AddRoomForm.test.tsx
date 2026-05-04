import { render, screen, fireEvent } from '@testing-library/react';
import { AddRoomForm } from './AddRoomForm';
import { addNewRoom } from '@/app/services/rooms';
import { useAuth } from '@/app/hooks/useAuth';

// Evitem que el servei de Supabase faci petar el test per falta de variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://fake-url.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'fake-key';

// Fem mocks
jest.mock('@/app/services/rooms', () => ({
  addNewRoom: jest.fn(),
}));

jest.mock('@/app/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

describe('Component AddRoomForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Simulem que tenim un admin loguejat
    (useAuth as jest.Mock).mockReturnValue({ token: 'fake-admin-token' });
  });

  it('ha de renderitzar el formulari correctament', () => {
    render(<AddRoomForm />);
    expect(screen.getByText('Afegir nova sala')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Ex: Sala de reunions A'),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Capacitat (núm de persones)'),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Descripció de la sala'),
    ).toBeInTheDocument();

    // Verifiquem que els nous checkboxes hi siguin
    expect(screen.getByLabelText('Projector + pantalla')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Pissarra blanca interactiva'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Televisor 55" 4K')).toBeInTheDocument();
    expect(screen.getByLabelText('Aire acondicionat')).toBeInTheDocument();
  });

  it("ha de mostrar un error si s'intenta enviar sense nom", async () => {
    render(<AddRoomForm />);

    const boto = screen.getByRole('button', { name: /afegir sala/i });
    fireEvent.click(boto);

    expect(
      await screen.findByText('El nom de la sala és obligatori.'),
    ).toBeInTheDocument();
    expect(addNewRoom).not.toHaveBeenCalled();
  });

  it('ha de mostrar un error si la capacitat és negativa o zero', async () => {
    render(<AddRoomForm />);

    const inputNom = screen.getByPlaceholderText(/Ex: Sala de reunions A/i);
    const inputCapacitat = screen.getByPlaceholderText(/Capacitat/i);
    const boto = screen.getByRole('button', { name: /afegir sala/i });

    fireEvent.change(inputNom, { target: { value: 'Sala A' } });
    fireEvent.change(inputCapacitat, { target: { value: '-5' } });

    fireEvent.click(boto);

    // Busquem el missatge d'error que ara sí que apareixerà al DOM
    const errorMsg = await screen.findByText(
      /La capacitat ha de ser un número vàlid més gran que 0/i,
    );

    expect(errorMsg).toBeInTheDocument();
    expect(addNewRoom).not.toHaveBeenCalled();
  });

  it('ha de cridar el servei i mostrar èxit si les dades són correctes', async () => {
    (addNewRoom as jest.Mock).mockImplementation(() =>
      Promise.resolve({ id: 1 }),
    );

    render(<AddRoomForm />);

    // Omplim dades bàsiques
    fireEvent.change(screen.getByPlaceholderText('Ex: Sala de reunions A'), {
      target: { value: 'Sala Polivalent' },
    });
    fireEvent.change(
      screen.getByPlaceholderText('Capacitat (núm de persones)'),
      { target: { value: '25' } },
    );
    fireEvent.change(screen.getByPlaceholderText('Descripció de la sala'), {
      target: { value: "Ideal per a presentacions d'empresa." },
    });

    // Seleccionem equipament (checkboxes)
    fireEvent.click(screen.getByLabelText('Projector + pantalla'));
    fireEvent.click(screen.getByLabelText('Televisor 55" 4K'));

    const boto = screen.getByRole('button', { name: /afegir sala/i });
    fireEvent.click(boto);

    // Comprovem el missatge d'èxit
    const missatgeExit = await screen.findByText(
      'Sala afegida correctament!',
      {},
      { timeout: 3000 },
    );
    expect(missatgeExit).toBeInTheDocument();

    // Comprovem que s'ha cridat amb l'array d'equipament correcte
    expect(addNewRoom).toHaveBeenCalledWith(
      'Sala Polivalent',
      25,
      ['projector', 'tv'], // L'ordre depèn de com l'usuari clica o com està implementat l'estat
      "Ideal per a presentacions d'empresa.",
      'fake-admin-token',
      undefined, // Per al fitxer d'imatge que no hem pujat
    );
  });
});
