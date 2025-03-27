const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Middleware para proteger rotas - verifica se o usuário está autenticado
const protect = async (req, res, next) => {
    let token;

    // Verifica se o token existe no header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Obtém o token do header
            token = req.headers.authorization.split(' ')[1];

            // Verifica o token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Obtém os dados do usuário sem a senha
            req.usuario = await Usuario.findById(decoded.id).select('-senha');

            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Não autorizado, token inválido');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Não autorizado, sem token');
    }
};

// Middleware para verificar se o usuário é admin
const admin = (req, res, next) => {
    if (req.usuario && req.usuario.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error('Não autorizado como administrador');
    }
};

module.exports = { protect, admin };