import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';

// 1. Configuració de variables d'entorn
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://fake-url.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'fake-anon-key';

import GestioReserves from './page';
import { useAuth } from '@/app/hooks/useAuth';
import { getAllReservations, deleteReservation } from '@/app/services/reservation';
import { useRouter } from 'next/navigation';

// 2. Mocks de Navegació i Serveis
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('@/app/hooks/useAuth');
jest.mock('@/app/services/reservation');

describe('AdminGestioReservesPage', () => {
    const mockToken = 'admin-token-123';
    const mockRouter = { push: jest.fn(), refresh: jest.fn() };

    const mockReserves = [
        {
            id: 10,
            date: '2026-05-10',
            startTime: '09:00',
            endTime: '10:00',
            userId: 'user-1',
            room: { id: 1, name: 'Sala Blava' }
        },
        {
            id: 11,
            date: '2026-05-11',
            startTime: '11:00',
            endTime: '12:00',
            userId: 'user-2',
            room: { id: 1, name: 'Sala Blava' } // Mateixa sala per provar agrupació
        },
        {
            id: 12,
            date: '2026-05-12',
            startTime: '15:00',
            endTime: '16:00',
            userId: 'user-3',
            room: { id: 2, name: 'Sala Vermella' }
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (useAuth as jest.Mock).mockReturnValue({ token: mockToken });
        (getAllReservations as jest.Mock).mockResolvedValue(mockReserves);

        // Mock de confirm i alert
        window.confirm = jest.fn(() => true);
        window.alert = jest.fn();
    });

    it('ha de mostrar l\'estat de càrrega inicialment', () => {
        render(<GestioReserves />);
        expect(screen.getByText(/Carregant sistema.../i)).toBeInTheDocument();
    });

    it('ha de carregar i agrupar les reserves per sala', async () => {
        render(<GestioReserves />);

        await waitFor(() => {
            // Verifiquem que surten els noms de les sales (títols d'agrupació)
            expect(screen.getByText('Sala Blava')).toBeInTheDocument();
            expect(screen.getByText('Sala Vermella')).toBeInTheDocument();
        });

        // Verifiquem que indica el nombre de sales actives correctament
        expect(screen.getByText(/2 sales actives/i)).toBeInTheDocument();

        // Verifiquem que hi ha les hores de les reserves
        expect(screen.getByText('09:00 - 10:00')).toBeInTheDocument();
        expect(screen.getByText('11:00 - 12:00')).toBeInTheDocument();
        expect(screen.getByText('15:00 - 16:00')).toBeInTheDocument();
    });

    it('ha de redirigir a la pàgina d\'edició d\'empleat en clicar editar', async () => {
        render(<GestioReserves />);

        await waitFor(() => screen.getByText('Sala Blava'));

        // Busquem els botons d'editar. Com que n'hi ha diversos, agafem el primer.
        const editButtons = screen.getAllByRole('button').filter(btn =>
            btn.innerHTML.includes('lucide-pencil')
        );

        fireEvent.click(editButtons[0]);

        // L'admin edita usant la mateixa vista que l'empleat
        expect(mockRouter.push).toHaveBeenCalledWith(
            '/dashboard/employee/reserves/1?editReservationId=10'
        );
    });

    it('ha de demanar confirmació i eliminar la reserva', async () => {
        render(<GestioReserves />);

        await waitFor(() => screen.getByText('Sala Vermella'));

        // Busquem els botons d'eliminar 
        const deleteButtons = screen.getAllByRole('button').filter(btn =>
            btn.innerHTML.includes('lucide-trash2')
        );

        fireEvent.click(deleteButtons[2]); // L'última reserva (id 12)

        expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining('administrador'));

        await waitFor(() => {
            expect(deleteReservation).toHaveBeenCalledWith(12, mockToken);
            // La reserva id 12 (Sala Vermella) hauria de desaparèixer de la llista
            expect(screen.queryByText('15:00 - 16:00')).not.toBeInTheDocument();
        });
    });

    it('ha de gestionar l\'error en cas que la càrrega falli', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        (getAllReservations as jest.Mock).mockRejectedValue(new Error('Fetch error'));

        render(<GestioReserves />);

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalled();
        });

        consoleSpy.mockRestore();
    });
});