// Define a configuração do token corporativo
module.exports = {
    // Em ambiente de produção, isso deve ser armazenado em variáveis de ambiente
    corporateToken: process.env.CORPORATE_TOKEN || 'BioKeyOne',

    // Token permanente (sem expiração)
    tokenValidityDays: null,

    // Número máximo de tentativas incorretas antes de aplicar bloqueio temporário
    maxFailedAttempts: 5,

    // Tempo de bloqueio após exceder tentativas (em minutos)
    lockoutTime: 30
};