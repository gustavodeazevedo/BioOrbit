// Exemplos de formatos suportados pela IA do BioOrbit

export const EXEMPLOS_FORMATOS = {
    // Formato padrão para micropipeta monocanal
    FORMATO_MONOCANAL: `INSTRUMENTO: micropipetas monocanal

VOLUME: 1000

PONTOS DE INDICAÇÃO: 100-1000

PONTOS CALIBRADOS: 200-1000

SÉRIE: a12837b

MARCA: gilson

MODELO: pipetman

Nº DE ORDENAÇÃO: 1

Nº DE IDENTIFICAÇÃO: tft-102

PONTOS DE CALIBRAÇÃO:

- 1000= 996.6, 995.1, 995.6, 995.3, 995.7
- 500= 496.6, 496.1, 496.3, 496.5, 496.7
- 200= 199.2, 199.3, 199.1, 199.4, 199.5`,

    // Formato para micropipeta multicanal
    FORMATO_MULTICANAL: `INSTRUMENTO: micropipeta multicanal

Nº DE CANAIS: 8 canais

VOLUME: 1000

PONTOS DE INDICAÇÃO: 100-1000

PONTOS CALIBRADOS: 200-1000

SÉRIE: a12837b

MARCA: gilson

MODELO: pipetman

Nº DE ORDENAÇÃO: 1

Nº DE IDENTIFICAÇÃO: tft-102

PONTOS DE CALIBRAÇÃO:

- 1000= 996.6, 995.1, 995.6, 995.3, 995.7
- 500= 496.6, 496.1, 496.3, 496.5, 496.7
- 200= 199.2, 199.3, 199.1, 199.4, 199.5`,

    // Formato para bureta (sempre monocanal)
    FORMATO_BURETA: `INSTRUMENTO: bureta monocanal

SÉRIE: BT2024001

MARCA: BureTech

MODELO: Digital Pro 25

VOLUME: 25mL

PONTOS DE INDICAÇÃO: 25mL a 2,5mL

PONTOS CALIBRADOS: 25mL a 2,5mL

PONTOS DE CALIBRAÇÃO:

- 25= 24.98, 24.97, 24.99, 24.96, 24.98
- 15= 14.97, 14.98, 14.99, 14.96, 14.97
- 5= 4.98, 4.99, 4.97, 4.98, 4.99`,

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
    "Todos os campos em MAIÚSCULAS devem ser mantidos como mostrados nos exemplos",
    "Para buretas, use sempre 'bureta monocanal' - buretas são SEMPRE monocanais",
    "Para repipetadores, inclua a seção 'SERINGAS UTILIZADAS' e 'SERINGA DE XXXUL'",
    "Para multicanais, especifique o número de canais no campo 'Nº DE CANAIS'",
    "Os pontos de calibração devem começar com hífen (-) seguido do volume e sinal de igual (=)",
    "Use 'PONTOS CALIBRADOS' para especificar a faixa realmente calibrada",
    "Medições podem estar vazias (só volume=) para preenchimento posterior"
];

export const CAMPOS_OBRIGATORIOS = {
    TODOS: ['INSTRUMENTO', 'SÉRIE', 'MARCA', 'MODELO'],
    MICROPIPETA: ['VOLUME', 'PONTOS DE INDICAÇÃO', 'PONTOS CALIBRADOS', 'PONTOS DE CALIBRAÇÃO'],
    BURETA: ['VOLUME', 'PONTOS DE INDICAÇÃO', 'PONTOS CALIBRADOS', 'PONTOS DE CALIBRAÇÃO'],
    MULTICANAL: ['Nº DE CANAIS'],
    REPIPETADOR: ['SERINGAS UTILIZADAS']
};

export default {
    EXEMPLOS_FORMATOS,
    DICAS_IA,
    CAMPOS_OBRIGATORIOS
};