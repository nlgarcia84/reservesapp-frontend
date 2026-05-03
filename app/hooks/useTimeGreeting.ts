import { useEffect, useState } from 'react';

/**
 * Retorna la salutació i la icona segons l'hora del dia.
 *
 * Franges horàries:
 * - 05:00 - 11:59: Bon dia
 * - 12:00 - 19:59: Bona tarda
 * - 20:00 - 04:59: Bona nit
 *
 * @returns Objecte amb greeting i icon.
 */
const getGreeting = () => {
  // Agafem l'hora actual (0-23)
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return { greeting: 'Bon dia', icon: '🌅' };
  } else if (hour >= 12 && hour < 20) {
    return { greeting: 'Bona tarda', icon: '☀️' };
  } else {
    return { greeting: 'Bona nit', icon: '🌙' };
  }
};

/**
 * Hook que actualitza la salutació dinàmica segons l'hora del dia.
 *
 * - Calcula el valor inicial en muntar el component.
 * - Recalcula la salutació cada minut.
 * - Neteja l'interval en desmuntar.
 *
 * Exemple d'ús:
 * ```typescript
 * const { greeting, icon } = useTimeGreeting();
 * return <h1>{icon} {greeting}, usuari!</h1>;
 * ```
 *
 * @returns Objecte amb `greeting` i `icon`.
 */

// export: permet usar aquest hook en altres fitxers
export const useTimeGreeting = () => {
  // Inicialitzem amb la salutació corresponent al moment actual
  const initialGreeting = getGreeting();
  const [greeting, setGreeting] = useState(initialGreeting.greeting);
  const [icon, setIcon] = useState(initialGreeting.icon);

  // Aquest efecte s'executa només en muntar el component
  useEffect(() => {
    // Actualitza la salutació i la icona
    const updateGreeting = () => {
      const { greeting: newGreeting, icon: newIcon } = getGreeting();
      setGreeting(newGreeting);
      setIcon(newIcon);
    };

    // Recalcula cada minut
    const interval = setInterval(updateGreeting, 60000);

    // Netegem l'interval en desmuntar
    return () => clearInterval(interval);
  }, []); // Amb dependències buides, es dispara una sola vegada

  // Retorna la salutació i la icona actuals
  return { greeting, icon };
};
