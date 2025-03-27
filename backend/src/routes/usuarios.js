const express = require('express');
const router = express.Router();
const {
    authUsuario,
    registerUsuario,
    getUsuarioPerfil,
    updateUsuarioPerfil,
    getUsuarios,
    getUsuarioById,
    updateUsuario,
    deleteUsuario
} = require('../controllers/usuariosController');
const { protect, admin } = require('../middlewares/auth');

// @route   POST /api/usuarios/login
// @desc    Authenticate usuario & get token
// @access  Public
router.post('/login', authUsuario);

// @route   POST /api/usuarios
// @desc    Register a usuario
// @access  Public
router.post('/', registerUsuario);

// @route   GET /api/usuarios/perfil
// @desc    Get user profile
// @access  Private
router.get('/perfil', protect, getUsuarioPerfil);

// @route   PUT /api/usuarios/perfil
// @desc    Update user profile
// @access  Private
router.put('/perfil', protect, updateUsuarioPerfil);

// @route   GET /api/usuarios
// @desc    Get all usuarios
// @access  Private/Admin
router.get('/', protect, admin, getUsuarios);

// @route   GET /api/usuarios/:id
// @desc    Get usuario by ID
// @access  Private/Admin
router.get('/:id', protect, admin, getUsuarioById);

// @route   PUT /api/usuarios/:id
// @desc    Update usuario
// @access  Private/Admin
router.put('/:id', protect, admin, updateUsuario);

// @route   DELETE /api/usuarios/:id
// @desc    Delete usuario
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteUsuario);

module.exports = router;