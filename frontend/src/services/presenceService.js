import api from './authService';

class PresenceService {
    constructor() {
        this.heartbeatInterval = null;
        this.HEARTBEAT_INTERVAL = 30000; // 30 segundos
        this.INACTIVE_THRESHOLD = 60000; // 1 minuto para considerar inativo
    }

    // Iniciar rastreamento de presença
    startTracking() {
        this.sendHeartbeat();
        this.heartbeatInterval = setInterval(() => {
            this.sendHeartbeat();
        }, this.HEARTBEAT_INTERVAL);

        // Detectar quando o usuário sai da página
        window.addEventListener('beforeunload', () => {
            this.stopTracking();
        });
    }

    // Parar rastreamento
    stopTracking() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
        this.sendOffline();
    }

    // Enviar heartbeat ao backend
    async sendHeartbeat() {
        try {
            await api.post('/usuarios/heartbeat', {
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Erro ao enviar heartbeat:', error);
        }
    }

    // Marcar como offline
    async sendOffline() {
        try {
            await api.post('/usuarios/offline');
        } catch (error) {
            console.error('Erro ao marcar offline:', error);
        }
    }

    // Obter usuários ativos
    async getActiveUsers() {
        try {
            const response = await api.get('/usuarios/ativos');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar usuários ativos:', error);
            return [];
        }
    }
}

export default new PresenceService();
