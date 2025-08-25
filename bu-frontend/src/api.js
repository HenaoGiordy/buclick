import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

// Configurar baseURL directamente desde las variables de entorno
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    headers: {
        "Content-Type": "application/json",
        'Accept': "application/json",
    },
});

// Configurar WebSocket URL globalmente si es necesario
window.env = {
    WEB_SOCKET: import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws'
};

// Interceptor para agregar el token de autorización
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;