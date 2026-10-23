// Tipos TypeScript que descrevem o formato dos dados trocados com o back-end.
// Os nomes dos campos precisam ser IDÊNTICOS aos dos DTOs do back-end.


// Corpo do POST /user (cadastro)
export interface CadastroFormato {
  username: string;
  nome: string;
  email: string;
  senhaHash: string; // o back-end chama a senha em texto puro de "senhaHash" e faz o hash dela
  fotoPerfilUrl?: string;
}

// Corpo do POST /auth/login
export interface LoginFormato {
  email: string;
  senhaHash: string;
}

// Resposta do POST /auth/login
export interface TokenResposta {
  access_token: string;
}

// Resposta do POST /auth/forgot-password e do POST /auth/reset-password
export interface MensagemResposta {
  message: string;
}

// Resposta do GET /auth/me: o conteúdo (payload) do token de quem está logado
export interface UsuarioLogado {
  sub: number; // id do usuário
  email: string;
  iat?: number; // quando o token foi criado
  exp?: number; // quando o token expira
}
