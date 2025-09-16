/**
 * Exemplo de dados para testar as animações da IA
 * Este arquivo simula dados que seriam extraídos da IA para validar o sistema de animação
 */

export const exemploAnimacaoMonocanal = {
    tipoEquipamento: "micropipeta",
    tipoInstrumento: "monocanal",
    marcaPipeta: "Eppendorf",
    modeloPipeta: "Research plus",
    numeroPipeta: "EP001234",
    numeroIdentificacao: "PIP-001",
    numeroCertificado: "001",
    capacidade: "1000",
    unidadeCapacidade: "µL",
    faixaIndicacao: "100-1000",
    unidadeFaixaIndicacao: "µL",
    faixaCalibrada: "100-1000",
    unidadeFaixaCalibrada: "µL",
    pontosCalibra: [
        {
            id: 1,
            volumeNominal: "100",
            unidade: "µL",
            medicoes: ["99.8", "100.1", "99.9", "100.2", "99.7", "100.0", "99.8", "100.1", "99.9", "100.0"],
            valoresTexto: "99.8, 100.1, 99.9, 100.2, 99.7, 100.0, 99.8, 100.1, 99.9, 100.0",
        },
        {
            id: 2,
            volumeNominal: "500",
            unidade: "µL",
            medicoes: ["499.5", "500.2", "499.8", "500.1", "499.6", "500.0", "499.7", "500.3", "499.9", "500.0"],
            valoresTexto: "499.5, 500.2, 499.8, 500.1, 499.6, 500.0, 499.7, 500.3, 499.9, 500.0",
        },
        {
            id: 3,
            volumeNominal: "1000",
            unidade: "µL",
            medicoes: ["999.2", "1000.1", "999.8", "1000.3", "999.5", "1000.0", "999.7", "1000.2", "999.9", "1000.1"],
            valoresTexto: "999.2, 1000.1, 999.8, 1000.3, 999.5, 1000.0, 999.7, 1000.2, 999.9, 1000.1",
        }
    ]
};

export const exemploAnimacaoMulticanal = {
    tipoEquipamento: "micropipeta",
    tipoInstrumento: "multicanal",
    quantidadeCanais: 8,
    marcaPipeta: "Thermo Scientific",
    modeloPipeta: "F1-ClipTip",
    numeroPipeta: "TC008765",
    numeroIdentificacao: "MUL-008",
    numeroCertificado: "002",
    capacidade: "300",
    unidadeCapacidade: "µL",
    faixaIndicacao: "20-300",
    unidadeFaixaIndicacao: "µL",
    faixaCalibrada: "20-300",
    unidadeFaixaCalibrada: "µL",
    pontosCalibra: [
        {
            id: 1,
            volumeNominal: "20",
            unidade: "µL",
            medicoes: ["19.8", "20.1", "19.9", "20.2", "19.7", "20.0", "19.8", "20.1", "19.9", "20.0"],
            valoresTexto: "19.8, 20.1, 19.9, 20.2, 19.7, 20.0, 19.8, 20.1, 19.9, 20.0",
        },
        {
            id: 2,
            volumeNominal: "150",
            unidade: "µL",
            medicoes: ["149.5", "150.2", "149.8", "150.1", "149.6", "150.0", "149.7", "150.3", "149.9", "150.0"],
            valoresTexto: "149.5, 150.2, 149.8, 150.1, 149.6, 150.0, 149.7, 150.3, 149.9, 150.0",
        },
        {
            id: 3,
            volumeNominal: "300",
            unidade: "µL",
            medicoes: ["299.2", "300.1", "299.8", "300.3", "299.5", "300.0", "299.7", "300.2", "299.9", "300.1"],
            valoresTexto: "299.2, 300.1, 299.8, 300.3, 299.5, 300.0, 299.7, 300.2, 299.9, 300.1",
        }
    ]
};

export const exemploAnimacaoRepipetador = {
    tipoEquipamento: "repipetador",
    tipoInstrumento: "monocanal",
    marcaPipeta: "Eppendorf",
    modeloPipeta: "Repeater E3x",
    numeroPipeta: "REP005432",
    numeroIdentificacao: "REP-005",
    numeroCertificado: "003",
    capacidade: "5000",
    unidadeCapacidade: "µL",
    faixaIndicacao: "1-5000",
    unidadeFaixaIndicacao: "µL",
    faixaCalibrada: "100-5000",
    unidadeFaixaCalibrada: "µL",
    seringas: [
        {
            id: 1,
            volume: "5 mL",
            cor: "Azul",
            divisoes: [
                { divisao: "1/10", volume: "500", medicoes: ["499.5", "500.2", "499.8", "500.1", "499.6"] },
                { divisao: "1/5", volume: "1000", medicoes: ["999.2", "1000.1", "999.8", "1000.3", "999.5"] },
                { divisao: "1/2", volume: "2500", medicoes: ["2499.5", "2500.8", "2499.7", "2500.2", "2499.9"] },
                { divisao: "1/1", volume: "5000", medicoes: ["4998.5", "5000.2", "4999.1", "5000.6", "4999.3"] }
            ]
        }
    ],
    pontosCalibra: []
};