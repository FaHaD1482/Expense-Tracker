import axios from 'axios';
import { auth } from '../config/firebaseConfig';

// Ensure the base URL ends with a slash and includes /api if forgotten
let rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api';
if (!rawBaseUrl.includes('/api')) {
    rawBaseUrl = rawBaseUrl.replace(/\/$/, '') + '/api';
}
const API_BASE_URL = rawBaseUrl.replace(/\/$/, '') + '/';

console.log('[API] Using Base URL:', API_BASE_URL);

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

// Helper to get token with direct listener to avoid race conditions
const getValidToken = () => {
    return new Promise((resolve) => {
        // Check immediate first
        if (auth.currentUser) {
            auth.currentUser.getIdToken(true).then(resolve).catch(() => resolve(null));
            return;
        }

        // Wait for state change if null
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            unsubscribe();
            if (user) {
                const token = await user.getIdToken(true);
                resolve(token);
            } else {
                resolve(null);
            }
        });

        // Set a timeout so we don't hang forever
        setTimeout(() => {
            unsubscribe();
            resolve(null);
        }, 5000);
    });
};

// Add token to requests automatically
api.interceptors.request.use(
    async (config) => {
        const token = await getValidToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            // Optional: console.log(`[API] Token attached to ${config.url}`);
        } else {
            console.warn(`[API] Request to ${config.url} sent without token (user not authenticated)`);
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
        // Use relative path without leading slash
        const response = await api.get('transactions');
        return response.data;
    },

    // Add new transaction
    addTransaction: async (transactionData) => {
        const response = await api.post('transactions', transactionData);
        return response.data;
    },

    // Delete transaction
    deleteTransaction: async (id) => {
        const response = await api.delete(`transactions/${id}`);
        return response.data;
    },
};

export default api;
