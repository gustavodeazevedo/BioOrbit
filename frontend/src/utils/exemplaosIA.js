// Exemplos de formatos suportados pela IA do BioOrbit

export const EXEMPLOS_FORMATOS = {
    // Formato padrão para micropipeta monocanal
    FORMATO_MONOCANAL: `INSTRUMENTO: micropipetas monocanal

VOLUME: 1000

PONTOS DE INDICAÇÃO: 100-1000

SÉRIE: a12837b

MARCA: gilson

MODELO: pipetman

Nº DE ORDENAÇÃO: 1

Nº DE IDENTIFICAÇÃO: tft-102

PONTOS DE CALIBRAÇÃO:

- 1000= 996.6, 995.1, 995.6, 995.3, 995.7
- 500= 496.6, 496.1, 496.3, 496.5, 496.7
- 100= 99.6, 99.63, 99.66, 99.68, 99.69`,

    // Formato para micropipeta multicanal
    FORMATO_MULTICANAL: `INSTRUMENTO: micropipeta multicanal

Nº DE CANAIS: 8 canais

VOLUME: 1000

PONTOS DE INDICAÇÃO: 100-1000

SÉRIE: a12837b

MARCA: gilson

MODELO: pipetman

Nº DE ORDENAÇÃO: 1

Nº DE IDENTIFICAÇÃO: tft-102

PONTOS DE CALIBRAÇÃO:

- 1000= 996.6, 995.1, 995.6, 995.3, 995.7
- 500= 496.6, 496.1, 496.3, 496.5, 496.7
- 100= 99.6, 99.63, 99.66, 99.68, 99.69`,

    // Formato para repipetador
    FORMATO_REPIPETADOR: `INSTRUMENTO: repipetador

SÉRIE: a12837b

MARCA: gilson

MODELO: distriman

Nº DE ORDENAÇÃO: 1

Nº DE IDENTIFICAÇÃO: tft-102

SERINGAS UTILIZADAS: 1250ul

SERINGA DE 1250UL:

- 100= 99.8, 99.9, 99.7, 99.8, 99.9
- 50= 49.9, 50.0, 49.8, 49.9, 50.0
- 10= 9.98, 9.99, 9.97, 9.98, 9.99`
};

export const DICAS_IA = [
    "Use EXATAMENTE o formato padronizado do Notion para melhor precisão",
    "Todos os campos em MAIÚSCULAS devem ser mantidos como mostrado nos exemplos",
    "Para repipetadores, inclua a seção 'SERINGAS UTILIZADAS' e 'SERINGA DE XXXUL'",
    "Para multicanais, especifique o número de canais no campo 'Nº DE CANAIS'",
    "Os pontos de calibração devem começar com hífen (-) seguido do volume e sinal de igual (=)",
    "Medições podem estar vazias (só volume=) para preenchimento posterior"
];

export const CAMPOS_OBRIGATORIOS = {
    TODOS: ['INSTRUMENTO', 'SÉRIE', 'MARCA', 'MODELO'],
    MICROPIPETA: ['VOLUME', 'PONTOS DE INDICAÇÃO', 'PONTOS DE CALIBRAÇÃO'],
    MULTICANAL: ['Nº DE CANAIS'],
    REPIPETADOR: ['SERINGAS UTILIZADAS']
};

export default {
    EXEMPLOS_FORMATOS,
    DICAS_IA,
    CAMPOS_OBRIGATORIOS
};