import { useEffect, useState } from 'react';

/**
 * Hook para debounce de valores
 * Evita execuções desnecessárias durante digitação rápida
 * @param {*} value - Valor a ser debounced
 * @param {number} delay - Delay em ms (padrão: 300ms)
 * @returns {*} - Valor debounced
 */
export function useDebounce(value, delay = 300) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
