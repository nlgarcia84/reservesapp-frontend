// hooks/useLoadingState.ts
// Hook personalitzat per gestionar l'estat de càrrega, èxit i errors durant operacions asíncrones
import { useRef, useState } from 'react';

export function useLoadingState() {
  // Estat que indica si una operació està en curs
  const [isLoading, setIsLoading] = useState(false);
  // Estat que indica si l'operació ha finalitzat amb èxit
  const [showSuccess, setShowSuccess] = useState(false);
  // Missatge d'error si l'operació va malament
  const [error, setError] = useState('');
  // Referència mutable per al timeout que amaga el missatge d'èxit
  const successTimeoutRef = useRef<number | null>(null);

  // Inicia l'estat de càrrega: neteja els missatges d'error i èxit, activa la càrrega
  const startLoading = () => {
    setShowSuccess(false);
    setError('');
    setIsLoading(true);
  };

  // Finalitza l'estat de càrrega: espera 1.5s i després mostra un missatge d'èxit durant 2s si success=true
  const stopLoading = (success: boolean) => {
    setTimeout(() => {
      setIsLoading(false);
      if (success) {
        // Mostra el missatge d'èxit
        setShowSuccess(true);
        // Neteja el timeout anterior si existeix
        if (successTimeoutRef.current)
          window.clearTimeout(successTimeoutRef.current);
        // Estableix un timeout de 2 segons per amagar el missatge
        successTimeoutRef.current = window.setTimeout(
          () => setShowSuccess(false),
          2000,
        );
      }
    }, 1500);
  };

  // Retorna tots els estats i funcions necessàries per gestionar càrregues i missatges
  return { isLoading, showSuccess, error, setError, startLoading, stopLoading };
}
