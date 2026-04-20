import { getRooms, getRoomById, updateRoom, deleteRoom } from './rooms';

// Fem un MOCK del mòdul de Supabase abans que s'utilitzi
jest.mock('@supabase/supabase-js', () => ({
    createClient: jest.fn(() => ({
        storage: {
            from: jest.fn().mockReturnThis(),
            upload: jest.fn(),
            getPublicUrl: jest.fn(() => ({ data: { publicUrl: 'http://fake.url' } })),
        },
    })),
}));

// Mock del fetch global
global.fetch = jest.fn();

describe('Rooms Service', () => {
    const mockToken = 'test-token';

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => { });

        // Assegurem que les variables d'entorn existeixen durant l'execució del test
        process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://fake-url.supabase.co';
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'fake-key';
        process.env.NEXT_PUBLIC_API_URL = 'https://api.test';
    });

    describe('getRooms', () => {
        it("ha d'obtenir les sales i mapejar els booleans correctament", async () => {
            const mockBackendRooms = [
                {
                    id: 1,
                    name: 'Sala Alpha',
                    capacity: 10,
                    has_tv: true,
                    has_projector: false,
                    has_whiteboard: true,
                    has_air_conditioning: false,
                }
            ];

            (fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => mockBackendRooms,
            });

            const rooms = await getRooms(mockToken);

            expect(rooms[0].hasTv).toBe(true);
            expect(rooms[0].equipment).toContain('tv');
            expect(rooms[0].equipment).toContain('whiteboard');
        });

        it("ha de llançar un error si no hi ha token", async () => {
            await expect(getRooms(null)).rejects.toThrow('Token no disponible');
        });
    });

    describe('getRoomById', () => {
        it("ha de retornar una sala específica mapejada", async () => {
            const mockRoom = { id: 123, name: 'Sala VIP', capacity: 5, has_tv: true };

            (fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => mockRoom,
            });

            const room = await getRoomById(123, mockToken);
            expect(room.name).toBe('Sala VIP');
            expect(room.equipment).toContain('tv');
        });
    });

    describe('updateRoom', () => {
        it("ha de fer una petició PUT correctament", async () => {
            (fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => ({ success: true }),
            });

            await updateRoom('123', 'Nova', 10, ['tv'], 'desc', mockToken, undefined, '');

            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('/rooms/123'),
                expect.objectContaining({ method: 'PUT' })
            );
        });
    });

    describe('deleteRoom', () => {
        it("ha de fer una petició DELETE", async () => {
            (fetch as jest.Mock).mockResolvedValue({ ok: true });

            await deleteRoom(123, mockToken);

            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('/rooms/123'),
                expect.objectContaining({ method: 'DELETE' })
            );
        });
    });
});