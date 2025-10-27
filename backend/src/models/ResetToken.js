const mongoose = require('mongoose');

const resetTokenSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true,
        // Token expira em 1 hora
        default: () => new Date(Date.now() + 60 * 60 * 1000)
    },
    usado: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // Remove automaticamente após 2 horas
        expires: 7200
    }
});

// Índice para melhorar performance nas buscas
resetTokenSchema.index({ token: 1, usado: 1 });
resetTokenSchema.index({ expiresAt: 1 });

const ResetToken = mongoose.model('ResetToken', resetTokenSchema);

module.exports = ResetToken;
