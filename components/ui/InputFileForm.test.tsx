import { render, screen, fireEvent } from '@testing-library/react';
import { InputFileForm } from './InputFileForm';

describe('Component InputFileForm', () => {
    const mockOnChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Funció auxiliar per trobar l'input sense que petvi el cercador de labels
    const getInput = (container: HTMLElement) =>
        container.querySelector('#file-input') as HTMLInputElement;

    it('ha de renderitzar el botó de pujada i l\'input ocult', () => {
        const { container } = render(<InputFileForm onChange={mockOnChange} />);

        expect(screen.getByText(/seleccionar imatge/i)).toBeInTheDocument();
        const input = getInput(container);
        expect(input).toBeInTheDocument();
        expect(input.type).toBe('file');
    });

    it('ha de disparar el clic de l\'input quan es clica el botó', () => {
        const { container } = render(<InputFileForm onChange={mockOnChange} />);

        const input = getInput(container);
        const clickSpy = jest.spyOn(input, 'click');

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(clickSpy).toHaveBeenCalled();
    });

    it('ha de cridar onChange quan se selecciona un fitxer', () => {
        const { container } = render(<InputFileForm onChange={mockOnChange} />);

        const input = getInput(container);
        const file = new File(['contingut'], 'test.png', { type: 'image/png' });

        fireEvent.change(input, { target: { files: [file] } });

        expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it('ha de mostrar la imatge de previsualització si es passa la prop preview', () => {
        const fakeUrl = 'http://imatge.com/test.jpg';
        render(<InputFileForm onChange={mockOnChange} preview={fakeUrl} />);

        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', fakeUrl);
    });

    it('ha de deshabilitar tant el botó com l\'input si es passa la prop disabled', () => {
        const { container } = render(<InputFileForm onChange={mockOnChange} disabled={true} />);

        expect(screen.getByRole('button')).toBeDisabled();
        expect(getInput(container)).toBeDisabled();
    });
});