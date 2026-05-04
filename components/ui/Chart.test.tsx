import { render, screen } from "@testing-library/react"
import * as React from "react"
import { Bar, BarChart } from "recharts"
import { ChartContainer, ChartTooltipContent } from "./Chart"

// 1. Mock de ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))

// 2. Mock de ResponsiveContainer corregit
jest.mock("recharts", () => {
    const originalModule = jest.requireActual("recharts")
    return {
        ...originalModule,
        ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
            <div style={{ width: "800px", height: "400px" }}>{children}</div>
        ),
    }
})

describe("Component Chart (UI)", () => {
    const chartData = [
        { month: "Gener", sales: 100, profit: 50 },
        { month: "Febrer", sales: 200, profit: 80 },
    ]

    const chartConfig = {
        sales: {
            label: "Vendes Totals",
            color: "#2563eb",
        },
        profit: {
            label: "Benefici",
            color: "#60a5fa",
        },
    }

    it("ha de renderitzar el contenidor del gràfic correctament", () => {
        const { container } = render(
            <ChartContainer config={chartConfig}>
                <BarChart data={chartData}>
                    <Bar dataKey="sales" fill="var(--color-sales)" />
                </BarChart>
            </ChartContainer>
        )

        const chartNode = container.querySelector('[data-slot="chart"]')
        expect(chartNode).toBeInTheDocument()
        expect(chartNode).toHaveAttribute("data-chart")
    })

    it("ha de generar les variables CSS de color basades en la configuració", () => {
        const { container } = render(
            <ChartContainer config={chartConfig}>
                <BarChart data={chartData}>
                    <Bar dataKey="sales" />
                </BarChart>
            </ChartContainer>
        )

        const styleTag = container.querySelector("style")
        expect(styleTag?.innerHTML).toContain("--color-sales: #2563eb")
        expect(styleTag?.innerHTML).toContain("--color-profit: #60a5fa")
    })

    it("ha de llançar un error si s'usa el contingut del tooltip fora del contenidor", () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => { })

        // Forcem el render d'un component que usa useChart sense el provider
        const BrokenTest = () => <ChartTooltipContent active payload={[]} />

        expect(() => render(<BrokenTest />)).toThrow(
            "useChart must be used within a <ChartContainer />"
        )

        consoleSpy.mockRestore()
    })

    it("ha de renderitzar el contingut del Tooltip correctament quan està actiu", () => {
        const mockPayload = [
            {
                dataKey: "sales",
                name: "sales",
                value: 150,
                color: "#2563eb",
                payload: { month: "Gener" },
            },
        ];

        render(
            <ChartContainer config={chartConfig}>

                <ChartTooltipContent
                    active
                    payload={mockPayload as unknown as []}
                    label="Gener"
                />
            </ChartContainer>
        );
        // Verifiquem que el label de la configuració s'ha aplicat correctament
        expect(screen.getByText(/Vendes Totals/i)).toBeInTheDocument();
        // Verifiquem que el valor apareix renderitzat
        expect(screen.getByText("150")).toBeInTheDocument();
    });

    it("ha d'aplicar classes personalitzades al contenidor", () => {
        const { container } = render(
            <ChartContainer config={chartConfig} className="custom-chart-class">
                <BarChart data={chartData}>
                    <Bar dataKey="sales" />
                </BarChart>
            </ChartContainer>
        )

        const chartNode = container.querySelector('[data-slot="chart"]')
        expect(chartNode).toHaveClass("custom-chart-class")
    })
})