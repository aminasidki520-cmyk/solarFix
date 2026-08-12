import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native'; // 🚀 AJOUT IMPORTANT
import { BASE_URL } from '../constants/api';

console.log('[API] Using BASE_URL:', BASE_URL);

const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

// ─── Request interceptor: attach JWT token ────────────────────────────
apiClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        console.log('[AXIOS] Request:', config.method.toUpperCase(), config.baseURL + config.url);
        console.log('[AXIOS] Token present?', token ? '✅ YES' : '❌ NO');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ─── Unauthorized handler (to be set by AuthContext) ──────────────────
let unauthorizedHandler = null;

export const setUnauthorizedHandler = (handler) => {
    unauthorizedHandler = handler;
};

// ─── Response interceptor: handle 401 ─────────────────────────────────
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            
            // 1. Récupérer le message envoyé par le AuthEntryPointJwt du backend
            let message = "Your session has expired. Please log in again.";
            if (error.response?.data && typeof error.response.data === 'object' && error.response.data.message) {
                message = error.response.data.message;
            }

            // 2. Retourner une Promise pour bloquer la chaîne tant que l'utilisateur n'a pas cliqué sur "OK"
            return new Promise((resolve, reject) => {
                Alert.alert(
                    "Session Expired",
                    message,
                    [
                        {
                            text: "OK",
                            onPress: async () => {
                                // 🚀 On ne se déconnecte QUE quand le bouton est pressé
                                await AsyncStorage.multiRemove(['token', 'username', 'role']);
                                if (unauthorizedHandler) {
                                    unauthorizedHandler(); // Redirige vers l'écran de login
                                }
                                reject(error); // L'erreur est complètement rejetée après la déconnexion
                            }
                        }
                    ],
                    { cancelable: false } // Empêche de fermer la popup sans cliquer sur "OK"
                );
            });
        }
        return Promise.reject(error);
    }
);

export default apiClient;