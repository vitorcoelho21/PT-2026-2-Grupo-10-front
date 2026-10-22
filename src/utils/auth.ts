// Mock: salva usuários no localStorage até existir um back-end
/*type Usuario = { nome: string; username: string; email: string; senha: string };

function getUsers(): Usuario[] {
  return JSON.parse(localStorage.getItem("users") || "[]");
}

export async function cadastrar(u: Usuario) {
  const users = getUsers();
  if (users.some((x) => x.email === u.email)) throw new Error("Email já cadastrado.");
  localStorage.setItem("users", JSON.stringify([...users, u]));
}

export async function login(email: string, senha: string) {
  if (!getUsers().some((x) => x.email === email && x.senha === senha)) {
    throw new Error("Email ou senha incorretos.");
  }
}
*/