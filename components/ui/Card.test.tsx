import { render, screen } from '@testing-library/react';
import { Card } from './Card'; 
import { Hotel } from 'lucide-react'; // Utilitzem una icona de prova de lucide-react

describe('Component Card', () => {
  it('ha de renderitzar el títol i el contingut intern correctament', () => {
    // 1. Preparar i Actuar: Renderitzem la targeta simulant com es veuria a la pantalla
    render(
      <Card title="Sala de Juntes" icon={Hotel}>
        <p>Capacitat: 10 persones</p>
      </Card>
    );

    // 2. Afirmar: Comprovem que el text del títol i del contingut existeixen al document
    expect(screen.getByText('Sala de Juntes')).toBeInTheDocument();
    expect(screen.getByText('Capacitat: 10 persones')).toBeInTheDocument();
  });

  it('ha de renderitzar el subtítol si se li passa per props', () => {
    // Renderitzem una targeta que inclou la propietat (prop) opcional "subtitle"
    render(
      <Card title="Sala B" icon={Hotel} subtitle="Planta baixa">
        <p>Contingut de prova</p>
      </Card>
    );

    // Comprovem que el subtítol també es mostra correctament
    expect(screen.getByText('Planta baixa')).toBeInTheDocument();
  });
});