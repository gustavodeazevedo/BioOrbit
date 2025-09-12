import { useState, useCallback } from 'react';

// Hook personalizado para extração inteligente de dados de pipetas com novo formato padronizado
export const useDataExtraction = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    // Função para extrair valor de um campo específico
    const extractFieldValue = useCallback((text, fieldName) => {
        const patterns = [
            new RegExp(`${fieldName}:\\s*([^\\n]*)`, 'i'),
            new RegExp(`${fieldName}=\\s*([^\\n]*)`, 'i'),
            new RegExp(`${fieldName}\\s+([^\\n]*)`, 'i')
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                const value = match[1].trim();
                // Verificar se o valor é N/A, n/a, NA, na ou variações
                if (/^(n\/a|na|n\.a\.?)$/i.test(value)) {
                    return 'N/A';
                }
                return value;
            }
        }
        return '';
    }, []);

    // Função para extrair tipo de instrumento
    const extractInstrumentType = useCallback((text) => {
        const instrumentoValue = extractFieldValue(text, 'INSTRUMENTO');

        if (instrumentoValue.toLowerCase().includes('multicanal')) {
            return { tipoEquipamento: 'micropipeta', tipoInstrumento: 'multicanal' };
        } else if (instrumentoValue.toLowerCase().includes('monocanal')) {
            return { tipoEquipamento: 'micropipeta', tipoInstrumento: 'monocanal' };
        } else if (instrumentoValue.toLowerCase().includes('repipetador')) {
            return { tipoEquipamento: 'repipetador', tipoInstrumento: 'monocanal' };
        }

        return { tipoEquipamento: 'micropipeta', tipoInstrumento: 'monocanal' };
    }, [extractFieldValue]);

    // Função para extrair número de canais
    const extractChannelCount = useCallback((text) => {
        const canaisValue = extractFieldValue(text, 'Nº DE CANAIS');
        console.log('🔍 Valor extraído para canais:', canaisValue);
        if (canaisValue) {
            const match = canaisValue.match(/(\d+)/);
            const result = match ? parseInt(match[1]) : 8;
            console.log('📊 Número de canais extraído:', result);
            return result;
        }
        console.log('📊 Usando padrão de 8 canais');
        return 8; // padrão
    }, [extractFieldValue]);

    // Função para extrair pontos de calibração do novo formato
    const extractCalibrationPoints = useCallback((text) => {
        const points = [];

        // Procurar seção "PONTOS DE CALIBRAÇÃO:" (aceita espaços após os dois pontos)
        const calibrationSection = text.match(/PONTOS DE CALIBRAÇÃO:\s*([\s\S]*?)(?=\n\n|\n(?=[A-Z])|\n$|$)/i);
        if (!calibrationSection) return points;

        const calibrationText = calibrationSection[1];

        // Extrair pontos no formato: - 1000= 996.6, 995.1, 995.6, 995.3, 995.7
        // Aceita quebras de linha e espaços antes dos pontos
        const pointPattern = /-\s*(\d+(?:\.\d+)?)\s*=\s*([\d\.,\s]*)/g;
        let match;

        while ((match = pointPattern.exec(calibrationText)) !== null) {
            const volume = match[1];
            const measurements = match[2];

            // Extrair medições individuais apenas se há medições
            let measurementValues = [];
            if (measurements && measurements.trim()) {
                measurementValues = measurements
                    .split(',')
                    .map(m => m.trim())
                    .filter(m => m && !isNaN(parseFloat(m)))
                    .slice(0, 10);
            }

            console.log(`Ponto ${volume}: medições extraídas:`, measurementValues);

            points.push({
                id: Date.now() + Math.random(),
                volumeNominal: volume,
                unidade: 'µL',
                medicoes: [...measurementValues, ...Array(10 - measurementValues.length).fill('')],
                valoresTexto: measurementValues.join(', '),
                media: measurementValues.length > 0 ? measurementValues.reduce((sum, val) => sum + parseFloat(val), 0) / measurementValues.length : null,
                mediaMassa: null,
                inexatidao: null,
                inexatidaoPercentual: null,
                desvioPadrao: null
            });
        }

        return points;
    }, []);

    // Função para extrair dados de seringas (para repipetador)
    const extractSeringas = useCallback((text) => {
        const seringas = [];

        // Extrair seringas utilizadas
        const seringasUtilizadas = extractFieldValue(text, 'SERINGAS UTILIZADAS');
        if (!seringasUtilizadas) return seringas;

        // Procurar seções de seringas específicas (aceita espaços após os dois pontos)
        const seringaPattern = /SERINGA DE (\d+(?:\.\d+)?)(UL|µL|ML|mL):\s*([\s\S]*?)(?=\n(?=SERINGA DE|\n[A-Z])|$)/gi;
        let match;

        while ((match = seringaPattern.exec(text)) !== null) {
            const volume = match[1];
            const unidade = match[2].toLowerCase() === 'ml' ? 'mL' : 'µL';
            const seringaContent = match[3];

            // Extrair pontos da seringa (aceita quebras de linha e espaços antes dos pontos)
            const pontosSeringa = [];
            const pontoPattern = /-\s*(\d+(?:\.\d+)?)\s*=\s*([\d\.,\s]*)/g;
            let pontoMatch;

            while ((pontoMatch = pontoPattern.exec(seringaContent)) !== null) {
                const volumePonto = pontoMatch[1];
                const medicoes = pontoMatch[2] ?
                    pontoMatch[2].split(',').map(m => m.trim()).filter(m => m && !isNaN(parseFloat(m))) :
                    [];

                pontosSeringa.push({
                    id: Date.now() + Math.random(),
                    volumeNominal: volumePonto,
                    unidade: 'µL',
                    medicoes: [...medicoes, ...Array(10 - medicoes.length).fill('')],
                    valoresTexto: medicoes.join(', '),
                    media: null,
                    mediaMassa: null,
                    inexatidao: null,
                    inexatidaoPercentual: null,
                    desvioPadrao: null
                });
            }

            seringas.push({
                id: Date.now() + Math.random(),
                volumeNominal: volume,
                unidade: unidade,
                pontosCalibra: pontosSeringa
            });
        }

        return seringas;
    }, [extractFieldValue]);

    // Função principal de extração para o novo formato
    const extractPipetteData = useCallback(async (text) => {
        setIsProcessing(true);
        setError('');

        try {
            // Simular processamento de IA
            await new Promise(resolve => setTimeout(resolve, 800));

            if (!text || text.trim().length < 20) {
                throw new Error('Texto muito curto. Por favor, forneça o texto completo do Notion.');
            }

            // Validar se é o formato correto
            if (!text.includes('INSTRUMENTO:')) {
                throw new Error('Formato não reconhecido. Certifique-se de usar o formato padronizado do Notion.');
            }

            // Extrair tipo de instrumento
            const { tipoEquipamento, tipoInstrumento } = extractInstrumentType(text);

            // Extrair campos básicos
            const volume = extractFieldValue(text, 'VOLUME');
            const pontosIndicacao = extractFieldValue(text, 'PONTOS DE INDICAÇÃO');
            const serie = extractFieldValue(text, 'SÉRIE');
            const marca = extractFieldValue(text, 'MARCA');
            const modelo = extractFieldValue(text, 'MODELO');
            const numeroOrdenacao = extractFieldValue(text, 'Nº DE ORDENAÇÃO');
            const numeroIdentificacao = extractFieldValue(text, 'Nº DE IDENTIFICAÇÃO');

            console.log('Valores extraídos:');
            console.log('numeroIdentificacao:', numeroIdentificacao);
            console.log('numeroOrdenacao:', numeroOrdenacao);

            // Validação básica apenas para verificar se os campos existem no texto
            // (Os campos podem ser N/A conforme os exemplos fornecidos)
            if (!text.includes('MARCA:')) {
                throw new Error('Campo MARCA: não encontrado. Verifique se está usando o formato correto.');
            }

            if (!text.includes('MODELO:')) {
                throw new Error('Campo MODELO: não encontrado. Verifique se está usando o formato correto.');
            }

            if (!text.includes('SÉRIE:')) {
                throw new Error('Campo SÉRIE: não encontrado. Verifique se está usando o formato correto.');
            }

            // Função auxiliar para tratar campos que podem ser N/A
            const processField = (value, defaultValue = '') => {
                if (!value || value === '') return defaultValue;
                if (value === 'N/A') return 'N/A';
                return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
            };

            let extractedData = {
                tipoEquipamento,
                tipoInstrumento,
                marcaPipeta: processField(marca),
                modeloPipeta: processField(modelo),
                numeroPipeta: processField(serie),
                numeroIdentificacao: processField(numeroIdentificacao, 'N/A'),
                numeroCertificado: processField(numeroOrdenacao), // Número de ordenação vai para o campo Número do Certificado
                capacidade: volume || '',
                unidadeCapacidade: 'µL',
                faixaIndicacao: pontosIndicacao || '',
                unidadeFaixaIndicacao: 'µL',
                faixaCalibrada: pontosIndicacao || '',
                unidadeFaixaCalibrada: 'µL'
            };

            // Para repipetador, extrair seringas
            if (tipoEquipamento === 'repipetador') {
                const seringas = extractSeringas(text);
                if (seringas.length === 0) {
                    throw new Error('Nenhuma seringa encontrada para o repipetador. Verifique a seção "SERINGAS UTILIZADAS".');
                }
                extractedData.seringas = seringas;
                extractedData.pontosCalibra = []; // Para repipetador, os pontos ficam nas seringas
            } else {
                // Para micropipetas, extrair pontos de calibração
                const pontos = extractCalibrationPoints(text);
                if (pontos.length === 0) {
                    throw new Error('Nenhum ponto de calibração encontrado. Verifique a seção "PONTOS DE CALIBRAÇÃO".');
                }

                // Para multicanal, criar pontos apenas para o Canal Mestre (Canal 1)
                if (tipoInstrumento === 'multicanal') {
                    const quantidadeCanais = extractChannelCount(text);
                    extractedData.quantidadeCanais = quantidadeCanais;

                    // Criar pontos apenas para o Canal Mestre (Canal 1)
                    // O Canal Mestre automaticamente propagará para os outros canais
                    const pontosCanalMestre = pontos.map((ponto, index) => ({
                        ...ponto,
                        id: Date.now() + Math.random(),
                        canal: 1, // Canal Mestre
                        pontoPosicao: index + 1 // Posição do ponto (1, 2, 3, etc.)
                    }));

                    extractedData.pontosCalibra = pontosCanalMestre;
                } else {
                    extractedData.pontosCalibra = pontos;
                }
            }

            return extractedData;

        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsProcessing(false);
        }
    }, [extractFieldValue, extractInstrumentType, extractChannelCount, extractCalibrationPoints, extractSeringas]);

    return {
        extractPipetteData,
        isProcessing,
        error,
        setError
    };
};

export default useDataExtraction;
