import { render, screen, fireEvent } from '@testing-library/react';
import { AdminSidebar } from './AdminSidebar';
import { usePathname } from 'next/navigation';

// Mock de la navegació de Next.js
jest.mock('next/navigation', () => ({
    usePathname: jest.fn(),
}));

describe('Component AdminSidebar', () => {
    const mockOnClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (usePathname as jest.Mock).mockReturnValue('/dashboard/admin');
    });

    it('ha de renderitzar-se correctament quan està obert', () => {
        render(<AdminSidebar open={true} onClose={mockOnClose} />);

        const usuariElements = screen.getAllByText((content, node) => {
            return node?.textContent === 'Usuari';
        });

        expect(usuariElements[0]).toBeInTheDocument();
        expect(screen.getByAltText(/perfil/i)).toBeInTheDocument();
    });

    it('ha de mostrar els enllaços de gestió d\'administrador', () => {
        render(<AdminSidebar open={true} onClose={mockOnClose} />);

        // Ajustem als textos reals que han sortit a la consola
        expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
        expect(screen.getByText(/gestió de sales/i)).toBeInTheDocument();
        expect(screen.getByText(/gestió d'usuaris/i)).toBeInTheDocument();
        expect(screen.getByText(/gestió reserves/i)).toBeInTheDocument();
    });

    it('ha de cridar onClose quan es clica el botó "Amaga"', () => {
        render(<AdminSidebar open={true} onClose={mockOnClose} />);

        // El botó de tancar segons el DOM real es diu "Amaga"
        const closeButton = screen.getByRole('button', { name: /amaga/i });

        fireEvent.click(closeButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('ha d\'aplicar les classes de visibilitat segons la prop open', () => {
        const { rerender, container } = render(<AdminSidebar open={true} onClose={mockOnClose} />);

        const aside = container.querySelector('aside');
        // Verifiquem que NO té la classe translate-x-full quan està obert
        expect(aside).not.toHaveClass('-translate-x-full');

        rerender(<AdminSidebar open={false} onClose={mockOnClose} />);
        // Verifiquem que SÍ la té quan està tancat
        expect(aside).toHaveClass('-translate-x-full');
    });
});