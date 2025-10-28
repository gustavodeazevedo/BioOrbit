import { useEffect, useRef } from 'react';

/**
 * Hook para executar tarefas pesadas durante idle time
 * Melhora INP ao evitar bloqueios durante interações do usuário
 * @param {Function} callback - Função a ser executada durante idle
 * @param {Array} deps - Dependências do useEffect
 */
export function useIdleCallback(callback, deps = []) {
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if ('requestIdleCallback' in window) {
            const id = window.requestIdleCallback(() => {
                if (savedCallback.current) {
                    savedCallback.current();
                }
            });

            return () => window.cancelIdleCallback(id);
        } else {
            // Fallback para navegadores sem suporte
            const timeout = setTimeout(() => {
                if (savedCallback.current) {
                    savedCallback.current();
                }
            }, 1);

            return () => clearTimeout(timeout);
        }
    }, deps);
}
