import axios from 'axios';

const API_URL = 'http://localhost:5000/api/clientes';

// Configuração para incluir token em todas as requisições
const getConfig = () => {
    // Recupera o objeto userInfo completo do localStorage
    const userInfo = localStorage.getItem('userInfo');
    // Se userInfo existe, extrai o token do objeto
    const token = userInfo ? JSON.parse(userInfo).token : null;

    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

// Obter todos os clientes
export const getClientes = async () => {
    try {
        const response = await axios.get(API_URL, getConfig());
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar clientes:', error.response?.data || error.message);
        throw error.response?.data || { message: 'Erro ao buscar clientes', error: error.message };
    }
};

// Obter cliente por ID
export const getClienteById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`, getConfig());
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar cliente:', error.response?.data || error.message);
        throw error.response?.data || { message: 'Erro ao buscar cliente', error: error.message };
    }
};

// Criar novo cliente
export const createCliente = async (clienteData) => {
    try {
        const response = await axios.post(API_URL, clienteData, getConfig());
        return response.data;
    } catch (error) {
        // Mostrar detalhes completos do erro no console
        console.error('Erro ao cadastrar cliente:', error);
        console.error('Detalhes da resposta:', error.response?.data);
        console.error('Status:', error.response?.status);

        // Lança um objeto de erro mais detalhado
        throw error.response?.data || {
            message: 'Erro ao cadastrar cliente',
            error: error.message,
            status: error.response?.status
        };
    }
};

// Atualizar cliente
export const updateCliente = async (id, clienteData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, clienteData, getConfig());
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error.response?.data || error.message);
        throw error.response?.data || { message: 'Erro ao atualizar cliente', error: error.message };
    }
};

// Excluir cliente (desativar)
export const deleteCliente = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`, getConfig());
        return response.data;
    } catch (error) {
        console.error('Erro ao excluir cliente:', error.response?.data || error.message);
        throw error.response?.data || { message: 'Erro ao excluir cliente', error: error.message };
    }
};