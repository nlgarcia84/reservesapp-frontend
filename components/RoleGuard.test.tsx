import { render, screen, waitFor } from '@testing-library/react';
import { RoleGuard } from './RoleGuard';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';

// Fem mock del router
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

// Fem mock del hook d'autenticació
jest.mock('@/app/hooks/useAuth', () => ({
    useAuth: jest.fn(),
}));

describe('Component RoleGuard', () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
        });
    });

    it('ha de mostrar "Carregant..." inicialment', () => {
        (useAuth as jest.Mock).mockReturnValue({ token: 'token123', role: 'admin' });

        render(
            <RoleGuard allowedRoles={['admin']}>
                <div>Contingut protegit</div>
            </RoleGuard>
        );

        expect(screen.getByText('Carregant...')).toBeInTheDocument();
    });

    it('ha de redirigir a /login si no hi ha token', async () => {
        (useAuth as jest.Mock).mockReturnValue({ token: null, role: null });

        render(
            <RoleGuard allowedRoles={['admin']}>
                <div>Contingut protegit</div>
            </RoleGuard>
        );

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/login');
        });
    });

    it('ha de redirigir a /login si hi ha token però no hi ha rol', async () => {
        (useAuth as jest.Mock).mockReturnValue({ token: 'token123', role: null });

        render(
            <RoleGuard allowedRoles={['admin']}>
                <div>Contingut protegit</div>
            </RoleGuard>
        );

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/login');
        });
    });

    it('ha de mostrar el contingut si l\'usuari té el rol permès', async () => {
        (useAuth as jest.Mock).mockReturnValue({ token: 'token123', role: 'admin' });

        render(
            <RoleGuard allowedRoles={['admin']}>
                <div data-testid="contingut-protegit">Zona VIP</div>
            </RoleGuard>
        );

        await waitFor(() => {
            expect(screen.getByTestId('contingut-protegit')).toBeInTheDocument();
            expect(screen.getByText('Zona VIP')).toBeInTheDocument();
        });
    });

    it('ha d\'acceptar rols escrits en majúscules (ex: ADMIN) gràcies a la normalització', async () => {
        (useAuth as jest.Mock).mockReturnValue({ token: 'token123', role: 'ADMIN' });

        render(
            <RoleGuard allowedRoles={['admin']}>
                <div>Zona VIP</div>
            </RoleGuard>
        );

        await waitFor(() => {
            expect(screen.getByText('Zona VIP')).toBeInTheDocument();
        });
    });

    it('ha de redirigir l\'admin al seu dashboard si intenta accedir a una ruta d\'empleat', async () => {
        (useAuth as jest.Mock).mockReturnValue({ token: 'token123', role: 'admin' });

        render(
            <RoleGuard allowedRoles={['employee']}>
                <div>Zona d&apos;empleats</div>
            </RoleGuard>
        );

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/dashboard/admin');
        });
    });

    it('ha de redirigir l\'empleat al seu dashboard si intenta accedir a una ruta d\'admin', async () => {
        (useAuth as jest.Mock).mockReturnValue({ token: 'token123', role: 'employee' });

        render(
            <RoleGuard allowedRoles={['admin']}>
                <div>Zona d&apos;administradors</div>
            </RoleGuard>
        );

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/dashboard/employee');
        });
    });
});