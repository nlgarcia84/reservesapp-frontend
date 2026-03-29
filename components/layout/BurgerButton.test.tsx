import { render, screen, fireEvent } from '@testing-library/react';
import { BurgerButton } from './BurgerButton';

describe('Component BurgerButton', () => {
  it('ha de renderitzar el botó correctament', () => {
    // Creem una funció buida de prova (mock)
    const funcioSimulada = jest.fn();
    
    render(<BurgerButton isOpen={false} onToggle={funcioSimulada} />);

    const boto = screen.getByRole('button');
    expect(boto).toBeInTheDocument();
  });

  it('ha de cridar la funció "onToggle" quan s\'hi fa clic', () => {
    // 1 Creem una funció "espia" de Jest per veure quantes vegades s'executa
    const funcioSimulada = jest.fn();
    
    render(<BurgerButton isOpen={false} onToggle={funcioSimulada} />);
    const boto = screen.getByRole('button');

    // 2 Simulem que l'usuari fa un clic al botó
    fireEvent.click(boto);

    // 3 Comprovem que la funció simulada s'ha executat exactament 1 vegada
    expect(funcioSimulada).toHaveBeenCalledTimes(1);

    // 4 Simulem un altre clic (per tancar el menú)
    fireEvent.click(boto);

    // 5 Ara la funció s'hauria d'haver executat 2 vegades en total
    expect(funcioSimulada).toHaveBeenCalledTimes(2);
  });
});