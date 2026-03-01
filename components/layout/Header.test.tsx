import { render, screen } from '@testing-library/react';
import { Header } from './Header';

describe('Component Header', () => {
  it('ha de renderitzar el títol del dashboard i el botó', () => {
    // Creem una funció de prova ja que el Header la necessita per passar-la al BurgerButton
    const funcioSimulada = jest.fn();
    
    render(<Header sidebar={funcioSimulada} />);

    // Comprovem que el text del títol hi és
    expect(screen.getByText('Dashboard ReservesApp')).toBeInTheDocument();
    
    // Comprovem que s'ha renderitzat un botó (que correspon al BurgerButton)
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});