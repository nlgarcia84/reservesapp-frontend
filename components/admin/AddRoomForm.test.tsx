import { render, screen, fireEvent} from '@testing-library/react';
import { AddRoomForm } from './AddRoomForm';
import { addNewRoom } from '@/app/services/rooms';

// 1. Fem un "mock" del servei perquè no faci peticions reals al backend
jest.mock('@/app/services/rooms', () => ({
  addNewRoom: jest.fn(),
}));

describe('Component AddRoomForm', () => {
  // Netegem el mock abans de cada test perquè no s'acumulin trucades
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  it('ha de renderitzar el formulari correctament', () => {
    render(<AddRoomForm />);
    expect(screen.getByText('Afegir nova sala')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nova Sala')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Capacitat')).toBeInTheDocument();
  });

  it('ha de mostrar un error si s\'intenta enviar sense nom', () => {
    render(<AddRoomForm />);
    
    // Fem clic directament sense omplir res
    const boto = screen.getByRole('button', { name: /afegir sala/i });
    fireEvent.click(boto);
    
    // Comprovem que salta l'error i no es crida al backend
    expect(screen.getByText('El nom de la sala és obligatori')).toBeInTheDocument();
    expect(addNewRoom).not.toHaveBeenCalled();
  });

  it('ha de mostrar un error si la capacitat no és vàlida', () => {
    render(<AddRoomForm />);
    
    // Omplim només el nom
    const inputNom = screen.getByPlaceholderText('Nova Sala');
    fireEvent.change(inputNom, { target: { value: 'Sala A' } });

    // Fem clic
    const boto = screen.getByRole('button', { name: /afegir sala/i });
    fireEvent.click(boto); 

    expect(screen.getByText('La capacitat ha de ser un número vàlid')).toBeInTheDocument();
    expect(addNewRoom).not.toHaveBeenCalled();
  });

  it('ha de cridar el servei i mostrar èxit si les dades són correctes', async () => {
    // Forcem explícitament que la funció retorni una promesa resolta
    (addNewRoom as jest.Mock).mockImplementation(() => Promise.resolve({ id: 1, name: 'Sala A', capacity: 10 }));

    render(<AddRoomForm />);

    // Omplim els camps
    fireEvent.change(screen.getByPlaceholderText('Nova Sala'), { target: { value: 'Sala A' } });
    fireEvent.change(screen.getByPlaceholderText('Capacitat'), { target: { value: '10' } });

    // Fem clic al botó
    const boto = screen.getByRole('button', { name: /afegir sala/i });
    fireEvent.click(boto);

    const missatgeExit = await screen.findByText('✓ Sala afegida!', {}, { timeout: 3000 });
    
    // Comprovem
    expect(missatgeExit).toBeInTheDocument();
    expect(addNewRoom).toHaveBeenCalledWith('Sala A', 10, null);
  });
});
