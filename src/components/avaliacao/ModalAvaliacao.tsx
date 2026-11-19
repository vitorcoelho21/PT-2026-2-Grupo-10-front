"use client";

import { FormEvent, useState } from "react";
import Modal from "@/components/perfil/Modal";
import EstrelaAvaliacao from "./EstrelaAvaliacao";
import { extrairMensagemErro } from "@/utils/erros";

export interface DadosAvaliacaoForm {
  nota: number;
  comentario?: string;
}

export interface ModalAvaliacaoProps {
  tipo: "loja" | "produto";
  nomeAlvo: string;
  avaliacaoExistente?: {
    id: number;
    nota: number;
    comentario: string | null;
  } | null;
  onSalvar: (dados: DadosAvaliacaoForm) => Promise<void>;
  onDeletar?: () => Promise<void>;
  onFechar: () => void;
}

export default function ModalAvaliacao({
  tipo,
  nomeAlvo,
  avaliacaoExistente,
  onSalvar,
  onDeletar,
  onFechar,
}: ModalAvaliacaoProps) {
  const editando = Boolean(avaliacaoExistente);
  const [nota, setNota] = useState(avaliacaoExistente?.nota ?? 0);
  const [hoverNota, setHoverNota] = useState(0);
  const [comentario, setComentario] = useState(avaliacaoExistente?.comentario ?? "");
  const [loading, setLoading] = useState(false);
  const [deletando, setDeletando] = useState(false);
  const [erro, setErro] = useState("");

  const placeholder = tipo === "loja" ? "Avaliação da loja" : "Avaliação do produto";
  const tituloModal = editando ? `Editar avaliação de ${nomeAlvo}` : `Avaliar ${nomeAlvo}`;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (nota === 0) {
      setErro("Por favor, selecione uma nota de 1 a 5 estrelas.");
      return;
    }

    setLoading(true);
    setErro("");

    try {
      await onSalvar({
        nota,
        comentario: comentario.trim() || undefined,
      });
      onFechar();
    } catch (err) {
      setErro(extrairMensagemErro(err, "Não foi possível salvar a avaliação."));
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletar() {
    if (!onDeletar) return;
    if (!confirm("Tem certeza de que deseja deletar esta avaliação?")) return;

    setDeletando(true);
    setErro("");

    try {
      await onDeletar();
      onFechar();
    } catch (err) {
      setErro(extrairMensagemErro(err, "Não foi possível deletar a avaliação."));
    } finally {
      setDeletando(false);
    }
  }

  return (
    <Modal titulo={tituloModal} onFechar={onFechar}>
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex w-full max-w-[536px] flex-col items-center px-4 md:px-0"
      >
        {/* Título com destaque no nome da loja/produto */}
        <h2 className="text-center text-2xl font-light text-black sm:text-3xl">
          Você está avaliando <strong className="font-bold">{nomeAlvo}</strong>
        </h2>

        {/* 5 Estrelas interativas */}
        <div
          className="my-6 flex items-center justify-center gap-2 sm:gap-3"
          onMouseLeave={() => setHoverNota(0)}
          role="group"
          aria-label="Avaliação por estrelas"
        >
          {[1, 2, 3, 4, 5].map((i) => {
            const ativa = (hoverNota || nota) >= i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setNota(i)}
                onMouseEnter={() => setHoverNota(i)}
                aria-label={`Nota ${i} de 5`}
                className="cursor-pointer transition-transform hover:scale-110 focus:outline-none"
              >
                <EstrelaAvaliacao preenchida={ativa} />
              </button>
            );
          })}
        </div>

        {/* Textarea para comentário */}
        <textarea
          value={comentario}
          onChange={(e) => {
            setComentario(e.target.value);
            if (erro) setErro("");
          }}
          placeholder={placeholder}
          disabled={loading || deletando}
          rows={6}
          className="w-full resize-none rounded-[27px] bg-white p-5 text-base text-black shadow-sm outline-none placeholder:text-[#999797] focus:ring-2 focus:ring-[#6A38F3] sm:p-6"
        />

        {/* Exibição de erros */}
        {erro && (
          <p className="mt-3 w-full rounded-xl bg-red-500/10 px-4 py-2 text-center text-sm text-red-600" role="alert">
            {erro}
          </p>
        )}

        {/* Botões de ação */}
        <div className="mx-auto mt-8 flex w-full max-w-[373px] flex-col gap-3">
          {editando && (
            <button
              type="button"
              onClick={handleDeletar}
              disabled={loading || deletando}
              className="w-full rounded-full bg-[#FF0000] py-3 text-base font-semibold uppercase text-white shadow-md transition hover:bg-[#D90000] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deletando ? "Deletando..." : "DELETAR"}
            </button>
          )}

          <button
            type="submit"
            disabled={loading || deletando || nota === 0}
            className="w-full rounded-full bg-[#6A38F3] py-3 text-base font-semibold text-white shadow-md transition hover:bg-[#7B4FF5] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Enviando..." : editando ? "Salvar" : "Avaliar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
