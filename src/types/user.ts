

export interface CadastroFormato{

    username : string;
    nome: string;
    email: string;
    senhaHash: string;
    fotoPerfilUrl?: string;

}

export interface LoginFormato{

    email: string;
    senhaHash: string;

}
