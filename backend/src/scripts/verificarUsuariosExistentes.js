const mongoose = require('mongoose');
require('dotenv').config();

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/biocalib', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => {
        console.error('Erro ao conectar ao MongoDB:', err);
        process.exit(1);
    });

// Importar o modelo de usuário
const Usuario = require('../models/Usuario');

// Função para atualizar todos os usuários existentes
async function verificarUsuarios() {
    try {
        console.log('Iniciando atualização de usuários...');

        // Encontrar usuários não verificados
        const usuarios = await Usuario.find({ verificado: { $ne: true } });

        console.log(`Encontrados ${usuarios.length} usuários não verificados.`);

        if (usuarios.length > 0) {
            // Atualizar todos os usuários não verificados
            const resultado = await Usuario.updateMany(
                { verificado: { $ne: true } },
                { $set: { verificado: true } }
            );

            console.log(`${resultado.modifiedCount} usuários foram verificados com sucesso!`);
        } else {
            console.log('Não há usuários para verificar.');
        }

        console.log('Processo concluído!');
        process.exit(0);
    } catch (error) {
        console.error('Erro ao atualizar usuários:', error);
        process.exit(1);
    }
}

// Executar a função
verificarUsuarios();