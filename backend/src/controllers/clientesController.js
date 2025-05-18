const Cliente = require('../models/Cliente');

// Obter todos os clientes
exports.getClientes = async (req, res) => {
    try {
        const clientes = await Cliente.find({ ativo: true }).sort({ nome: 1 });
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar clientes',
            error: error.message
        });
    }
};

// Obter um cliente específico
exports.getCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id);

        if (!cliente) {
            return res.status(404).json({
                success: false,
                message: 'Cliente não encontrado'
            });
        }

        res.status(200).json(cliente);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar cliente',
            error: error.message
        });
    }
};

// Criar um novo cliente
exports.createCliente = async (req, res) => {
    try {
        // Removida a verificação de CNPJ duplicado

        const cliente = await Cliente.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Cliente cadastrado com sucesso',
            data: cliente
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Erro ao cadastrar cliente',
            error: error.message
        });
    }
};

// Atualizar um cliente
exports.updateCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!cliente) {
            return res.status(404).json({
                success: false,
                message: 'Cliente não encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cliente atualizado com sucesso',
            data: cliente
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Erro ao atualizar cliente',
            error: error.message
        });
    }
};

// Desativar um cliente (exclusão lógica)
exports.deleteCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findByIdAndUpdate(
            req.params.id,
            { ativo: false },
            { new: true }
        );

        if (!cliente) {
            return res.status(404).json({
                success: false,
                message: 'Cliente não encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cliente desativado com sucesso'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao desativar cliente',
            error: error.message
        });
    }
};