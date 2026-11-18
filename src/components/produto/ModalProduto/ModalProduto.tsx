"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { OpcaoCategoria } from "@/types/produto";
import CamposProduto from "./CamposProduto";
import ContadorEstoque from "./ContadorEstoque";
import FotosProduto from "./FotosProduto";
import { FORM_VAZIO, ProdutoForm, validarProduto } from "./produtoForm";

export interface ModalProdutoProps {
  aberto: boolean;
  categorias: OpcaoCategoria[];
  onFechar: () => void;
  // Se der erro, a promessa deve rejeitar com a mensagem; o modal mostra e continua aberto
  onSalvar: (produto: ProdutoForm) => Promise<void>;
  // Se vier um produto, o modal abre em modo edição e mostra o botão de deletar
  produtoInicial?: ProdutoForm | null;
  onDeletar?: () => Promise<void>;
}

// Quando fecha, o conteúdo é desmontado; ao abrir de novo, o formulário começa limpo
// (criação) ou com os dados do produto (edição).
export default function ModalProduto({ aberto, ...props }: ModalProdutoProps) {
  if (!aberto) return null;
  return <ConteudoModal {...props} />;
}

function ConteudoModal({
  categorias,
  onFechar,
  onSalvar,
  produtoInicial,
  onDeletar,
}: Omit<ModalProdutoProps, "aberto">) {
  const [form, setForm] = useState<ProdutoForm>(produtoInicial ?? FORM_VAZIO);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const editando = !!produtoInicial;

  // Fecha com Esc (menos enquanto está enviando)
  useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => e.key === "Escape" && !enviando && onFechar();
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [enviando, onFechar]);

  const atualizar = <K extends keyof ProdutoForm>(campo: K, valor: ProdutoForm[K]) =>
    setForm((f) => ({ ...f, [campo]: valor }));

  // Roda a ação no back-end; se der certo fecha, se der errado mostra a mensagem
  const executar = async (acao: () => Promise<void>) => {
    setEnviando(true);
    setErro("");
    try {
      await acao();
      onFechar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Algo deu errado. Tente de novo.");
    } finally {
      setEnviando(false);
    }
  };

  const salvar = () => {
    const problema = validarProduto(form);
    if (problema) return setErro(problema);
    executar(() => onSalvar(form));
  };

  const deletar = () => {
    if (!onDeletar || !confirm("Deletar este produto? Isso não pode ser desfeito.")) return;
    executar(onDeletar);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => !enviando && onFechar()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-modal-produto"
        className="relative max-h-[95vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-[#EDEDED] px-6 py-8 sm:px-12"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onFechar}
          disabled={enviando}
          aria-label="Fechar"
          className="absolute right-6 top-6 text-black hover:opacity-70 disabled:opacity-30"
        >
          <X size={28} />
        </button>

        <h2 id="titulo-modal-produto" className="mb-6 text-center text-3xl font-medium text-black">
          {editando ? "Editar Produto" : "Adicionar Produto"}
        </h2>

        <FotosProduto imagens={form.imagens} onMudar={(imagens) => atualizar("imagens", imagens)} />

        <div className="flex flex-col gap-3">
          <CamposProduto form={form} categorias={categorias} atualizar={atualizar} />

          {editando && onDeletar && (
            <button
              onClick={deletar}
              disabled={enviando}
              className="w-full rounded-full bg-[#FF0000] py-3 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              DELETAR
            </button>
          )}
        </div>

        <ContadorEstoque valor={form.estoque} onMudar={(estoque) => atualizar("estoque", estoque)} />

        {erro && <p className="mb-3 text-center text-sm text-red-600">{erro}</p>}

        <div className="flex justify-center">
          <button
            onClick={salvar}
            disabled={enviando}
            className="w-52 rounded-full bg-[#6A38F3] py-2 text-sm text-white shadow-md hover:bg-[#5a2de0] disabled:opacity-50"
          >
            {enviando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
