const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configuração CORS explícita
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:4173',
        'https://bio-orbit.vercel.app',
        'https://bioorbit.vercel.app',
        'https://www.bio-orbit.vercel.app',
        process.env.FRONTEND_URL
    ].filter(Boolean), // Remove valores undefined
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200 // Para compatibilidade com navegadores legados
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Middleware de debug para CORS
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Origin: ${req.get('Origin')}`);
    next();
});

// Middleware adicional para OPTIONS
app.options('*', cors(corsOptions));

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

// Rota de health check
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Rota de teste CORS (pública)
app.get('/api/test', (req, res) => {
    res.status(200).json({ 
        message: 'CORS test successful', 
        origin: req.get('Origin'),
        timestamp: new Date().toISOString()
    });
});

// Rota padrão
app.get('/', (req, res) => {
    res.send('API do BioCalib funcionando!');
});// Middleware de tratamento de erros
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