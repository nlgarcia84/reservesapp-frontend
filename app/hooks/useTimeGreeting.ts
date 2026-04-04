import { useEffect, useState } from 'react';

/**
 * Funció auxiliar que retorna el salut i icona apropiat segons l'hora del dia
 *
 * Horaris:
 * - 05:00 - 11:59 → "Bon dia" 🌅
 * - 12:00 - 17:59 → "Bona tarda" ☀️
 * - 18:00 - 20:59 → "Bona nit" 🌆
 * - 21:00 - 04:59 → "Bona nit" 🌙
 *
 * @returns {Object} Objecte amb propietats greeting (string) i icon (emoji)
 */
const getGreeting = () => {
  // crea un objecte Data amb la data/hora actual
  // extreu només l'hora (0-23)
  // guarda l'hora en una variable
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
 * Hook personalitzat que gestiona els saludos dinàmics segons la hora del dia
 *
 * Característiques:
 * - Calcula el salut correcte al carregador el component (sense flash)
 * - Actualitza automàticament cada minut per detectar canvis d'hora
 * - Neteja l'interval al desmontar el component
 *
 * Exemple d'ús:
 * ```typescript
 * const { greeting, icon } = useTimeGreeting();
 * return <h1>{icon} {greeting}, usuari!</h1>; // 🌅 Bon dia, usuari!
 * ```
 *
 * @returns {Object} Objecte amb dos propietats:
 *   - greeting: string amb el salut en català (Bon dia, Bona tarda, Bona nit)
 *   - icon: string amb l'emoji corresponent a la part del dia
 */

// export: permet usar aquest hook en altres fitxers
export const useTimeGreeting = () => {
  // Inicialitza els estats amb el salut correcte en aquest moment
  // Crida getGreeting() una sola vegada i destrueix l'objecte
  const initialGreeting = getGreeting();
  const [greeting, setGreeting] = useState(initialGreeting.greeting);
  const [icon, setIcon] = useState(initialGreeting.icon);

  // Effect que s'executa una sola vegada al montar el component
  useEffect(() => {
    // Funció per actualitzar el salut i l'icona
    const updateGreeting = () => {
      const { greeting: newGreeting, icon: newIcon } = getGreeting();
      setGreeting(newGreeting);
      setIcon(newIcon);
    };

    // Configura un interval que s'executa cada 60 segons (1 minut)
    const interval = setInterval(updateGreeting, 60000);

    // Funció de neteja: es crida quan el component es desmonta
    // Neteja l'interval per evitar memory leaks
    return () => clearInterval(interval);
  }, []); // [] significa que s'executa només una vegada al montar

  // Retorna l'objecte amb el salut i la icona actuals
  return { greeting, icon };
};
