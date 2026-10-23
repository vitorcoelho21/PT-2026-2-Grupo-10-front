// Funções que falam com as rotas /auth/* do back-end.
// Os componentes (formulários) chamam estas funções e cuidam de mostrar os erros.


import {
  LoginFormato,
  MensagemResposta,
  TokenResposta,
  UsuarioLogado,
} from "@/types/user";
import { clearToken, setToken } from "@/utils/token";
import api from "./api";


// POST /auth/login
// Envia email e senha. Se estiverem certos, o back-end devolve o token 
// Se estiverem errados, o back-end responde 401 envia a mensagem de erro.
export const login = async (credentials: LoginFormato) => {
  const { data } = await api.post<TokenResposta>("/auth/login", credentials);
  setToken(data.access_token); // guarda o "crachá" para as próximas requisições
  return data;
};


// Logout remove o token do navegador
export const logout = () => clearToken();


// GET /auth/me
// Devolve quem está logado (id e email, lidos de dentro do token).
export const getMe = async () => {
  const { data } = await api.get<UsuarioLogado>("/auth/me");
  return data;
};

// POST /auth/forgot-password
// Pede o e-mail de recuperação. O back-end SEMPRE responde 200 com a mensagem, 
// o e-mail existindo ou não, evitando divulgar quais emails estão cadastrados ou não
export const forgotPassword = async (email: string) => {
  const { data } = await api.post<MensagemResposta>("/auth/forgot-password", { email });
  return data;
};

// POST /auth/reset-password
// Troca a senha usando o token que veio no link do e-mail.
// Erros possíveis: 400 (token inválido/expirado ou senha curta) e 429 (muitas tentativas)

export const resetPassword = async (token: string, novaSenha: string) => {
  const { data } = await api.post<MensagemResposta>("/auth/reset-password", {
    token,
    novaSenha,
  });
  return data;
};
