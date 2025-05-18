const tokenConfig = require('../config/tokenConfig');
const TokenLog = require('../models/TokenLog');

/**
 * Middleware para validar o token corporativo
 * Registra tentativas de acesso e implementa proteção contra força bruta
 */
const verifyToken = async (req, res, next) => {
    const { corporateToken } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const email = req.body.email;
    const operationType = req.path.includes('login') ? 'login' : 'registro';

    // Verificar se token foi fornecido
    if (!corporateToken) {
        return res.status(400).json({
            success: false,
            message: 'Token corporativo não fornecido'
        });
    }

    try {
        // Verificar se este IP excedeu o limite de tentativas
        const recentAttempts = await TokenLog.find({
            ipAddress,
            success: false,
            timestamp: { $gte: new Date(Date.now() - tokenConfig.lockoutTime * 60 * 1000) }
        }).count();

        // Se excedeu o limite, bloqueie temporariamente
        if (recentAttempts >= tokenConfig.maxFailedAttempts) {
            return res.status(429).json({
                success: false,
                message: `Muitas tentativas incorretas. Tente novamente em ${tokenConfig.lockoutTime} minutos.`
            });
        }

        // Validar o token
        const isValid = corporateToken === tokenConfig.corporateToken;

        // Registrar a tentativa no log
        await TokenLog.create({
            ipAddress,
            tokenAttempt: corporateToken,
            success: isValid,
            email,
            operationType
        });

        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: 'Token corporativo inválido'
            });
        }

        // Se chegou até aqui, o token é válido
        req.tokenVerified = true;
        next();

    } catch (error) {
        console.error('Erro ao verificar token:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao processar verificação do token'
        });
    }
};

module.exports = { verifyToken };