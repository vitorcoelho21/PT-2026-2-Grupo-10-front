"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { BotaoAvaliacao, ModalAvaliacao } from "@/components/avaliacao";

function TesteModalConteudo() {
  const searchParams = useSearchParams();
  const modalQuery = searchParams.get("modal");

  const [modalFazerLojaAberto, setModalFazerLojaAberto] = useState(modalQuery === "fazer");
  const [modalEditarLojaAberto, setModalEditarLojaAberto] = useState(modalQuery === "editar");
  const [modalFazerProdutoAberto, setModalFazerProdutoAberto] = useState(modalQuery === "produto_fazer");
  const [modalEditarProdutoAberto, setModalEditarProdutoAberto] = useState(modalQuery === "produto_editar");

  const [avaliacoesMock, setAvaliacoesMock] = useState<{
    loja: { id: number; nota: number; comentario: string | null };
    produto: { id: number; nota: number; comentario: string | null };
  }>({
    loja: {
      id: 1,
      nota: 4,
      comentario: "Excelente loja, produtos de alta qualidade e entrega rápida!",
    },
    produto: {
      id: 2,
      nota: 5,
      comentario: "Produto maravilhoso, superou todas as expectativas!",
    },
  });

  return (
    <div className="min-h-screen bg-[#F6F3E4] p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <h1 className="text-3xl font-bold text-black">Página de Teste de Avaliações</h1>

        {/* Demonstração do botão da Página de Loja / Produto */}
        <div className="rounded-3xl bg-black p-8 text-center text-white">
          <h2 className="text-2xl font-medium">Reviews e Comentários</h2>
          <p className="mt-2 text-4xl font-medium">4.75</p>
          <div className="mt-2 flex justify-center gap-1 text-yellow-400">
            {"★★★★★"}
          </div>

          <BotaoAvaliacao
            onClick={() => setModalFazerLojaAberto(true)}
            jaAvaliou={false}
            className="mt-6"
          />

          <BotaoAvaliacao
            onClick={() => setModalEditarLojaAberto(true)}
            jaAvaliou={true}
            className="mt-4"
          />
        </div>

        {/* Gatilhos de teste */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setModalFazerLojaAberto(true)}
            className="rounded-xl bg-[#6A38F3] py-3 font-semibold text-white shadow"
          >
            Abrir Modal Fazer Avaliação (Loja)
          </button>

          <button
            onClick={() => setModalEditarLojaAberto(true)}
            className="rounded-xl bg-[#6A38F3] py-3 font-semibold text-white shadow"
          >
            Abrir Modal Editar Avaliação (Loja)
          </button>

          <button
            onClick={() => setModalFazerProdutoAberto(true)}
            className="rounded-xl bg-[#6A38F3] py-3 font-semibold text-white shadow"
          >
            Abrir Modal Fazer Avaliação (Produto)
          </button>

          <button
            onClick={() => setModalEditarProdutoAberto(true)}
            className="rounded-xl bg-[#6A38F3] py-3 font-semibold text-white shadow"
          >
            Abrir Modal Editar Avaliação (Produto)
          </button>
        </div>
      </div>

      {/* Modal Fazer Avaliação Loja */}
      {modalFazerLojaAberto && (
        <ModalAvaliacao
          tipo="loja"
          nomeAlvo="Rare Beauty"
          onSalvar={async (dados) => {
            alert(`Salvo para loja: Nota ${dados.nota}, Comentário: "${dados.comentario}"`);
          }}
          onFechar={() => setModalFazerLojaAberto(false)}
        />
      )}

      {/* Modal Editar Avaliação Loja */}
      {modalEditarLojaAberto && (
        <ModalAvaliacao
          tipo="loja"
          nomeAlvo="Rare Beauty"
          avaliacaoExistente={avaliacoesMock.loja}
          onSalvar={async (dados) => {
            setAvaliacoesMock((prev) => ({
              ...prev,
              loja: { ...prev.loja, nota: dados.nota, comentario: dados.comentario ?? null },
            }));
            alert(`Atualizado: Nota ${dados.nota}, Comentário: "${dados.comentario}"`);
          }}
          onDeletar={async () => {
            alert("Avaliação de loja deletada!");
          }}
          onFechar={() => setModalEditarLojaAberto(false)}
        />
      )}

      {/* Modal Fazer Avaliação Produto */}
      {modalFazerProdutoAberto && (
        <ModalAvaliacao
          tipo="produto"
          nomeAlvo="Soft Pinch Liquid Blush"
          onSalvar={async (dados) => {
            alert(`Salvo para produto: Nota ${dados.nota}, Comentário: "${dados.comentario}"`);
          }}
          onFechar={() => setModalFazerProdutoAberto(false)}
        />
      )}

      {/* Modal Editar Avaliação Produto */}
      {modalEditarProdutoAberto && (
        <ModalAvaliacao
          tipo="produto"
          nomeAlvo="Soft Pinch Liquid Blush"
          avaliacaoExistente={avaliacoesMock.produto}
          onSalvar={async (dados) => {
            setAvaliacoesMock((prev) => ({
              ...prev,
              produto: { ...prev.produto, nota: dados.nota, comentario: dados.comentario ?? null },
            }));
            alert(`Atualizado: Nota ${dados.nota}, Comentário: "${dados.comentario}"`);
          }}
          onDeletar={async () => {
            alert("Avaliação de produto deletada!");
          }}
          onFechar={() => setModalEditarProdutoAberto(false)}
        />
      )}
    </div>
  );
}

export default function TesteModalAvaliacoesPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <TesteModalConteudo />
    </Suspense>
  );
}
