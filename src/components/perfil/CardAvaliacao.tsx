import { ReactNode } from "react";
import Link from "next/link";
import { Star } from "lucide-react";

interface CardAvaliacaoProps {
  href: string; // página do produto ou da loja avaliada
  imagem: ReactNode; // foto do produto ou logo da loja
  titulo: string;
  subtitulo?: string;
  nota: number;
  comentario: string | null;
  data: string;
}

function formatarData(data: string) {
  return new Date(data).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

// Uma avaliação feita pelo usuário (de produto ou de loja): o que foi avaliado, estrelas, comentário e data
export default function CardAvaliacao({ href, imagem, titulo, subtitulo, nota, comentario, data }: CardAvaliacaoProps) {
  return (
    <article className="flex gap-4 rounded-3xl bg-white p-4 md:p-5">
      <Link href={href} className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl">
        {imagem}
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4">
          <Link href={href} className="truncate font-bold text-black hover:text-[#6A38F3]">
            {titulo}
          </Link>
          <time className="text-xs text-gray-500" dateTime={data}>
            {formatarData(data)}
          </time>
        </div>

        {subtitulo && <p className="truncate text-xs text-gray-500">{subtitulo}</p>}

        <div className="mt-1 flex gap-0.5" aria-label={`Nota ${nota} de 5`}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className={`h-4 w-4 ${i <= nota ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
          ))}
        </div>

        {comentario && <p className="mt-2 text-sm text-gray-700">{comentario}</p>}
      </div>
    </article>
  );
}
