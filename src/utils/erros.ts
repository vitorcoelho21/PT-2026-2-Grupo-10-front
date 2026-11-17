import { isAxiosError } from "axios";

export function extrairMensagemErro(
    err: unknown,
    padrao = "Ocorreu um erro. Tente novamente.",
): string {
    // Se não for um erro do axios mas for uma instância de Error, devolvemos a mensagem dele.
    if (!isAxiosError(err)) {
        if (err instanceof Error && err.message) return err.message;
        return padrao;
    }

    // Não houve resposta do servidor: back-end desligado ou sem internet.
    if (!err.response) return "Erro de conexão. Tente novamente.";

    // Limite de requisições atingido.
    if (err.response.status === 429) {
        return "Muitas tentativas seguidas. Aguarde um minuto e tente de novo.";
    }

    const mensagem = err.response.data?.message;

    // Lista de erros: mostramos só o primeiro para não poluir a tela.
    if (Array.isArray(mensagem)) return mensagem[0];

    // Texto simples vindo do back-end.
    if (typeof mensagem === "string") return mensagem;

    return padrao;
}
