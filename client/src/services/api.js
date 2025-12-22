import axios from 'axios';
import { auth } from '../config/firebaseConfig';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests automatically
api.interceptors.request.use(
    async (config) => {
        const user = auth.currentUser;
        if (user) {
            const token = await user.getIdToken();
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Transaction API methods
export const transactionAPI = {
    // Get all transactions for current user
    getTransactions: async () => {
        const response = await api.get('/transactions');
        return response.data;
    },

    // Add new transaction
    addTransaction: async (transactionData) => {
        const response = await api.post('/transactions', transactionData);
        return response.data;
    },

    // Delete transaction
    deleteTransaction: async (id) => {
        const response = await api.delete(`/transactions/${id}`);
        return response.data;
    },
};

export default api;
