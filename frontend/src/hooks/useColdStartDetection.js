import { useState, useEffect } from 'react';

/**
 * Hook personalizado para gerenciar estados de cold start
 * Detecta quando uma requisição está demorando mais que o normal
 * e mostra feedback apropriado para o usuário
 */
export const useColdStartDetection = (threshold = 3000) => {
  const [isColdStart, setIsColdStart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let coldStartTimer;

    if (isLoading) {
      // Se o loading durar mais que o threshold, considera cold start
      coldStartTimer = setTimeout(() => {
        setIsColdStart(true);
      }, threshold);
    } else {
      setIsColdStart(false);
    }

    return () => {
      if (coldStartTimer) {
        clearTimeout(coldStartTimer);
      }
    };
  }, [isLoading, threshold]);

  const startLoading = () => {
    setIsLoading(true);
    setIsColdStart(false);
  };

  const stopLoading = () => {
    setIsLoading(false);
    setIsColdStart(false);
  };

  return {
    isColdStart,
    isLoading,
    startLoading,
    stopLoading
  };
};

export default useColdStartDetection;