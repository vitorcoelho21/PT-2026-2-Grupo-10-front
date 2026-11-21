import { ReactNode } from "react";
import Link from "next/link";
import { Pencil, Star } from "lucide-react";

interface CardAvaliacaoProps {
  href: string; // página do produto ou da loja avaliada
  imagem: ReactNode; // foto do produto ou logo da loja
  titulo: string;
  subtitulo?: string;
  nota: number;
  comentario: string | null;
  data?: string;
  onEditar?: () => void;
  linkVerMais?: string;
  arredondamentoImagem?: string;
  className?: string;
}

function formatarData(data: string) {
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Uma avaliação feita pelo usuário (de produto ou de loja): autor/item, estrelas, comentário e ação ver mais
export default function CardAvaliacao({
  href,
  imagem,
  titulo,
  subtitulo,
  nota,
  comentario,
  data,
  onEditar,
  linkVerMais,
  arredondamentoImagem = "rounded-full",
  className = "",
}: CardAvaliacaoProps) {
  return (
    <article
      className={`flex gap-4 rounded-3xl bg-white p-4 md:p-5 shadow-sm ${className}`}
    >
      <Link
        href={href}
        className={`flex h-16 w-16 md:h-20 md:w-20 shrink-0 items-center justify-center overflow-hidden ${arredondamentoImagem}`}
      >
        {imagem}
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <div className="min-w-0">
            <Link
              href={href}
              className="truncate text-base font-semibold text-black transition hover:text-[#6A38F3] md:text-lg"
            >
              {titulo}
            </Link>
            {subtitulo && (
              <p className="truncate text-xs text-gray-500">{subtitulo}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex gap-0.5" aria-label={`Nota ${nota} de 5`}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 md:h-5 md:w-5 ${
                    i <= Math.round(nota)
                      ? "fill-[#FFEB3A] text-[#FFEB3A]"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            {data && (
              <time
                className="hidden text-xs text-gray-400 sm:inline"
                dateTime={data}
              >
                {formatarData(data)}
              </time>
            )}

            {onEditar && (
              <button
                type="button"
                onClick={onEditar}
                title="Editar avaliação"
                aria-label="Editar avaliação"
                className="p-0.5 text-gray-400 transition hover:text-[#6A38F3]"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {comentario && (
          <p className="mt-2 text-sm leading-relaxed text-gray-700 md:text-base">
            {comentario}
          </p>
        )}

        {linkVerMais && (
          <div className="mt-3 flex justify-end">
            <Link
              href={linkVerMais}
              className="text-sm font-normal text-[#8A38F5] transition hover:text-[#6A38F3] hover:underline"
            >
              ver mais
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
