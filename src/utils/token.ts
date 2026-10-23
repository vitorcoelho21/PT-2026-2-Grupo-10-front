const KEY = "access_token";


export const getToken = () =>
    typeof window === "undefined" ? null : localStorage.getItem(KEY);
// Salva o token no navegador
export const setToken = (token: string) => localStorage.setItem(KEY, token);
// Limpa o token no navegador
export const clearToken = () => localStorage.removeItem(KEY);