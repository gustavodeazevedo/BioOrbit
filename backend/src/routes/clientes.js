const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');
const { protect } = require('../middlewares/auth');

// Rota de teste sem autenticação para debug
router.get('/test', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.status(200).json({
        message: 'Rota de clientes funcionando',
        timestamp: new Date().toISOString(),
        origin: req.get('Origin')
    });
});

// Proteger todas as outras rotas
router.use(protect);

// Rotas para clientes
router.get('/', clientesController.getClientes);
router.get('/:id', clientesController.getCliente);
router.post('/', clientesController.createCliente);
router.put('/:id', clientesController.updateCliente);
router.delete('/:id', clientesController.deleteCliente);

module.exports = router;