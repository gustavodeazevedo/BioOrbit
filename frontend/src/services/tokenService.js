import axios from 'axios';
import authService from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/admin/token';

// Configurar o axios para incluir o token JWT em todas as requisições
const axiosWithAuth = () => {
    const userInfo = authService.getCurrentUser();
    const config = {
        headers: {
            Authorization: userInfo ? `Bearer ${userInfo.token}` : ''
        }
    };
    return config;
};

// Serviço para gerenciamento de token corporativo
const tokenService = {
    // Obter o token corporativo atual
    getCurrentToken: async () => {
        try {
            const response = await axios.get(`${API_URL}/current`, axiosWithAuth());
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Erro ao obter token corporativo';
        }
    },

    // Atualizar o token corporativo
    updateToken: async () => {
        try {
            const response = await axios.post(`${API_URL}/update`, {}, axiosWithAuth());
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Erro ao atualizar token corporativo';
        }
    },

    // Obter logs de tentativas de token
    getLogs: async (page = 1, limit = 20, filters = {}) => {
        try {
            const queryParams = new URLSearchParams({
                page,
                limit,
                ...filters
            });

            const response = await axios.get(
                `${API_URL}/logs?${queryParams.toString()}`,
                axiosWithAuth()
            );

            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Erro ao obter logs de token';
        }
    }
};

export default tokenService;