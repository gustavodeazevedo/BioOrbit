const mongoose = require('mongoose');

const tokenLogSchema = mongoose.Schema({
    // Endereço IP de onde veio a tentativa
    ipAddress: {
        type: String,
        required: true
    },
    // Data e hora da tentativa
    timestamp: {
        type: Date,
        default: Date.now
    },
    // Token fornecido na tentativa (armazenado para auditoria)
    tokenAttempt: {
        type: String,
        required: true
    },
    // Se a tentativa foi bem-sucedida
    success: {
        type: Boolean,
        required: true
    },
    // Email usado na tentativa (se fornecido)
    email: {
        type: String
    },
    // Tipo de operação (registro ou login)
    operationType: {
        type: String,
        enum: ['registro', 'login'],
        required: true
    }
});

// Índice para facilitar consultas por IP para detectar múltiplas tentativas
tokenLogSchema.index({ ipAddress: 1, timestamp: -1 });

const TokenLog = mongoose.model('TokenLog', tokenLogSchema);

module.exports = TokenLog;