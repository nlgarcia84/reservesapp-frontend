import { render, screen, fireEvent } from '@testing-library/react';
import { InputForm } from './InputForm';

describe('Component InputForm', () => {
    it('ha de renderitzar correctament amb el placeholder i el valor inicial', () => {
        const mockOnChange = jest.fn();
        render(
            <InputForm
                type="text"
                placeholder="Escriu el teu nom"
                value="Joan"
                onChange={mockOnChange}
            />
        );

        const input = screen.getByPlaceholderText('Escriu el teu nom');
        expect(input).toBeInTheDocument();
        expect(input).toHaveValue('Joan');
        expect(input).toHaveAttribute('type', 'text');
    });

    it('ha de cridar la funció onChange quan l\'usuari escriu', () => {
        const mockOnChange = jest.fn();
        render(<InputForm type="text" onChange={mockOnChange} />);

        // Com que no li hem posat placeholder, el busquem pel rol d'input genèric (textbox)
        const input = screen.getByRole('textbox');

        // Simulem que l'usuari escriu la lletra "A"
        fireEvent.change(input, { target: { value: 'A' } });

        expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it('ha de canviar al tipus password correctament', () => {
        const mockOnChange = jest.fn();
        render(<InputForm type="password" placeholder="Contrasenya" onChange={mockOnChange} />);

        // Els inputs de tipus password no tenen el rol "textbox" per defecte, així que el busquem pel placeholder
        const input = screen.getByPlaceholderText('Contrasenya');
        expect(input).toHaveAttribute('type', 'password');
    });

    it('ha de respectar les propietats disabled i required', () => {
        const mockOnChange = jest.fn();
        render(<InputForm type="email" disabled required onChange={mockOnChange} />);

        // Busquem per rol específic d'email (no és "textbox")
        const input = screen.getByRole('textbox'); 

        expect(input).toBeDisabled();
        expect(input).toBeRequired();
    });
});