import { render, screen, fireEvent } from '@testing-library/react';
import { RoomList } from './RoomList';
import { Room } from '@/app/services/rooms';

jest.mock('@/app/services/rooms', () => ({
    deleteRoom: jest.fn(),
}));

const mockRooms: Room[] = [
    {
        id: 1,
        name: 'Sala A',
        capacity: 10,
        description: 'Descripció A',
        equipment: ['projector', 'tv'],
        imageUrl: null,
        hasProjector: true,
        hasWhiteboard: false,
        hasTv: true,
        hasAirConditioning: false
    },
    {
        id: 2,
        name: 'Sala B',
        capacity: 5,
        description: 'Descripció B',
        equipment: ['ac'],
        imageUrl: 'http://imatge.com/foto.jpg',
        hasProjector: false,
        hasWhiteboard: false,
        hasTv: false,
        hasAirConditioning: true
    }
];

describe('Component RoomList', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('ha de mostrar la llista de sales', () => {
        render(<RoomList rooms={mockRooms} isAdmin={true} onRefresh={jest.fn()} />);

        expect(screen.getByText('Sala A')).toBeInTheDocument();
        expect(screen.getByText('Sala B')).toBeInTheDocument();
    });

    it('ha de mostrar un missatge quan no hi ha sales', () => {
        render(<RoomList rooms={[]} isAdmin={true} onRefresh={jest.fn()} />);

        expect(screen.getByText(/No hi ha sales disponibles en aquest moment/i)).toBeInTheDocument();
    });

    it('ha de canviar de pàgina en clicar les fletxes', () => {
        // Creem 10 sales per assegurar-nos que hi hagi 2 pàgines (itemsPerPage = 6)
        const manyRooms = Array.from({ length: 10 }, (_, i) => ({
            ...mockRooms[0],
            id: i,
            name: `Sala ${i}`
        }));

        render(<RoomList rooms={manyRooms} isAdmin={false} onRefresh={jest.fn()} />);

        // Comprovem que estem a la primera pàgina
        expect(screen.getByText(/Pàgina 1 de 2/i)).toBeInTheDocument();

        // Seleccionem tots els botons. El botó 0 és enrere i el 1 és endavant
        const paginationButtons = screen.getAllByRole('button');
        const nextButton = paginationButtons[1];

        fireEvent.click(nextButton);

        // Comprovem que hem passat a la segona pàgina
        expect(screen.getByText(/Pàgina 2 de 2/i)).toBeInTheDocument();
    });
});