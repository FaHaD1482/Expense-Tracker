import axios from 'axios';
import { auth } from '../config/firebaseConfig';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper to get current user with potential wait for auth initialization
const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            unsubscribe();
            resolve(user);
        }, reject);
    });
};

// Add token to requests automatically
api.interceptors.request.use(
    async (config) => {
        // First try immediate access
        let user = auth.currentUser;

        // If null, wait for auth to initialize (common on page load)
        if (!user) {
            user = await getCurrentUser();
        }

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
