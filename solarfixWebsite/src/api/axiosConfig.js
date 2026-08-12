import axios from "axios";
import { BASE_URL } from "../constants/api";

console.log("BASE_URL =", BASE_URL);

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // 🚀 FIX : On ne redirige PAS si l'erreur 401 vient de la tentative de login !
        if (error.response?.status === 401 && !error.config?.url?.includes('/api/auth/login')) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            
            // On vérifie qu'on n'est pas déjà sur la page de login avant de recharger
            if (!window.location.pathname.includes('/login')) {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;