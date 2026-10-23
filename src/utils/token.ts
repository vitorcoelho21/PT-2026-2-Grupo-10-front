const CHAVE_TOKEN = "access_token";

/** Lê o token salvo. Devolve null se o usuário não estiver logado. */
export function getToken(): string | null {
  if (typeof window === "undefined") return null; // estamos no servidor
  return localStorage.getItem(CHAVE_TOKEN);
}

// Salva o token. Chamado logo depois de um login bem-sucedido. */
export function setToken(token: string): void {
  localStorage.setItem(CHAVE_TOKEN, token);
}

// Apaga o token. Usado no logout, quando a sessão expira ou a senha é redefinida. */
export function clearToken(): void {
  localStorage.removeItem(CHAVE_TOKEN);
}