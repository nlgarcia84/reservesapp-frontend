import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "./page"; 
import { useRouter } from "next/navigation";
import { login } from "@/app/services/auth";
import { saveToken } from "@/app/services/saveToken";

// --- 1. Mocks de les dependències externes ---
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

jest.mock("@/app/services/auth", () => ({
    login: jest.fn(),
}));

jest.mock("@/app/services/saveToken", () => ({
    saveToken: jest.fn(),
}));

describe("LoginPage", () => {
    const mockReplace = jest.fn();
    const mockPush = jest.fn();

    beforeEach(() => {
        // Netegem els mocks abans de cada test perquè no interfereixin entre ells
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({
            replace: mockReplace,
            push: mockPush,
        });
    });

    // --- 2. Tests de UI (Renderitzat bàsic) ---
    it("hauria de renderitzar els elements del formulari correctament", () => {
        render(<LoginPage />);

        expect(screen.getByText("Inicia sessió")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Contrasenya")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
    });

    it("hauria de permetre escriure als inputs d'email i contrasenya", () => {
        render(<LoginPage />);

        const emailInput = screen.getByPlaceholderText("Email");
        const passwordInput = screen.getByPlaceholderText("Contrasenya");

        fireEvent.change(emailInput, { target: { value: "usuari@test.com" } });
        fireEvent.change(passwordInput, { target: { value: "123456" } });

        expect(emailInput).toHaveValue("usuari@test.com");
        expect(passwordInput).toHaveValue("123456");
    });

    it("hauria de canviar la visibilitat de la contrasenya", () => {
        render(<LoginPage />);

        const passwordInput = screen.getByPlaceholderText("Contrasenya");
        const toggleButton = screen.getByLabelText("Mostrar contrasenya");

        // Per defecte, l'input ha de ser de tipus "password"
        expect(passwordInput).toHaveAttribute("type", "password");

        // Clic per mostrar la contrasenya
        fireEvent.click(toggleButton);
        expect(passwordInput).toHaveAttribute("type", "text");
        expect(screen.getByLabelText("Amagar contrasenya")).toBeInTheDocument();

        // Clic per tornar a amagar-la
        fireEvent.click(screen.getByLabelText("Amagar contrasenya"));
        expect(passwordInput).toHaveAttribute("type", "password");
    });

    // --- 3. Tests de Lògica i Funcionalitat ---
    it("hauria de fer login correctament com a ADMIN i redirigir al seu dashboard", async () => {
        // Simulem que el backend respon correctament
        (login as jest.Mock).mockResolvedValueOnce({
            token: "fake-jwt-token",
            role: "ADMIN",
            name: "Admin User",
        });

        render(<LoginPage />);

        // Omplim el formulari i fem submit
        fireEvent.change(screen.getByPlaceholderText("Email"), {
            target: { value: "admin@test.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Contrasenya"), {
            target: { value: "password" },
        });
        fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

        // Comprovem que s'han cridat les funcions correctes i s'ha fet la redirecció
        await waitFor(() => {
            expect(login).toHaveBeenCalledWith("admin@test.com", "password", false);
            expect(saveToken).toHaveBeenCalledWith(
                "fake-jwt-token",
                "ADMIN",
                "Admin User",
            );
            expect(mockReplace).toHaveBeenCalledWith("/dashboard/admin");
        });
    });

    it("hauria de fer login correctament com a EMPLOYEE i redirigir al seu dashboard", async () => {
        const consoleSpy = jest
            .spyOn(console, "error")
            .mockImplementation(() => { });
        // Simulem que el backend respon correctament però amb un altre rol
        (login as jest.Mock).mockResolvedValueOnce({
            token: "fake-jwt-token",
            role: "EMPLOYEE",
            name: "Employee User",
        });
        consoleSpy.mockRestore();

        render(<LoginPage />);

        fireEvent.change(screen.getByPlaceholderText("Email"), {
            target: { value: "emp@test.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Contrasenya"), {
            target: { value: "password" },
        });
        fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalledWith("/dashboard/employee");
        });
    });

    it("hauria de mostrar un missatge d'error si el login falla", async () => {
        // Simulem que el backend retorna un error
        (login as jest.Mock).mockRejectedValueOnce(
            new Error("Credencials incorrectes"),
        );

        render(<LoginPage />);

        fireEvent.change(screen.getByPlaceholderText("Email"), {
            target: { value: "wrong@test.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Contrasenya"), {
            target: { value: "wrongpass" },
        });
        fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

        // Comprovem que l'error es pinta per pantalla
        await waitFor(() => {
            expect(screen.getByText("Credencials incorrectes")).toBeInTheDocument();
            // Comprovem que NO s'ha guardat cap token ni s'ha redirigit
            expect(saveToken).not.toHaveBeenCalled();
            expect(mockReplace).not.toHaveBeenCalled();
        });
    });
});
