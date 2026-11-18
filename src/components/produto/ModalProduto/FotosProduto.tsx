"use client";

import { useState } from "react";
import SlotImagem from "./SlotImagem";
import { ESTILO_CAMPO } from "./produtoForm";

interface FotosProdutoProps {
  imagens: string[]; // [principal, extra1, extra2, extra3]
  onMudar: (imagens: string[]) => void;
}

// Os 4 espaços de foto. Clicar num espaço abre o campo para colar o link daquela foto.
export default function FotosProduto({ imagens, onMudar }: FotosProdutoProps) {
  const [slotAtivo, setSlotAtivo] = useState<number | null>(null);

  const alternar = (i: number) => setSlotAtivo(slotAtivo === i ? null : i);

  const mudarImagem = (indice: number, url: string) => {
    const novas = [...imagens];
    novas[indice] = url;
    onMudar(novas);
  };

  return (
    <>
      {/* Imagem principal */}
      <SlotImagem
        url={imagens[0]}
        ativo={slotAtivo === 0}
        onClick={() => alternar(0)}
        className="mb-3 h-24 w-full"
        legenda="Anexe as fotos do seu produto"
      />

      {/* Imagens extras */}
      <div className="mb-3 grid grid-cols-3 gap-4 sm:gap-9">
        {[1, 2, 3].map((i) => (
          <SlotImagem
            key={i}
            url={imagens[i]}
            ativo={slotAtivo === i}
            onClick={() => alternar(i)}
            className="h-20"
          />
        ))}
      </div>

      {/* Link da foto escolhida */}
      {slotAtivo !== null && (
        <div className="mb-3 flex gap-2">
          <input
            autoFocus
            className={ESTILO_CAMPO}
            placeholder={`Link da foto ${slotAtivo === 0 ? "principal" : slotAtivo + 1} (https://...)`}
            value={imagens[slotAtivo]}
            onChange={(e) => mudarImagem(slotAtivo, e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setSlotAtivo(null)}
          />
          {imagens[slotAtivo] && (
            <button
              onClick={() => mudarImagem(slotAtivo, "")}
              className="shrink-0 rounded-full bg-white px-4 text-sm text-red-600 hover:bg-red-50"
            >
              Remover
            </button>
          )}
        </div>
      )}
    </>
  );
}
