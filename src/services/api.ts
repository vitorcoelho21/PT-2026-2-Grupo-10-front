import { clearToken, getToken } from "@/utils/token";
import axios from "axios";

const api = axios.create({

    baseURL: "http://localhost:3000/",

});

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (res) => res,
    (error) => {
        const ehLogin = error.config?.url?.includes("/auth/login");
        // 401 fora do login = sessão expirada ou senha trocada (o back invalida o token)
        if (error.response?.status === 401 && !ehLogin && getToken()) {
            clearToken();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    },
);


export default api;

