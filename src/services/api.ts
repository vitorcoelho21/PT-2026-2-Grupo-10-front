// Esta instância faz duas coisas automaticamente:
// 1) Antes de cada requisição: anexa o token no cabeçalho Authorization.
// 2) Depois de cada resposta: se o back-end disser "401 Não autorizado", apaga o token e manda para o login.


import { clearToken, getToken } from "@/utils/token";
import axios from "axios";


const api = axios.create({
    // A URL vem do arquivo .env.local.
    // Se a variável não existir, usamos o endereço padrão do back-end local.
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
});

// 1) Interceptor de requisição
// Roda antes de TODA requisição sair do front.
api.interceptors.request.use((config) => {
    const token = getToken();

    // O back-end espera o formato:  Authorization: Bearer <token>
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// 2) Interceptor de resposta
// Roda quando o back-end responde. O primeiro argumento trata o sucesso, o segundo trata os erros.
api.interceptors.response.use(
    (resposta) => resposta,
    (erro) => {
        const veioDoLogin = erro.config?.url?.includes("/auth/login");

        // 401 em qualquer rota (menos o login) significa: "seu token não vale mais".
        // Isso acontece quando ele expira (1 dia) ou quando a senha é trocada.
        if (erro.response?.status === 401 && !veioDoLogin && getToken()) {
            clearToken();
            window.location.href = "/login";
        }

        // Repassa o erro para quem chamou.
        return Promise.reject(erro);
    },
);

export default api;
