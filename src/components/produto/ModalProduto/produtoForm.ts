// Tudo que é "regra" do formulário de produto, sem nada de tela:
// o formato dos dados, o formulário vazio, o preço e a validação.

// O back-end só guarda a URL das imagens (não recebe arquivo),
// então cada espaço de foto guarda uma URL ("" = vazio).
export interface ProdutoForm {
  nome: string;
  categoriaId: number | "";
  descricao: string;
  preco: string; // formatado, ex.: "R$ 4,70"
  estoque: number;
  imagens: string[]; // [principal, extra1, extra2, extra3]
}

export const FORM_VAZIO: ProdutoForm = {
  nome: "",
  categoriaId: "",
  descricao: "",
  preco: "",
  estoque: 1,
  imagens: ["", "", "", ""],
};

export const formatarPreco = (valor: number) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// "R$ 1.234,50" -> 1234.5
export const precoParaNumero = (preco: string) => Number(preco.replace(/\D/g, "")) / 100;

// Enquanto digita: mantém só os dígitos e mostra como R$ 0,00
export const mascararPreco = (texto: string) => {
  const digitos = texto.replace(/\D/g, "");
  return digitos ? formatarPreco(Number(digitos) / 100) : "";
};

// Devolve a mensagem de erro, ou null se estiver tudo certo
export function validarProduto(form: ProdutoForm): string | null {
  if (!form.nome.trim() || form.categoriaId === "" || !form.preco) {
    return "Preencha nome, categoria e preço.";
  }
  const urlInvalida = form.imagens.some((u) => u && !/^https?:\/\/\S+$/.test(u.trim()));
  if (urlInvalida) {
    return "As fotos precisam ser links começando com http:// ou https://";
  }
  return null;
}

// Estilo dos campos brancos arredondados do modal
export const ESTILO_CAMPO =
  "w-full rounded-full bg-white px-5 py-3 text-sm text-black outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#6A38F3]";
