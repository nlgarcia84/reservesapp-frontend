// hooks/useLoadingState.ts
import { useRef, useState } from 'react';

export function useLoadingState() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const successTimeoutRef = useRef<number | null>(null);

  const startLoading = () => {
    setShowSuccess(false);
    setError('');
    setIsLoading(true);
  };

  const stopLoading = (success: boolean) => {
    setTimeout(() => {
      setIsLoading(false);
      if (success) {
        setShowSuccess(true);
        if (successTimeoutRef.current)
          window.clearTimeout(successTimeoutRef.current);
        successTimeoutRef.current = window.setTimeout(
          () => setShowSuccess(false),
          2000,
        );
      }
    }, 1500);
  };

  return { isLoading, showSuccess, error, setError, startLoading, stopLoading };
}
