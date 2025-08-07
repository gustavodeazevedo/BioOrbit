import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/version` : 'http://localhost:5000/api/version';

// Chave para armazenar a versão atual no localStorage
const VERSION_STORAGE_KEY = 'bioorbit_current_version';

// Serviço para verificação de versão
const versionService = {
    // Obter informações de versão do servidor
    getVersionInfo: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error('Erro ao obter versão:', error);
            throw error;
        }
    },

    // Salvar versão atual localmente
    setCurrentVersion: (versionInfo) => {
        localStorage.setItem(VERSION_STORAGE_KEY, JSON.stringify(versionInfo));
    },

    // Obter versão atual salva localmente
    getCurrentVersion: () => {
        const stored = localStorage.getItem(VERSION_STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    },

    // Verificar se há uma nova versão disponível
    checkForUpdates: async () => {
        try {
            const latestVersion = await versionService.getVersionInfo();
            const currentVersion = versionService.getCurrentVersion();

            // Se não há versão salva, salvar a atual
            if (!currentVersion) {
                versionService.setCurrentVersion(latestVersion);
                return { hasUpdate: false, currentVersion: latestVersion, latestVersion };
            }

            // Comparar versões
            const hasUpdate = currentVersion.version !== latestVersion.version;
            
            return {
                hasUpdate,
                currentVersion,
                latestVersion
            };
        } catch (error) {
            console.error('Erro ao verificar atualizações:', error);
            throw error;
        }
    },

    // Forçar atualização da página
    forceUpdate: () => {
        // Limpar cache do localStorage se necessário
        localStorage.removeItem(VERSION_STORAGE_KEY);
        
        // Recarregar a página
        window.location.reload(true);
    }
};

export default versionService;