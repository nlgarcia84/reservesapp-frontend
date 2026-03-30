import { render, screen, fireEvent } from '@testing-library/react';
import { SidebarLayout } from './SidebarLayout';

describe('Component Sidebar', () => {
  it('ha de renderitzar els enllaços (children) i el botó "Amaga"', () => {
    const funcioTancar = jest.fn();

    // Renderitzem la Sidebar oberta i li passem un text com a "children"
    render(
      <SidebarLayout open={true} onClose={funcioTancar}>
        <a href="/sales">Llista de Sales</a>
      </SidebarLayout>,
    );

    // Comprovem que el fill es mostra
    expect(screen.getByText('Llista de Sales')).toBeInTheDocument();

    // Comprovem que el botó de tancar existeix
    expect(screen.getByText('Amaga')).toBeInTheDocument();
  });

  it('ha de cridar la funció "onClose" quan es fa clic al botó Amaga', () => {
    const funcioTancar = jest.fn();

    render(
      <Sidebar open={true} onClose={funcioTancar}>
        <p>Contingut</p>
      </Sidebar>,
    );

    // Busquem el botó pel seu text i hi fem clic
    const botoAmaga = screen.getByText('Amaga');
    fireEvent.click(botoAmaga);

    // Comprovem que la funció de tancar s'ha executat un cop
    expect(funcioTancar).toHaveBeenCalledTimes(1);
  });
});
