import { render, screen } from '@testing-library/react';
import { Header } from './Header';

describe('Component Header', () => {
  it('ha de renderitzar el títol del dashboard i el botó', () => {
    // Creem una funció de prova ja que el Header la necessita per passar-la al BurgerButton
    const funcioSimulada = jest.fn();

    render(<Header sidebarOpen={false} onToggleSidebar={funcioSimulada} />);

    expect(screen.getByText('Dashboard RoomyApp')).toBeInTheDocument();

    // Comprovem que s'ha renderitzat el botó BurgerButton i el botó de logout
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);

    // Verificar el botó de Tancar sessió
    expect(
      screen.getByRole('button', { name: /Tancar sessió/i }),
    ).toBeInTheDocument();
  });
});
