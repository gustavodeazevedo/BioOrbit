const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

// Função para gerar token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'abc123', {
        expiresIn: '30d'
    });
};

// @desc    Autenticar usuário e gerar token
// @route   POST /api/usuarios/login
// @access  Public
const authUsuario = async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Verificar se o usuário existe
        // Adicionando timeout explícito para a operação findOne
        const usuario = await Usuario.findOne({ email }).maxTimeMS(15000); // 15 segundos de timeout

        if (usuario && (await usuario.matchPassword(senha))) {
            // Verificar se a conta está verificada como funcionário
            if (!usuario.verificado) {
                return res.status(401).json({
                    message: 'Conta não verificada. Entre em contato com o administrador.'
                });
            }

            res.json({
                _id: usuario._id,
                nome: usuario.nome,
                email: usuario.email,
                cargo: usuario.cargo,
                setor: usuario.setor,
                verificado: usuario.verificado,
                isAdmin: usuario.isAdmin,
                token: generateToken(usuario._id)
            });
        } else {
            res.status(401).json({ message: 'Email ou senha inválidos' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Registrar um novo usuário
// @route   POST /api/usuarios
// @access  Public
const registerUsuario = async (req, res) => {
    try {
        const { nome, email, senha, cargo, setor, isAdmin } = req.body;

        // Verificar se o usuário já existe
        // Adicionando timeout explícito para a operação findOne
        const usuarioExists = await Usuario.findOne({ email }).maxTimeMS(15000); // 15 segundos de timeout

        if (usuarioExists) {
            return res.status(400).json({ message: 'Usuário já existe' });
        }

        // Criar novo usuário - agora incluindo o campo verificado como true porque passou pelo middleware de token
        const usuario = await Usuario.create({
            nome,
            email,
            senha,
            cargo,
            setor,
            verificado: true,
            isAdmin: isAdmin || false
        });

        if (usuario) {
            res.status(201).json({
                _id: usuario._id,
                nome: usuario.nome,
                email: usuario.email,
                cargo: usuario.cargo,
                setor: usuario.setor,
                verificado: usuario.verificado,
                isAdmin: usuario.isAdmin,
                token: generateToken(usuario._id)
            });
        } else {
            res.status(400).json({ message: 'Dados de usuário inválidos' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Obter perfil do usuário
// @route   GET /api/usuarios/perfil
// @access  Private
const getUsuarioPerfil = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario._id);

        if (usuario) {
            res.json({
                _id: usuario._id,
                nome: usuario.nome,
                email: usuario.email,
                cargo: usuario.cargo,
                setor: usuario.setor,
                isAdmin: usuario.isAdmin
            });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Atualizar perfil do usuário
// @route   PUT /api/usuarios/perfil
// @access  Private
const updateUsuarioPerfil = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario._id);

        if (usuario) {
            usuario.nome = req.body.nome || usuario.nome;
            usuario.email = req.body.email || usuario.email;
            usuario.cargo = req.body.cargo || usuario.cargo;
            usuario.setor = req.body.setor || usuario.setor;

            if (req.body.senha) {
                usuario.senha = req.body.senha;
            }

            const updatedUsuario = await usuario.save();

            res.json({
                _id: updatedUsuario._id,
                nome: updatedUsuario.nome,
                email: updatedUsuario.email,
                cargo: updatedUsuario.cargo,
                setor: updatedUsuario.setor,
                isAdmin: updatedUsuario.isAdmin,
                token: generateToken(updatedUsuario._id)
            });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Obter todos os usuários
// @route   GET /api/usuarios
// @access  Private/Admin
const getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find({}).select('-senha');
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Obter usuário por ID
// @route   GET /api/usuarios/:id
// @access  Private/Admin
const getUsuarioById = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id).select('-senha');

        if (usuario) {
            res.json(usuario);
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Atualizar usuário
// @route   PUT /api/usuarios/:id
// @access  Private/Admin
const updateUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);

        if (usuario) {
            usuario.nome = req.body.nome || usuario.nome;
            usuario.email = req.body.email || usuario.email;
            usuario.cargo = req.body.cargo || usuario.cargo;
            usuario.setor = req.body.setor || usuario.setor;
            usuario.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : usuario.isAdmin;

            const updatedUsuario = await usuario.save();

            res.json({
                _id: updatedUsuario._id,
                nome: updatedUsuario.nome,
                email: updatedUsuario.email,
                cargo: updatedUsuario.cargo,
                setor: updatedUsuario.setor,
                isAdmin: updatedUsuario.isAdmin
            });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Remover usuário
// @route   DELETE /api/usuarios/:id
// @access  Private/Admin
const deleteUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);

        if (usuario) {
            await usuario.deleteOne();
            res.json({ message: 'Usuário removido' });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    authUsuario,
    registerUsuario,
    getUsuarioPerfil,
    updateUsuarioPerfil,
    getUsuarios,
    getUsuarioById,
    updateUsuario,
    deleteUsuario
};