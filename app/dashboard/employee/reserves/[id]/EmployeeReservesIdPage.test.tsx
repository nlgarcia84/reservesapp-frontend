import { render, screen, waitFor, fireEvent } from '@testing-library/react';

// 1. Configuració de variables d'entorn 
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://fake-url.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'fake-anon-key';

import DetallReservaPage from './page';
import { useAuth } from '@/app/hooks/useAuth';
import { getRoomById } from '@/app/services/rooms';
import { getUsers } from '@/app/services/users';
import { getReservationsByRoom, createReservation } from '@/app/services/reservation';
import { useParams, useSearchParams, useRouter } from 'next/navigation';

// 2. Mock de Supabase
jest.mock('@supabase/supabase-js', () => ({
    createClient: jest.fn(() => ({
        storage: {
            from: jest.fn(() => ({
                getPublicUrl: jest.fn(() => ({ data: { publicUrl: 'http://fake-img.com' } })),
            })),
        },
    })),
}));

// 3. Mocks de Navegació
jest.mock('next/navigation', () => ({
    useParams: jest.fn(),
    useSearchParams: jest.fn(),
    useRouter: jest.fn(),
}));

// 4. Mocks de Serveis i Hooks
jest.mock('@/app/hooks/useAuth');
jest.mock('@/app/services/rooms');
jest.mock('@/app/services/users');
jest.mock('@/app/services/reservation');

// 5. Mock de Next Image 
jest.mock('next/image', () => ({
    __esModule: true,
    default: ({ src, alt, className }: {
        src: string;
        alt: string;
        className?: string;
        fill?: boolean;
        priority?: boolean
    }) => {
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={src} alt={alt} className={className} />;
    },
}));

describe('DetallReservaPage (Empleat)', () => {
    const mockId = '101';
    const mockToken = 'fake-token-456';
    const mockUserId = '7';
    const mockRouter = { push: jest.fn(), replace: jest.fn(), refresh: jest.fn() };

    const mockRoom = {
        id: 101,
        name: 'Sala Creativa',
        capacity: 8,
        description: 'Sala amb molta llum',
        hasTv: true,
        hasProjector: false,
        imageUrl: '/path/to/img.jpg',
    };

    const mockUsers = [
        { id: '1', name: 'Joan Test', email: 'joan@test.com' },
        { id: '7', name: 'Jo Mateix', email: 'jo@test.com' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (useParams as jest.Mock).mockReturnValue({ id: mockId });
        (useSearchParams as jest.Mock).mockReturnValue({ get: jest.fn().mockReturnValue(null) });
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (useAuth as jest.Mock).mockReturnValue({ token: mockToken, userId: mockUserId, role: 'EMPLOYEE' });

        (getRoomById as jest.Mock).mockResolvedValue(mockRoom);
        (getUsers as jest.Mock).mockResolvedValue(mockUsers);
        (getReservationsByRoom as jest.Mock).mockResolvedValue([]);
    });

    it('ha de mostrar l\'estat de càrrega i després els detalls de la sala', async () => {
        render(<DetallReservaPage />);

        // El spinner de càrrega té la classe animate-spin
        expect(document.querySelector('.animate-spin')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText(/Sala Creativa/i)).toBeInTheDocument();
            expect(screen.getByText(/8 persones/i)).toBeInTheDocument();
        });
    });

    it('ha de validar que la data mínima del calendari és avui', async () => {
        render(<DetallReservaPage />);
        const today = new Date().toISOString().split('T')[0];

        await waitFor(() => {
            const dateInput = screen.getByLabelText(/Data/i) as HTMLInputElement;
            expect(dateInput.min).toBe(today);
        });
    });

    it('ha de bloquejar (desactivar) hores que ja estan reservades', async () => {
        const todayStr = new Date().toISOString().split('T')[0];
        const mockReservations = [{
            id: 500,
            date: todayStr,
            startTime: '10:00',
            endTime: '11:00',
            room_id: 101,
            user_id: 1
        }];
        (getReservationsByRoom as jest.Mock).mockResolvedValue(mockReservations);

        render(<DetallReservaPage />);

        await waitFor(() => {
            const dateInput = screen.getByLabelText(/Data/i);
            fireEvent.change(dateInput, { target: { value: todayStr } });
        });

        // Busquem l'opció de les 10:00 que conté el text "Ocupada"
        const option10 = screen.getAllByRole('option').find(opt =>
            opt.textContent?.includes('10:00') && opt.textContent?.includes('Ocupada')
        );

        expect(option10).toBeDisabled();
    });

    it('ha de realitzar una reserva correctament quan s\'omple el formulari', async () => {
        (createReservation as jest.Mock).mockResolvedValue({ id: 999 });
        window.alert = jest.fn();

        render(<DetallReservaPage />);

        await waitFor(() => {
            const dateInput = screen.getByLabelText(/Data/i);
            fireEvent.change(dateInput, { target: { value: '2026-12-01' } });

            const selects = screen.getAllByRole('combobox');
            fireEvent.change(selects[0], { target: { value: '12:00' } });
            fireEvent.change(selects[1], { target: { value: '13:00' } });
        });

        const submitButton = screen.getByRole('button', { name: /confirmar reserva/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(createReservation).toHaveBeenCalledWith(
                expect.objectContaining({
                    room_id: 101,
                    start_time: '12:00',
                    end_time: '13:00',
                    guests: expect.arrayContaining([Number(mockUserId)])
                }),
                mockToken
            );
            expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('correctament'));
        });
    });

    it('ha de filtrar usuaris a la cerca d\'assistents i permetre seleccionar-ne un', async () => {
        render(<DetallReservaPage />);

        await waitFor(() => {
            const searchInput = screen.getByPlaceholderText(/Cerca companys/i);
            fireEvent.change(searchInput, { target: { value: 'Joan' } });
        });

        const userButton = screen.getByText(/Joan Test/i);
        fireEvent.click(userButton);

        // Verifiquem que apareix el tag de l'usuari seleccionat
        expect(screen.getByText('Joan Test')).toBeInTheDocument();
    });
});