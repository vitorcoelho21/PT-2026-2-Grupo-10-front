"use client";

import { FormEvent, useState } from "react";
import Modal from "@/components/perfil/Modal";
import { extrairMensagemErro } from "@/utils/erros";

interface ModalEditarComentarioProps {
  comentario: { id: number; conteudo: string };
  onSalvar: (conteudo: string) => Promise<void>;
  onDeletar?: () => Promise<void>;
  onFechar: () => void;
}

export default function ModalEditarComentario({
  comentario,
  onSalvar,
  onDeletar,
  onFechar,
}: ModalEditarComentarioProps) {
  const [conteudo, setConteudo] = useState(comentario.conteudo);
  const [loading, setLoading] = useState(false);
  const [deletando, setDeletando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!conteudo.trim()) {
      setErro("O comentário não pode estar vazio.");
      return;
    }

    setLoading(true);
    setErro("");

    try {
      await onSalvar(conteudo.trim());
      onFechar();
    } catch (err) {
      setErro(extrairMensagemErro(err, "Não foi possível salvar o comentário."));
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletar() {
    if (!onDeletar) return;
    if (!confirm("Tem certeza de que deseja excluir este comentário?")) return;

    setDeletando(true);
    setErro("");

    try {
      await onDeletar();
      onFechar();
    } catch (err) {
      setErro(extrairMensagemErro(err, "Não foi possível excluir o comentário."));
    } finally {
      setDeletando(false);
    }
  }

  return (
    <Modal titulo="Editar comentário" onFechar={onFechar}>
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex w-full max-w-[536px] flex-col items-center px-4 md:px-0"
      >
        {/* Textarea para o comentário */}
        <textarea
          value={conteudo}
          onChange={(e) => {
            setConteudo(e.target.value);
            if (erro) setErro("");
          }}
          placeholder="Comentário"
          disabled={loading || deletando}
          rows={7}
          className="w-full resize-none rounded-[27px] bg-white p-5 text-base text-black shadow-sm outline-none placeholder:text-[#999797] focus:ring-2 focus:ring-[#6A38F3] sm:p-6"
        />

        {/* Exibição de erros */}
        {erro && (
          <p className="mt-3 w-full rounded-xl bg-red-500/10 px-4 py-2 text-center text-sm text-red-600" role="alert">
            {erro}
          </p>
        )}

        {/* Botão de ação correspondente ao SVG */}
        <div className="mx-auto mt-8 flex w-full max-w-[373px] flex-col gap-3">
          {onDeletar && (
            <button
              type="button"
              onClick={handleDeletar}
              disabled={loading || deletando}
              className="w-full rounded-full border border-[#AF052A] bg-transparent py-3 text-base font-semibold text-[#AF052A] shadow-sm transition hover:bg-[#AF052A]/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deletando ? "Deletando..." : "Deletar comentário"}
            </button>
          )}

          <button
            type="submit"
            disabled={loading || deletando || !conteudo.trim()}
            className="w-full rounded-full bg-[#6A38F3] py-3 text-base font-semibold text-white shadow-md transition hover:bg-[#7B4FF5] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Avaliar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
