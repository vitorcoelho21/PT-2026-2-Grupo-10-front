"use client";

import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";

import Modal from "@/components/perfil/Modal";
import { deleteLoja, Loja } from "@/services/lojaService";
import { extrairMensagemErro } from "@/utils/erros";

type Props = {
  loja: Loja;
  onSucesso: () => void;
  onFechar: () => void;
};

export default function ModalExcluirLoja({ loja, onSucesso, onFechar }: Props) {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function handleConfirmar() {
    setLoading(true);
    setErro("");
    try {
      await deleteLoja(loja.id);
      onSucesso();
    } catch (err) {
      setErro(extrairMensagemErro(err, "Não foi possível excluir a loja."));
      setLoading(false);
    }
  }

  return (
    <Modal titulo={`Excluir loja ${loja.nome}`} onFechar={onFechar}>
      <div className="mx-auto flex w-full max-w-[460px] flex-col items-center px-4 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
          <Trash2 className="h-8 w-8" />
        </div>

        <h2 className="mb-2 text-2xl font-bold text-black">Excluir Loja</h2>

        <p className="mb-2 text-base text-gray-700">
          Tem certeza de que deseja excluir a loja{" "}
          <strong className="text-black">&quot;{loja.nome}&quot;</strong>?
        </p>

        <p className="mb-6 text-sm text-gray-500">
          Esta ação é irreversível. Todos os produtos e avaliações vinculados a esta loja serão removidos permanentemente.
        </p>

        {erro && (
          <div className="mb-6 flex w-full items-center gap-2 rounded-xl bg-red-50 p-3 text-left text-sm text-red-700">
            <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />
            <span>{erro}</span>
          </div>
        )}

        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onFechar}
            disabled={loading}
            className="w-full rounded-full border border-gray-300 bg-white py-3 text-base font-medium text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleConfirmar}
            disabled={loading}
            className="w-full rounded-full bg-[#FF0000] py-3 text-base font-medium text-white shadow-md transition hover:bg-[#D90000] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Excluindo..." : "Confirmar exclusão"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
