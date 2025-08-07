const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Endpoint para obter informações de versão
router.get('/', async (req, res) => {
    try {
        let versionInfo = {
            timestamp: new Date().toISOString(),
            buildNumber: process.env.BUILD_NUMBER || 'development'
        };

        // Tentar obter o hash do commit atual se disponível
        try {
            const { execSync } = require('child_process');
            const gitHash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
            const gitBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
            
            versionInfo.gitHash = gitHash.substring(0, 8); // Primeiros 8 caracteres
            versionInfo.gitBranch = gitBranch;
            versionInfo.version = `${gitBranch}-${gitHash.substring(0, 8)}`;
        } catch (gitError) {
            // Se não conseguir obter info do git, usar timestamp como versão
            versionInfo.version = `build-${Date.now()}`;
        }

        // Tentar obter informações do package.json
        try {
            const packagePath = path.join(__dirname, '../../package.json');
            const packageInfo = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
            versionInfo.appVersion = packageInfo.version;
        } catch (pkgError) {
            versionInfo.appVersion = '1.0.0';
        }

        res.json(versionInfo);
    } catch (error) {
        console.error('Erro ao obter informações de versão:', error);
        res.status(500).json({ 
            error: 'Erro interno do servidor',
            version: `fallback-${Date.now()}`
        });
    }
});

module.exports = router;