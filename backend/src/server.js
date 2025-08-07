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
})
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Rotas
app.use('/api/equipamentos', require('./routes/equipamentos'));
app.use('/api/calibracoes', require('./routes/calibracoes'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/admin/token', require('./routes/token')); // Adicionando rotas de gerenciamento de token
app.use('/api/clientes', require('./routes/clientes')); // Adicionando rotas de clientes
app.use('/api/version', require('./routes/version')); // Adicionando rota de versão

// Rota padrão
app.get('/', (req, res) => {
    res.send('API do BioCalib funcionando!');
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo deu errado!' });
});

// Health check para o Render
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});