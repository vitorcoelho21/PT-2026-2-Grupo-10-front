"use client";

import { ReactNode, useEffect, useRef } from "react";
import { ChevronLeft, X } from "lucide-react";

type Props = {
  titulo: string; // lido por leitores de tela (não aparece visualmente, como no design)
  onFechar: () => void;
  onVoltar?: () => void; // se vier, mostra a seta "<" no canto superior esquerdo
  children: ReactNode;
};

// Casca visual compartilhada pelos modais: fundo escurecido, cartão cinza com
// cantos arredondados, botão X (e opcionalmente a seta de voltar).
export default function Modal({ titulo, onFechar, onVoltar, children }: Props) {
  const cartaoRef = useRef<HTMLDivElement>(null);

  // Guardamos o onFechar mais recente numa ref para o efeito abaixo rodar só uma vez.
  // Se ele dependesse de onFechar, o foco voltaria para o cartão a cada re-render
  // do pai (tirando o cursor do campo em que a pessoa está digitando).
  const onFecharRef = useRef(onFechar);
  useEffect(() => {
    onFecharRef.current = onFechar;
  });

  useEffect(() => {
    function aoPressionarTecla(e: KeyboardEvent) {
      if (e.key === "Escape") onFecharRef.current();
    }

    // Impede a página de trás de rolar enquanto o modal está aberto.
    const overflowOriginal = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", aoPressionarTecla);
    cartaoRef.current?.focus();

    return () => {
      document.body.style.overflow = overflowOriginal;
      document.removeEventListener("keydown", aoPressionarTecla);
    };
  }, []);

  return (
    <div
      // Clicar no fundo escuro fecha. Usamos onMouseDown + target === currentTarget
      // para não fechar quando a pessoa seleciona texto e solta o mouse fora do cartão.
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onFechar();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4"
    >
      <div
        ref={cartaoRef}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        tabIndex={-1}
        className="relative my-auto w-full max-w-[654px] rounded-[29px] bg-[#EDEDED] px-6 pb-12 pt-16 outline-none md:px-0 md:pt-14"
      >
        {onVoltar && (
          <button
            type="button"
            onClick={onVoltar}
            title="Voltar"
            aria-label="Voltar"
            className="absolute left-6 top-6 text-black transition hover:text-[#6A38F3] md:left-16 md:top-12"
          >
            <ChevronLeft className="h-8 w-8" strokeWidth={1.25} />
          </button>
        )}

        <button
          type="button"
          onClick={onFechar}
          title="Fechar"
          aria-label="Fechar"
          className="absolute right-6 top-6 text-black transition hover:text-[#6A38F3] md:right-8 md:top-10"
        >
          <X className="h-8 w-8" strokeWidth={1.25} />
        </button>

        {children}
      </div>
    </div>
  );
}
