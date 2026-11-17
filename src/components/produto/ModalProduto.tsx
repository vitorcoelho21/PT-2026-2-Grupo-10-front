"use client";

import { useEffect, useState } from "react";
import { Camera, ChevronDown, Minus, Plus, X } from "lucide-react";
import { OpcaoCategoria } from "@/types/produto";

// Dados do formulário. O back-end só guarda a URL das imagens (não recebe arquivo),
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

interface ModalProdutoProps {
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
  const [slotAtivo, setSlotAtivo] = useState<number | null>(null);
  const editando = !!produtoInicial;

  // Fecha com Esc (menos enquanto está enviando)
  useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => e.key === "Escape" && !enviando && onFechar();
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [enviando, onFechar]);

  const atualizar = <K extends keyof ProdutoForm>(campo: K, valor: ProdutoForm[K]) =>
    setForm((f) => ({ ...f, [campo]: valor }));

  const mudarImagem = (indice: number, url: string) => {
    const imagens = [...form.imagens];
    imagens[indice] = url;
    atualizar("imagens", imagens);
  };

  // Mantém só dígitos e mostra como R$ 0,00
  const mudarPreco = (texto: string) => {
    const digitos = texto.replace(/\D/g, "");
    atualizar("preco", digitos ? formatarPreco(Number(digitos) / 100) : "");
  };

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
    if (!form.nome.trim() || form.categoriaId === "" || !form.preco) {
      setErro("Preencha nome, categoria e preço.");
      return;
    }
    const urlInvalida = form.imagens.find((u) => u && !/^https?:\/\/\S+$/.test(u.trim()));
    if (urlInvalida) {
      setErro("As fotos precisam ser links começando com http:// ou https://");
      return;
    }
    executar(() => onSalvar(form));
  };

  const deletar = () => {
    if (!onDeletar || !confirm("Deletar este produto? Isso não pode ser desfeito.")) return;
    executar(onDeletar);
  };

  const campo =
    "w-full rounded-full bg-white px-5 py-3 text-sm text-black outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#6A38F3]";

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

        {/* Imagem principal */}
        <SlotImagem
          url={form.imagens[0]}
          ativo={slotAtivo === 0}
          onClick={() => setSlotAtivo(slotAtivo === 0 ? null : 0)}
          className="mb-3 h-24 w-full"
          legenda="Anexe as fotos do seu produto"
        />

        {/* Imagens extras */}
        <div className="mb-3 grid grid-cols-3 gap-4 sm:gap-9">
          {[1, 2, 3].map((i) => (
            <SlotImagem
              key={i}
              url={form.imagens[i]}
              ativo={slotAtivo === i}
              onClick={() => setSlotAtivo(slotAtivo === i ? null : i)}
              className="h-20"
            />
          ))}
        </div>

        {/* Link da foto escolhida */}
        {slotAtivo !== null && (
          <div className="mb-3 flex gap-2">
            <input
              autoFocus
              className={campo}
              placeholder={`Link da foto ${slotAtivo === 0 ? "principal" : slotAtivo + 1} (https://...)`}
              value={form.imagens[slotAtivo]}
              onChange={(e) => mudarImagem(slotAtivo, e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setSlotAtivo(null)}
            />
            {form.imagens[slotAtivo] && (
              <button
                onClick={() => mudarImagem(slotAtivo, "")}
                className="shrink-0 rounded-full bg-white px-4 text-sm text-red-600 hover:bg-red-50"
              >
                Remover
              </button>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <input
            className={campo}
            placeholder="Nome do produto"
            maxLength={255}
            value={form.nome}
            onChange={(e) => atualizar("nome", e.target.value)}
          />

          <div className="relative">
            <select
              className={`${campo} appearance-none pr-12 ${form.categoriaId === "" ? "text-gray-400" : ""}`}
              value={form.categoriaId}
              onChange={(e) => atualizar("categoriaId", Number(e.target.value))}
            >
              <option value="" disabled>
                Categoria
              </option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id} className="text-black">
                  {c.caminho}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-black"
              size={22}
            />
          </div>

          <textarea
            className={`${campo} h-20 resize-none rounded-2xl`}
            placeholder="Descrição"
            value={form.descricao}
            onChange={(e) => atualizar("descricao", e.target.value)}
          />

          <input
            className={campo}
            placeholder="R$ 0,00"
            inputMode="numeric"
            value={form.preco}
            onChange={(e) => mudarPreco(e.target.value)}
          />

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

        {/* Estoque */}
        <div className="my-6 flex items-center justify-center gap-14">
          <BotaoContador
            onClick={() => atualizar("estoque", Math.max(0, form.estoque - 1))}
            label="Diminuir estoque"
          >
            <Minus size={28} />
          </BotaoContador>
          <span className="w-10 text-center text-4xl text-[#6A38F3]">{form.estoque}</span>
          <BotaoContador onClick={() => atualizar("estoque", form.estoque + 1)} label="Aumentar estoque">
            <Plus size={28} />
          </BotaoContador>
        </div>

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

function SlotImagem({
  url,
  ativo,
  onClick,
  className = "",
  legenda,
}: {
  url: string;
  ativo: boolean;
  onClick: () => void;
  className?: string;
  legenda?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed border-[#6A38F3] hover:bg-white/50 ${ativo ? "bg-white/60" : ""} ${className}`}
    >
      {url ? (
        <img src={url} alt="Foto do produto" className="h-full w-full object-cover" />
      ) : (
        <>
          <span className="relative text-[#6A38F3]">
            <Camera size={34} fill="currentColor" stroke="#EDEDED" />
            <span className="absolute -bottom-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-white">
              <Plus size={12} />
            </span>
          </span>
          {legenda && <span className="text-xs text-black">{legenda}</span>}
        </>
      )}
    </button>
  );
}

function BotaoContador({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#6A38F3] text-[#6A38F3] hover:bg-[#6A38F3]/10"
    >
      {children}
    </button>
  );
}
