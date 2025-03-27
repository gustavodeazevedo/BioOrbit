const Equipamento = require('../models/Equipamento');

// @desc    Buscar todos os equipamentos
// @route   GET /api/equipamentos
// @access  Public
const getEquipamentos = async (req, res) => {
    try {
        const equipamentos = await Equipamento.find({});
        res.json(equipamentos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Buscar um equipamento pelo ID
// @route   GET /api/equipamentos/:id
// @access  Public
const getEquipamentoById = async (req, res) => {
    try {
        const equipamento = await Equipamento.findById(req.params.id);

        if (equipamento) {
            res.json(equipamento);
        } else {
            res.status(404).json({ message: 'Equipamento não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Criar um novo equipamento
// @route   POST /api/equipamentos
// @access  Private
const createEquipamento = async (req, res) => {
    try {
        const {
            nome,
            modelo,
            numeroSerie,
            fabricante,
            setor,
            responsavel,
            dataAquisicao,
            ultimaCalibracao,
            proximaCalibracao,
            status
        } = req.body;

        const equipamento = new Equipamento({
            nome,
            modelo,
            numeroSerie,
            fabricante,
            setor,
            responsavel,
            dataAquisicao,
            ultimaCalibracao,
            proximaCalibracao,
            status
        });

        const createdEquipamento = await equipamento.save();
        res.status(201).json(createdEquipamento);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Atualizar um equipamento
// @route   PUT /api/equipamentos/:id
// @access  Private
const updateEquipamento = async (req, res) => {
    try {
        const {
            nome,
            modelo,
            numeroSerie,
            fabricante,
            setor,
            responsavel,
            dataAquisicao,
            ultimaCalibracao,
            proximaCalibracao,
            status
        } = req.body;

        const equipamento = await Equipamento.findById(req.params.id);

        if (equipamento) {
            equipamento.nome = nome || equipamento.nome;
            equipamento.modelo = modelo || equipamento.modelo;
            equipamento.numeroSerie = numeroSerie || equipamento.numeroSerie;
            equipamento.fabricante = fabricante || equipamento.fabricante;
            equipamento.setor = setor || equipamento.setor;
            equipamento.responsavel = responsavel || equipamento.responsavel;
            equipamento.dataAquisicao = dataAquisicao || equipamento.dataAquisicao;
            equipamento.ultimaCalibracao = ultimaCalibracao || equipamento.ultimaCalibracao;
            equipamento.proximaCalibracao = proximaCalibracao || equipamento.proximaCalibracao;
            equipamento.status = status || equipamento.status;

            const updatedEquipamento = await equipamento.save();
            res.json(updatedEquipamento);
        } else {
            res.status(404).json({ message: 'Equipamento não encontrado' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Remover um equipamento
// @route   DELETE /api/equipamentos/:id
// @access  Private
const deleteEquipamento = async (req, res) => {
    try {
        const equipamento = await Equipamento.findById(req.params.id);

        if (equipamento) {
            await equipamento.deleteOne();
            res.json({ message: 'Equipamento removido' });
        } else {
            res.status(404).json({ message: 'Equipamento não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getEquipamentos,
    getEquipamentoById,
    createEquipamento,
    updateEquipamento,
    deleteEquipamento
};