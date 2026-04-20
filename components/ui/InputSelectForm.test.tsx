import { render, screen, fireEvent } from '@testing-library/react';
import { InputSelectForm } from './InputSelectForm';

describe('Component InputSelectForm', () => {
    const defaultProps = {
        id: 'test-checkbox',
        name: 'equipment',
        value: 'projector',
        label: 'Projector + Pantalla',
        onChange: () => {}
    };

    it('ha de renderitzar la etiqueta i el checkbox correctament', () => {
        render(<InputSelectForm {...defaultProps} />);

        expect(screen.getByLabelText(/Projector \+ Pantalla/i)).toBeInTheDocument();
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('ha de reflectir l\'estat "checked" correctament', () => {
        const { rerender } = render(<InputSelectForm {...defaultProps} checked={true} />);
        const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
        expect(checkbox.checked).toBe(true);

        rerender(<InputSelectForm {...defaultProps} checked={false} />);
        expect(checkbox.checked).toBe(false);
    });

    it('ha de cridar la funció onChange quan es clica', () => {
        const mockOnChange = jest.fn();
        render(<InputSelectForm {...defaultProps} onChange={mockOnChange} />);

        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);

        expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it('ha de mostrar el checkbox com a deshabilitat si es passa la prop disabled', () => {
        render(<InputSelectForm {...defaultProps} disabled={true} />);

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeDisabled();
    });

    it('ha de tenir els atributs id, name i value correctes', () => {
        render(<InputSelectForm {...defaultProps} />);

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toHaveAttribute('id', 'test-checkbox');
        expect(checkbox).toHaveAttribute('name', 'equipment');
        expect(checkbox).toHaveAttribute('value', 'projector');
    });
});