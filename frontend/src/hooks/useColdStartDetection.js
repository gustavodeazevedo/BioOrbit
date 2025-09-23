import { useState, useEffect } from 'react';

/**
 * Hook personalizado para gerenciar estados de cold start
 * Detecta quando uma requisição está demorando mais que o normal
 * e mostra feedback apropriado para o usuário
 */
export const useColdStartDetection = (threshold = 3000, minDisplayTime = 800) => {
  const [isColdStart, setIsColdStart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStartTime, setLoadingStartTime] = useState(null);

  useEffect(() => {
    let coldStartTimer;
    let minDisplayTimer;

    if (isLoading) {
      // Se o loading durar mais que o threshold, considera cold start
      coldStartTimer = setTimeout(() => {
        setIsColdStart(true);
      }, threshold);
    } else {
      // Quando para de carregar, espera o tempo mínimo antes de esconder
      if (loadingStartTime) {
        const elapsedTime = Date.now() - loadingStartTime;
        const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
        
        minDisplayTimer = setTimeout(() => {
          setIsColdStart(false);
        }, remainingTime);
      } else {
        setIsColdStart(false);
      }
    }

    return () => {
      if (coldStartTimer) {
        clearTimeout(coldStartTimer);
      }
      if (minDisplayTimer) {
        clearTimeout(minDisplayTimer);
      }
    };
  }, [isLoading, threshold, minDisplayTime, loadingStartTime]);

  const startLoading = () => {
    setIsLoading(true);
    setLoadingStartTime(Date.now());
    setIsColdStart(false);
  };

  const stopLoading = () => {
    setIsLoading(false);
    // loadingStartTime será usado no useEffect para calcular delay mínimo
  };

  return {
    isColdStart,
    isLoading,
    startLoading,
    stopLoading
  };
};

export default useColdStartDetection;