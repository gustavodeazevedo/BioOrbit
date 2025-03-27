const express = require('express');
const router = express.Router();
const {
    getCalibracoes,
    getCalibracaoById,
    createCalibracao,
    updateCalibracao,
    deleteCalibracao
} = require('../controllers/calibracoesController');
const { protect, admin } = require('../middlewares/auth');

// @route   GET api/calibracoes
// @desc    Get all calibracoes
// @access  Public
router.get('/', getCalibracoes);

// @route   GET api/calibracoes/:id
// @desc    Get calibracao by ID
// @access  Public
router.get('/:id', getCalibracaoById);

// @route   POST api/calibracoes
// @desc    Create a calibracao
// @access  Private
router.post('/', protect, createCalibracao);

// @route   PUT api/calibracoes/:id
// @desc    Update calibracao
// @access  Private
router.put('/:id', protect, updateCalibracao);

// @route   DELETE api/calibracoes/:id
// @desc    Delete calibracao
// @access  Private
router.delete('/:id', protect, deleteCalibracao);

module.exports = router;