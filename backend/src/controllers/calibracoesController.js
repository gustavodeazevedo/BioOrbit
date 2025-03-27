const Calibracao = require('../models/Calibracao');
const Equipamento = require('../models/Equipamento');

// @desc    Buscar todas as calibrações
// @route   GET /api/calibracoes
// @access  Public
const getCalibracoes = async (req, res) => {
    try {
        const calibracoes = await Calibracao.find({}).populate('equipamento', 'nome numeroSerie');
        res.json(calibracoes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Buscar uma calibração pelo ID
// @route   GET /api/calibracoes/:id
// @access  Public
const getCalibracaoById = async (req, res) => {
    try {
        const calibracao = await Calibracao.findById(req.params.id).populate('equipamento');

        if (calibracao) {
            res.json(calibracao);
        } else {
            res.status(404).json({ message: 'Calibração não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Criar uma nova calibração
// @route   POST /api/calibracoes
// @access  Private
const createCalibracao = async (req, res) => {
    try {
        const {
            equipamento,
            dataCalibracao,
            dataProximaCalibracao,
            responsavelCalibracao,
            empresa,
            numeroCertificado,
            resultado,
            observacoes
        } = req.body;

        // Verificar se o equipamento existe
        const equipamentoExists = await Equipamento.findById(equipamento);
        if (!equipamentoExists) {
            return res.status(400).json({ message: 'Equipamento não encontrado' });
        }

        const calibracao = new Calibracao({
            equipamento,
            dataCalibracao,
            dataProximaCalibracao,
            responsavelCalibracao,
            empresa,
            numeroCertificado,
            resultado,
            observacoes
        });

        const createdCalibracao = await calibracao.save();

        // Atualizar a data da última calibração e próxima calibração no equipamento
        equipamentoExists.ultimaCalibracao = dataCalibracao;
        equipamentoExists.proximaCalibracao = dataProximaCalibracao;
        await equipamentoExists.save();

        res.status(201).json(createdCalibracao);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Atualizar uma calibração
// @route   PUT /api/calibracoes/:id
// @access  Private
const updateCalibracao = async (req, res) => {
    try {
        const {
            dataCalibracao,
            dataProximaCalibracao,
            responsavelCalibracao,
            empresa,
            numeroCertificado,
            resultado,
            observacoes
        } = req.body;

        const calibracao = await Calibracao.findById(req.params.id);

        if (calibracao) {
            calibracao.dataCalibracao = dataCalibracao || calibracao.dataCalibracao;
            calibracao.dataProximaCalibracao = dataProximaCalibracao || calibracao.dataProximaCalibracao;
            calibracao.responsavelCalibracao = responsavelCalibracao || calibracao.responsavelCalibracao;
            calibracao.empresa = empresa || calibracao.empresa;
            calibracao.numeroCertificado = numeroCertificado || calibracao.numeroCertificado;
            calibracao.resultado = resultado || calibracao.resultado;
            calibracao.observacoes = observacoes || calibracao.observacoes;

            const updatedCalibracao = await calibracao.save();

            // Atualizar a data da última calibração e próxima calibração no equipamento
            if (dataCalibracao || dataProximaCalibracao) {
                const equipamento = await Equipamento.findById(calibracao.equipamento);
                if (equipamento) {
                    if (dataCalibracao) equipamento.ultimaCalibracao = dataCalibracao;
                    if (dataProximaCalibracao) equipamento.proximaCalibracao = dataProximaCalibracao;
                    await equipamento.save();
                }
            }

            res.json(updatedCalibracao);
        } else {
            res.status(404).json({ message: 'Calibração não encontrada' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Remover uma calibração
// @route   DELETE /api/calibracoes/:id
// @access  Private
const deleteCalibracao = async (req, res) => {
    try {
        const calibracao = await Calibracao.findById(req.params.id);

        if (calibracao) {
            await calibracao.deleteOne();
            res.json({ message: 'Calibração removida' });
        } else {
            res.status(404).json({ message: 'Calibração não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCalibracoes,
    getCalibracaoById,
    createCalibracao,
    updateCalibracao,
    deleteCalibracao
};