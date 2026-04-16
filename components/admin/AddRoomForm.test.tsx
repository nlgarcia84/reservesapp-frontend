import { render, screen, fireEvent } from '@testing-library/react';
import { AddRoomForm } from './AddRoomForm';
import { addNewRoom } from '@/app/services/rooms';
// Ens farà falta fer mock del token de l'administrador!
import { useAuth } from '@/app/hooks/useAuth';

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
    expect(screen.getByPlaceholderText('Ex: Sala de reunions A')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Capacitat (núm de persones)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ex: Projector, Pissarra...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Descripció de la sala')).toBeInTheDocument();
  });

  it('ha de mostrar un error si s\'intenta enviar sense nom', () => {
    render(<AddRoomForm />);
    
    const boto = screen.getByRole('button', { name: /afegir sala/i });
    fireEvent.click(boto);
    
    expect(screen.getByText('El nom de la sala és obligatori.')).toBeInTheDocument();
    expect(addNewRoom).not.toHaveBeenCalled();
  });

  it('ha de mostrar un error si la capacitat és negativa o zero', () => {
    render(<AddRoomForm />);
    
    fireEvent.change(screen.getByPlaceholderText('Ex: Sala de reunions A'), { target: { value: 'Sala A' } });
    fireEvent.change(screen.getByPlaceholderText('Capacitat (núm de persones)'), { target: { value: '-5' } });

    const boto = screen.getByRole('button', { name: /afegir sala/i });
    fireEvent.click(boto); 

    expect(screen.getByText('La capacitat ha de ser un número vàlid més gran que 0.')).toBeInTheDocument();
    expect(addNewRoom).not.toHaveBeenCalled();
  });

  it('ha de cridar el servei i mostrar èxit si les dades són correctes', async () => {
    (addNewRoom as jest.Mock).mockImplementation(() => Promise.resolve());

    render(<AddRoomForm />);

    // Omplim els 4 camps
    fireEvent.change(screen.getByPlaceholderText('Ex: Sala de reunions A'), { target: { value: 'Sala Polivalent' } });
    fireEvent.change(screen.getByPlaceholderText('Capacitat (núm de persones)'), { target: { value: '25' } });
    fireEvent.change(screen.getByPlaceholderText('Ex: Projector, Pissarra...'), { target: { value: 'Projector 4K, 20 cadires' } });
    fireEvent.change(screen.getByPlaceholderText('Descripció de la sala'), { target: { value: 'Ideal per a presentacions d\'empresa.' } });

    const boto = screen.getByRole('button', { name: /afegir sala/i });
    fireEvent.click(boto);

    const missatgeExit = await screen.findByText('Sala afegida correctament!', {}, { timeout: 3000 });
    
    // Comprovem
    expect(missatgeExit).toBeInTheDocument();
    
    expect(addNewRoom).toHaveBeenCalledWith(
      'Sala Polivalent', 
      25, 
      'Projector 4K, 20 cadires', 
      'Ideal per a presentacions d\'empresa.',
      'fake-admin-token'
    );
  });
});