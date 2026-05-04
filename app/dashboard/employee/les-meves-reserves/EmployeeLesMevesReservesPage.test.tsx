import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ReactNode } from 'react';

// 1. Configuració de variables d'entorn
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://fake-url.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'fake-anon-key';

import LesMevesReservesPage from './page';
import { useAuth } from '@/app/hooks/useAuth';
import { getMyReservations, deleteReservation } from '@/app/services/reservation';
import { useRouter } from 'next/navigation';

// 2. Mocks de Navegació i Serveis
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('@/app/hooks/useAuth');
jest.mock('@/app/services/reservation');

// Mock de Framer Motion per evitar errors amb les animacions
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => (
            <div {...props}>{children}</div>
        ),
    },
    AnimatePresence: ({ children }: { children: ReactNode }) => children,
}));

describe('LesMevesReservesPage (Agenda Empleat)', () => {
    const mockToken = 'token-123';
    const mockUserId = 'user-organitzador';
    const mockRouter = { push: jest.fn(), refresh: jest.fn() };

    // Dades de prova: una reserva pròpia i una on som convidats
    const mockReserves = [
        {
            id: 1,
            date: '2026-12-20', // Data futura per passar el filtre del component
            startTime: '10:00',
            endTime: '11:00',
            userId: 'user-organitzador', // Coincideix amb mockUserId
            room: { id: 101, name: 'Sala Alpha' },
            guests: [1, 2]
        },
        {
            id: 2,
            date: '2026-12-21',
            startTime: '12:00',
            endTime: '13:00',
            userId: 'user-altre', // No coincideix (som convidats)
            room: { id: 102, name: 'Sala Beta' },
            guests: [1, 2, 3]
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (useAuth as jest.Mock).mockReturnValue({ token: mockToken, userId: mockUserId });
        (getMyReservations as jest.Mock).mockResolvedValue(mockReserves);

        // Mock de window.confirm i alert
        window.confirm = jest.fn(() => true);
        window.alert = jest.fn();
    });

    it('ha de carregar i mostrar totes les reserves inicialment', async () => {
        render(<LesMevesReservesPage />);

        await waitFor(() => {
            expect(screen.getByText('Sala Alpha')).toBeInTheDocument();
            expect(screen.getByText('Sala Beta')).toBeInTheDocument();
        });

        // Comprovem que es distingeix entre organitzador i convidat
        expect(screen.getByText(/ORGANITZADOR/i)).toBeInTheDocument();
        expect(screen.getAllByText(/CONVIDAT/i).length).toBeGreaterThanOrEqual(1);
    });

    it('ha de filtrar només les reserves organitzades per mi', async () => {
        render(<LesMevesReservesPage />);

        await waitFor(() => screen.getByText('Sala Alpha'));

        const mineButton = screen.getByText('LES MEVES');
        fireEvent.click(mineButton);

        expect(screen.getByText('Sala Alpha')).toBeInTheDocument();
        expect(screen.queryByText('Sala Beta')).not.toBeInTheDocument();
    });

    it('ha de filtrar només les reserves on sóc convidat', async () => {
        render(<LesMevesReservesPage />);

        await waitFor(() => screen.getByText('Sala Beta'));

        const invitedButton = screen.getByText('CONVIDADES');
        fireEvent.click(invitedButton);

        expect(screen.getByText('Sala Beta')).toBeInTheDocument();
        expect(screen.queryByText('Sala Alpha')).not.toBeInTheDocument();
    });

    it('ha de mostrar "Només lectura" en les reserves on sóc convidat', async () => {
        render(<LesMevesReservesPage />);

        await waitFor(() => screen.getByText('Sala Beta'));

        const readOnlyLabel = screen.getByText(/Només lectura/i);
        expect(readOnlyLabel).toBeInTheDocument();
    });

    it('ha de cridar a deleteReservation quan l\'organitzador cancel·la una reserva', async () => {
        render(<LesMevesReservesPage />);

        await waitFor(() => screen.getByText('Sala Alpha'));

        // Busquem el botó de paperera (Trash2). En el component no té text, busquem pel títol o rol.
        const deleteButton = screen.getAllByTitle('Cancel·lar reserva')[0];
        fireEvent.click(deleteButton);

        expect(window.confirm).toHaveBeenCalled();
        await waitFor(() => {
            expect(deleteReservation).toHaveBeenCalledWith(1, mockToken);
            expect(window.alert).toHaveBeenCalledWith('Reserva cancel·lada correctament');
        });
    });

    it('ha de redirigir a la pàgina d\'edició en clicar el botó d\'editar', async () => {
        render(<LesMevesReservesPage />);

        await waitFor(() => screen.getByText('Sala Alpha'));

        const editButton = screen.getAllByTitle('Editar reserva')[0];
        fireEvent.click(editButton);

        expect(mockRouter.push).toHaveBeenCalledWith(
            expect.stringContaining('/dashboard/employee/reserves/101?editReservationId=1')
        );
    });

    it('ha de mostrar un missatge si no hi ha reserves per al filtre seleccionat', async () => {
        (getMyReservations as jest.Mock).mockResolvedValue([]);
        render(<LesMevesReservesPage />);

        await waitFor(() => {
            expect(screen.getByText(/No hi ha reserves/i)).toBeInTheDocument();
        });
    });
});