const TokenLog = require('../models/TokenLog');
const tokenConfig = require('../config/tokenConfig');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

/**
 * Gera um novo token corporativo aleatório
 */
const generateRandomToken = () => {
    return crypto.randomBytes(16).toString('hex');
};

/**
 * @desc    Atualizar o token corporativo
 * @route   POST /api/admin/token/update
 * @access  Private/Admin
 */
const updateCorporateToken = async (req, res) => {
    try {
        // Gerar novo token
        const newToken = generateRandomToken();

        // Caminho para o arquivo de configuração
        const configFilePath = path.join(__dirname, '../config/tokenConfig.js');

        // Ler o conteúdo atual do arquivo
        let configContent = await fs.readFile(configFilePath, 'utf8');

        // Substituir o token atual pelo novo
        configContent = configContent.replace(
            /corporateToken: process\.env\.CORPORATE_TOKEN \|\| ['"](.*)['"],/,
            `corporateToken: process.env.CORPORATE_TOKEN || '${newToken}',`
        );

        // Escrever o arquivo atualizado
        await fs.writeFile(configFilePath, configContent, 'utf8');

        // Atualizar a configuração em memória
        tokenConfig.corporateToken = newToken;

        res.json({
            success: true,
            message: 'Token corporativo atualizado com sucesso',
            token: newToken
        });
    } catch (error) {
        console.error('Erro ao atualizar token corporativo:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar token corporativo'
        });
    }
};

/**
 * @desc    Obter o token corporativo atual
 * @route   GET /api/admin/token/current
 * @access  Private/Admin
 */
const getCurrentToken = (req, res) => {
    try {
        res.json({
            token: tokenConfig.corporateToken,
            validityDays: tokenConfig.tokenValidityDays
        });
    } catch (error) {
        console.error('Erro ao obter token corporativo:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao obter token corporativo'
        });
    }
};

/**
 * @desc    Obter logs de tentativas de token
 * @route   GET /api/admin/token/logs
 * @access  Private/Admin
 */
const getTokenLogs = async (req, res) => {
    try {
        // Parâmetros de paginação e filtro
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const startIndex = (page - 1) * limit;
        const filter = {};

        // Aplicar filtros se fornecidos
        if (req.query.success) {
            filter.success = req.query.success === 'true';
        }

        if (req.query.operationType) {
            filter.operationType = req.query.operationType;
        }

        // Consultar logs com paginação
        const logs = await TokenLog.find(filter)
            .sort({ timestamp: -1 })
            .skip(startIndex)
            .limit(limit);

        // Contar total de documentos para paginação
        const total = await TokenLog.countDocuments(filter);

        res.json({
            logs,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Erro ao obter logs de token:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao obter logs de token'
        });
    }
};

module.exports = {
    updateCorporateToken,
    getCurrentToken,
    getTokenLogs
};