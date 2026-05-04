import { signup } from './registration';

// 1. Simulem el fetch global
global.fetch = jest.fn();

describe('Servei de Registration (signup)', () => {
    const mockEmail = 'test@example.com';
    const mockPassword = 'password123';
    const mockName = 'Test User';
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('ha de cridar a l\'endpoint correcte amb les dades adequades', async () => {
        const mockResponse = { token: 'fake-token', role: 'EMPLOYEE' };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await signup(mockEmail, mockPassword, mockName);

        // Verifiquem que fetch s'ha cridat correctament
        expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: mockEmail, password: mockPassword, name: mockName }),
        });

        // Verifiquem que el servei retorna les dades del JSON
        expect(result).toEqual(mockResponse);
    });

    it('ha de llançar un error si la resposta no és ok', async () => {
        const errorMessage = 'L\'usuari ja existeix';

        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: errorMessage }),
        });

        // Verifiquem que la promesa es rebutja amb el missatge del backend
        await expect(signup(mockEmail, mockPassword, mockName)).rejects.toThrow(errorMessage);
    });

    it('ha de llançar un error genèric si no hi ha missatge a la resposta d\'error', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: async () => ({}), // Resposta sense missatge d'error específic
        });

        await expect(signup(mockEmail, mockPassword, mockName)).rejects.toThrow('Error en login');
    });
});