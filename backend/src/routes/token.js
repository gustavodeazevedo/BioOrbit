const express = require('express');
const router = express.Router();
const {
    updateCorporateToken,
    getCurrentToken,
    getTokenLogs
} = require('../controllers/tokenController');
const { protect, admin } = require('../middlewares/auth');

// @route   GET /api/admin/token/current
// @desc    Obter token corporativo atual
// @access  Private/Admin
router.get('/current', protect, admin, getCurrentToken);

// @route   POST /api/admin/token/update
// @desc    Gerar novo token corporativo
// @access  Private/Admin
router.post('/update', protect, admin, updateCorporateToken);

// @route   GET /api/admin/token/logs
// @desc    Obter logs de tentativas com token
// @access  Private/Admin
router.get('/logs', protect, admin, getTokenLogs);

module.exports = router;