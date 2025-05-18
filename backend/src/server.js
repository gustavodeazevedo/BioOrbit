const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/biocalib', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Aumenta o timeout para 30 segundos
    socketTimeoutMS: 45000, // Aumenta o timeout do socket para 45 segundos
    connectTimeoutMS: 30000, // Aumenta o timeout de conexão para 30 segundos
    // Configurações adicionais para melhorar a estabilidade da conexão
    keepAlive: true,
    keepAliveInitialDelay: 300000 // 5 minutos
})
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Rotas
app.use('/api/equipamentos', require('./routes/equipamentos'));
app.use('/api/calibracoes', require('./routes/calibracoes'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/admin/token', require('./routes/token')); // Adicionando rotas de gerenciamento de token
app.use('/api/clientes', require('./routes/clientes')); // Adicionando rotas de clientes

// Rota padrão
app.get('/', (req, res) => {
    res.send('API do BioCalib funcionando!');
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));