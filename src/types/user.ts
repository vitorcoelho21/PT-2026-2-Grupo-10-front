

export interface CadastroPayload{

    username : string;
    some: string;
    email: string;
    senhaHash: string;
    fotoPerfilUrl?: string;

}

export interface LoginPayload{

    email: string;
    senhaHash: string;




}