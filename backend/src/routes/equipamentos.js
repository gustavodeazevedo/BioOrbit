const express = require('express');
const router = express.Router();
const {
    getEquipamentos,
    getEquipamentoById,
    createEquipamento,
    updateEquipamento,
    deleteEquipamento
} = require('../controllers/equipamentosController');
const { protect, admin } = require('../middlewares/auth');

// @route   GET api/equipamentos
// @desc    Get all equipamentos
// @access  Public
router.get('/', getEquipamentos);

// @route   GET api/equipamentos/:id
// @desc    Get equipamento by ID
// @access  Public
router.get('/:id', getEquipamentoById);

// @route   POST api/equipamentos
// @desc    Create a new equipamento
// @access  Private/Admin
router.post('/', protect, admin, createEquipamento);

// @route   PUT api/equipamentos/:id
// @desc    Update equipamento
// @access  Private/Admin
router.put('/:id', protect, admin, updateEquipamento);

// @route   DELETE api/equipamentos/:id
// @desc    Delete equipamento
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteEquipamento);

module.exports = router;