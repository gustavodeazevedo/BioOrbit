/**
 * Utilitários para agendamento de tarefas e otimização de INP
 * Ajuda a evitar bloqueios longos durante interações do usuário
 */

/**
 * Executa uma tarefa pesada dividindo-a em chunks menores
 * Permite que o navegador processe eventos entre os chunks
 * @param {Function} taskFn - Função que executa a tarefa
 * @param {Object} options - Opções de configuração
 */
export async function yieldToMain(taskFn, options = {}) {
    const { priority = 'background' } = options;

    if ('scheduler' in window && 'yield' in window.scheduler) {
        // API moderna de scheduler (experimental)
        await window.scheduler.yield();
        return taskFn();
    } else if ('requestIdleCallback' in window && priority === 'background') {
        // Usar requestIdleCallback para tarefas de baixa prioridade
        return new Promise((resolve) => {
            window.requestIdleCallback(() => {
                resolve(taskFn());
            });
        });
    } else {
        // Fallback: usar setTimeout para quebrar a task
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(taskFn());
            }, 0);
        });
    }
}

/**
 * Debounce function para limitar execuções
 * @param {Function} func - Função a ser executada
 * @param {number} wait - Tempo de espera em ms
 * @returns {Function} - Função debounced
 */
export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function para limitar taxa de execução
 * @param {Function} func - Função a ser executada
 * @param {number} limit - Intervalo mínimo entre execuções em ms
 * @returns {Function} - Função throttled
 */
export function throttle(func, limit = 100) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Processa array em chunks para evitar bloqueios longos
 * @param {Array} array - Array a ser processado
 * @param {Function} processFn - Função para processar cada item
 * @param {number} chunkSize - Tamanho de cada chunk
 */
export async function processArrayInChunks(array, processFn, chunkSize = 50) {
    const results = [];

    for (let i = 0; i < array.length; i += chunkSize) {
        const chunk = array.slice(i, i + chunkSize);

        // Processar chunk
        const chunkResults = chunk.map(processFn);
        results.push(...chunkResults);

        // Yield para permitir outras tarefas
        if (i + chunkSize < array.length) {
            await yieldToMain(() => { });
        }
    }

    return results;
}
