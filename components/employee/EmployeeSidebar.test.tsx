import { render, screen, fireEvent } from '@testing-library/react';
import { EmployeeSidebar } from './EmployeeSidebar';

// 1. Mock de next/navigation per evitar errors de ruter (ja que SidebarLayout usa Links)
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
    usePathname: () => '/dashboard/employee',
}));

// 2. Mock del hook d'autenticació que usa el SidebarLayout internament
jest.mock('@/app/hooks/useAuth', () => ({
    useAuth: () => ({
        name: 'Test Employee',
        role: 'EMPLOYEE',
    }),
}));

describe('Component EmployeeSidebar', () => {
    const mockOnClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('ha de renderitzar correctament quan està obert', () => {
        render(<EmployeeSidebar open={true} onClose={mockOnClose} />);

        // Comprovem que es veuen els textos propis de l'empleat
        expect(screen.getByText(/dashboard/i)).toBeInTheDocument();

        // CANVIEM "agenda de reserves" per "la meva agenda"
        expect(screen.getByText(/la meva agenda/i)).toBeInTheDocument();

        // Comprovem que NO es veuen enllaços d'administrador
        expect(screen.queryByText(/gestió de sales/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/gestió d'usuaris/i)).not.toBeInTheDocument();
    });

    it('ha de cridar a la funció onClose quan es clica el botó de tancar', () => {
        render(<EmployeeSidebar open={true} onClose={mockOnClose} />);

        // Busquem el botó que diu "Amaga" i simulem un clic
        const closeButton = screen.getByRole('button', { name: /amaga/i });
        fireEvent.click(closeButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('ha de passar el prop "open" correctament al SidebarLayout', () => {
        const { rerender } = render(<EmployeeSidebar open={false} onClose={mockOnClose} />);

        const sidebar = screen.getByRole('complementary');
        expect(sidebar).toHaveClass('-translate-x-full');

        rerender(<EmployeeSidebar open={true} onClose={mockOnClose} />);
        expect(sidebar).toHaveClass('translate-x-0');
    });
});