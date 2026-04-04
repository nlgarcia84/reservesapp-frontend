import { render, screen, fireEvent } from '@testing-library/react';
import { Interruptor } from './Interruptor';

describe('Component Interruptor', () => {
    it('ha de renderitzar només el botó si no se li passa cap label', () => {
        const mockOnChange = jest.fn();
        render(<Interruptor checked={false} onChange={mockOnChange} />);

        // Comprovem que l'input tipus checkbox existeix
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeInTheDocument();

        // Comprovem que està desmarcat inicialment
        expect(checkbox).not.toBeChecked();
    });

    it('ha de renderitzar amb l\'etiqueta i estar enllaçat correctament', () => {
        const mockOnChange = jest.fn();
        render(<Interruptor label="Recorda'm la sessió" checked={true} onChange={mockOnChange} />);

        const checkbox = screen.getByRole('checkbox', { name: "Recorda'm la sessió" });

        expect(checkbox).toBeInTheDocument();
        expect(checkbox).toBeChecked();

        // Verifiquem que el text s'ha pintat a la pantalla
        expect(screen.getByText("Recorda'm la sessió")).toBeInTheDocument();
    });

    it('ha de cridar la funció onChange amb el valor invertit quan s\'hi fa clic', () => {
        const mockOnChange = jest.fn();

        // Partim de la base que està desmarcat (false)
        render(<Interruptor label="Activar" checked={false} onChange={mockOnChange} />);

        const checkbox = screen.getByRole('checkbox', { name: "Activar" });

        // Simulem que l'usuari fa clic
        fireEvent.click(checkbox);

        // Comprovem que la funció s'ha cridat exactament 1 vegada
        expect(mockOnChange).toHaveBeenCalledTimes(1);

        // Com que estava a false, el clic hauria d'intentar passar-ho a true
        expect(mockOnChange).toHaveBeenCalledWith(true);
    });
});