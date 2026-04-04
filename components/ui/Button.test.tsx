import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Component Button', () => {
    it('ha de renderitzar un botó normal amb el text proporcionat', () => {
        render(<Button>Fes clic</Button>);

        const boto = screen.getByRole('button', { name: 'Fes clic' });
        expect(boto).toBeInTheDocument();
    });

    it('ha de rebre i executar la funció onClick quan s\'hi fa clic', () => {
        const mockOnClick = jest.fn();
        render(<Button onClick={mockOnClick}>Fes clic</Button>);

        const boto = screen.getByRole('button', { name: 'Fes clic' });
        fireEvent.click(boto);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('ha de respectar l\'atribut disabled', () => {
        const mockOnClick = jest.fn();

        render(
            <Button disabled onClick={mockOnClick}>
                Botó apagat
            </Button>
        );

        const boto = screen.getByRole('button', { name: 'Botó apagat' });
        expect(boto).toBeDisabled();

        // Intentem fer clic
        fireEvent.click(boto);

        // Comprovem que la funció no s'ha executat
        expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('ha d\'afegir classes CSS extres sense esborrar les de per defecte', () => {
        render(<Button className="classe-especial-test">Botó</Button>);

        const boto = screen.getByRole('button', { name: 'Botó' });
        // Comprovem que hi és la nostra classe
        expect(boto).toHaveClass('classe-especial-test');
        // Comprovem que també hi ha una de les classes base (per exemple 'block')
        expect(boto).toHaveClass('block');
    });

    it('ha de passar la referència (ref) correctament a l\'element HTML', () => {
        // Creem un ref manual per simular el que faria un component pare
        const ref = React.createRef<HTMLButtonElement>();

        render(<Button ref={ref}>Botó amb Ref</Button>);

        // Comprovem que l'objecte ref s'ha enllaçat amb un element HTML de veritat
        expect(ref.current).toBeInstanceOf(HTMLButtonElement);
        expect(ref.current?.textContent).toBe('Botó amb Ref');
    });

    it('ha de renderitzar només el component fill si asChild és true', () => {
        render(
            <Button asChild>
                <a href="https://ioc.xtec.cat">Enllaç extern</a>
            </Button>
        );

        // No hi hauria d'haver cap etiqueta <button>
        expect(screen.queryByRole('button')).not.toBeInTheDocument();

        // Però sí que hi hauria d'haver el nostre enllaç
        const enllac = screen.getByRole('link', { name: 'Enllaç extern' });
        expect(enllac).toBeInTheDocument();
        expect(enllac).toHaveAttribute('href', 'https://ioc.xtec.cat');
    });
});