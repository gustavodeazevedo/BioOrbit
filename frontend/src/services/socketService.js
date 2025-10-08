import { io } from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.onUsersUpdateCallback = null;
    }

    // Conectar ao servidor Socket.IO
    connect(userData) {
        const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

        console.log('🔌 Conectando ao Socket.IO:', SOCKET_URL);

        this.socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        // Eventos de conexão
        this.socket.on('connect', () => {
            console.log('✅ Socket.IO conectado:', this.socket.id);
            this.isConnected = true;

            // Registrar usuário como online
            this.socket.emit('user:online', userData);

            // Enviar heartbeat a cada 10 segundos
            this.heartbeatInterval = setInterval(() => {
                this.socket.emit('user:heartbeat', userData);
            }, 10000);
        });

        this.socket.on('disconnect', () => {
            console.log('🔌 Socket.IO desconectado');
            this.isConnected = false;
            if (this.heartbeatInterval) {
                clearInterval(this.heartbeatInterval);
            }
        });

        this.socket.on('connect_error', (error) => {
            console.error('❌ Erro de conexão Socket.IO:', error);
        });

        // Receber atualizações de usuários
        this.socket.on('users:update', (users) => {
            console.log('👥 Atualização de usuários recebida:', users);
            if (this.onUsersUpdateCallback) {
                this.onUsersUpdateCallback(users);
            }
        });
    }

    // Registrar callback para atualização de usuários
    onUsersUpdate(callback) {
        this.onUsersUpdateCallback = callback;
    }

    // Desconectar
    disconnect() {
        if (this.socket) {
            console.log('👋 Desconectando Socket.IO');
            if (this.heartbeatInterval) {
                clearInterval(this.heartbeatInterval);
            }
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
        }
    }

    // Solicitar lista de usuários online
    requestUsersList() {
        if (this.socket && this.isConnected) {
            this.socket.emit('users:request');
        }
    }
}

export default new SocketService();
