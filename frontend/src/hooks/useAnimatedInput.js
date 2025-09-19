import { useState, useRef, useCallback } from 'react';


//  Hook para criar animações de preenchimento de inputs simulando ações do mouse
//   Similar ao pyautogui, mas implementado em JavaScript para web

export const useAnimatedInput = () => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentField, setCurrentField] = useState(null);
    const animationQueueRef = useRef([]);
    const cursorRef = useRef(null);

    // Configurações de velocidade (invertido - números menores = mais rápido)
    const ANIMATION_SPEEDS = {
        slow: 5,     // Rápido - menor delay
        medium: 15,  // Médio
        fast: 50     // Lento - maior delay
    };

    const [animationSpeed, setAnimationSpeedInternal] = useState('medium');

    // Função para converter valores numéricos para strings e definir velocidade
    const setAnimationSpeed = useCallback((value) => {
        console.log('🎯 setAnimationSpeed chamado com:', value);
        if (typeof value === 'number') {
            switch (value) {
                case 1:
                    console.log('🐌 Definindo velocidade para LENTA');
                    setAnimationSpeedInternal('fast');  // valor 1 = lenta = delay maior (fast nos delays)
                    break;
                case 2:
                    console.log('🚶 Definindo velocidade para MÉDIA');
                    setAnimationSpeedInternal('medium');
                    break;
                case 3:
                    console.log('🚀 Definindo velocidade para RÁPIDA');
                    setAnimationSpeedInternal('slow');  // valor 3 = rápida = delay menor (slow nos delays)
                    break;
                default:
                    setAnimationSpeedInternal('medium');
            }
        } else {
            setAnimationSpeedInternal(value);
        }
    }, []);

    // Função para obter a velocidade numérica atual
    const getNumericSpeed = useCallback(() => {
        switch (animationSpeed) {
            case 'fast': return 1;  // fast = lenta = 1
            case 'medium': return 2;
            case 'slow': return 3;  // slow = rápida = 3
            default: return 2;
        }
    }, [animationSpeed]);


    // Cria um cursor virtual que se move pela tela

    const createVirtualCursor = useCallback(() => {
        if (cursorRef.current) return cursorRef.current;

        const cursor = document.createElement('div');
        cursor.id = 'ai-virtual-cursor';
        cursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      background: radial-gradient(circle, rgb(144, 199, 45), rgba(144, 199, 45, 0.3));
      border: 2px solid rgb(144, 199, 45);
      border-radius: 50%;
      pointer-events: none;
      z-index: 10000;
      transition: all 0.1s ease; 
      box-shadow: 0 0 15px rgba(144, 199, 45, 0.5);
      opacity: 0;
      transform: scale(0.5);
    `;

        document.body.appendChild(cursor);
        cursorRef.current = cursor;
        return cursor;
    }, []);


    /**
     * Garante que um elemento esteja visível e centralizado na tela
     */
    const ensureElementVisible = useCallback((element) => {
        return new Promise((resolve) => {
            // Primeiro, scroll suave para centralizar o elemento
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center'
            });

            // Aguardar o scroll terminar e verificar se está realmente visível
            setTimeout(() => {
                const rect = element.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                const viewportWidth = window.innerWidth;

                // Se o elemento ainda não está totalmente visível, fazer scroll adicional
                if (rect.top < 0 || rect.bottom > viewportHeight ||
                    rect.left < 0 || rect.right > viewportWidth) {

                    // Scroll adicional para garantir visibilidade total
                    window.scrollTo({
                        top: window.scrollY + (rect.top + rect.bottom) / 2 - viewportHeight / 2,
                        left: window.scrollX + (rect.left + rect.right) / 2 - viewportWidth / 2,
                        behavior: 'smooth'
                    });

                    setTimeout(resolve, 150); // Reduzido de 300ms para 150ms
                } else {
                    resolve();
                }
            }, 300); // Reduzido de 600ms para 300ms
        });
    }, []);

    // Move o cursor virtual para um elemento específico

    const moveCursorToElement = useCallback((element) => {
        return new Promise(async (resolve) => {
            const cursor = createVirtualCursor();

            // Garantir que o elemento esteja totalmente visível
            await ensureElementVisible(element);

            // Aguardar menos tempo para movimento mais rápido
            setTimeout(() => {
                const rect = element.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                // Mostrar cursor
                cursor.style.opacity = '1';
                cursor.style.transform = 'scale(1)';

                // Mover para o elemento com transição mais rápida
                cursor.style.transition = 'all 0.15s ease'; // Transição mais rápida
                cursor.style.left = `${centerX - 10}px`;
                cursor.style.top = `${centerY - 10}px`;

                setTimeout(resolve, 150); // Reduzido de 300ms para 150ms
            }, 100); // Reduzido de 200ms para 100ms
        });
    }, [createVirtualCursor, ensureElementVisible]);


    // Simula um clique visual no elemento

    const simulateClick = useCallback((element) => {
        return new Promise((resolve) => {
            const cursor = cursorRef.current;
            if (!cursor) return resolve();

            // Adicionar classe de clique
            element.classList.add('ai-clicking');

            // Efeito de clique no cursor
            cursor.style.transform = 'scale(0.8)';
            cursor.style.background = 'radial-gradient(circle, rgb(100, 180, 20), rgba(100, 180, 20, 0.5))';

            setTimeout(() => {
                cursor.style.transform = 'scale(1)';
                cursor.style.background = 'radial-gradient(circle, rgb(144, 199, 45), rgba(144, 199, 45, 0.3))';
                element.classList.remove('ai-clicking');

                // Focar no elemento
                element.focus();
                resolve();
            }, 50); // Reduzido de 150ms para 50ms
        });
    }, []);


    // Simula digitação gradual em um input

    const simulateTyping = useCallback((element, text) => {
        return new Promise((resolve) => {
            if (!text || text === 'N/A') {
                element.value = text || '';
                element.dispatchEvent(new Event('input', { bubbles: true }));
                element.dispatchEvent(new Event('change', { bubbles: true }));
                return resolve();
            }

            const speed = ANIMATION_SPEEDS[animationSpeed];
            let currentIndex = 0;

            // Limpar valor atual
            element.value = '';
            element.classList.add('ai-typing');

            const typeNextChar = () => {
                if (currentIndex < text.length) {
                    element.value += text[currentIndex];
                    element.dispatchEvent(new Event('input', { bubbles: true }));
                    currentIndex++;
                    setTimeout(typeNextChar, speed);
                } else {
                    element.classList.remove('ai-typing');
                    element.dispatchEvent(new Event('change', { bubbles: true }));
                    resolve();
                }
            };

            typeNextChar();
        });
    }, [animationSpeed]);


    // Anima o preenchimento de um campo específico

    const animateFieldFill = useCallback(async (fieldSelector, value) => {
        try {
            const element = document.querySelector(fieldSelector);
            if (!element) {
                console.warn(`Elemento não encontrado: ${fieldSelector}`);
                return;
            }

            setCurrentField(fieldSelector);

            // Mover cursor para o elemento
            await moveCursorToElement(element);

            // Simular clique
            await simulateClick(element);

            // Aguardar menos tempo antes de começar a digitar
            await new Promise(resolve => setTimeout(resolve, 50)); // Reduzido de 200ms para 50ms

            // Simular digitação
            await simulateTyping(element, value);

            // Aguardar menos tempo antes do próximo campo
            await new Promise(resolve => setTimeout(resolve, 100)); // Reduzido de 300ms para 100ms

        } catch (error) {
            console.error('Erro ao animar campo:', error);
        }
    }, [moveCursorToElement, simulateClick, simulateTyping]);


    // Executa uma sequência de animações de preenchimento

    const executeAnimationSequence = useCallback(async (fieldValuePairs) => {
        if (isAnimating) return;

        setIsAnimating(true);

        try {
            for (const { selector, value } of fieldValuePairs) {
                await animateFieldFill(selector, value);
            }
        } finally {
            setIsAnimating(false);
            setCurrentField(null);

            // Esconder cursor
            if (cursorRef.current) {
                cursorRef.current.style.opacity = '0';
                cursorRef.current.style.transform = 'scale(0.5)';
            }
        }
    }, [isAnimating, animateFieldFill]);

    // Para a animação atual
    const stopAnimation = useCallback(() => {
        setIsAnimating(false);
        setCurrentField(null);
        animationQueueRef.current = [];

        if (cursorRef.current) {
            cursorRef.current.style.opacity = '0';
            cursorRef.current.style.transform = 'scale(0.5)';
        }
    }, []);

    /**
     * Simula um clique em um botão específico
     */
    const animateButtonClick = useCallback(async (buttonSelector, buttonName = 'Botão') => {
        try {
            const button = document.querySelector(buttonSelector);
            if (!button) {
                console.warn(`Botão não encontrado: ${buttonSelector}`);
                return false;
            }

            setCurrentField(buttonName);

            // Mover cursor para o botão
            await moveCursorToElement(button);

            // Simular clique visual
            await simulateClick(button);

            // Aguardar menos tempo para mais velocidade
            await new Promise(resolve => setTimeout(resolve, 300)); // Reduzido de 1000ms para 300ms

            // Realizar o clique real
            button.click();

            // Manter cursor visível por menos tempo para mais velocidade
            await new Promise(resolve => setTimeout(resolve, 200)); // Reduzido de 800ms para 200ms

            // Esconder cursor após clicar no botão
            if (cursorRef.current) {
                cursorRef.current.style.opacity = '0';
                cursorRef.current.style.transform = 'scale(0.5)';
            }

            return true;
        } catch (error) {
            console.error('Erro ao clicar no botão:', error);
            return false;
        }
    }, [moveCursorToElement, simulateClick]);

    // Remove o cursor virtual ao desmontar
    const cleanup = useCallback(() => {
        if (cursorRef.current) {
            document.body.removeChild(cursorRef.current);
            cursorRef.current = null;
        }
    }, []);

    return {
        isAnimating,
        currentField,
        animationSpeed: getNumericSpeed(), // Retorna valor numérico para o componente
        setAnimationSpeed,
        getNumericSpeed,
        animateFieldFill,
        executeAnimationSequence,
        animateButtonClick,
        stopAnimation,
        cleanup
    };
};

export default useAnimatedInput;