import Link from "next/link";

interface BadgeLojaProps {
  loja: { id: number; nome: string; logoUrl?: string | null; stickerUrl?: string | null };
  tamanho?: "sm" | "md" | "lg";
  comLink?: boolean;
}

// Círculo com o logo/sticker da loja no canto superior das imagens de produto.
// Fundo branco circular com sombra leve, conforme o design de Categoria Específica.
export default function BadgeLoja({ loja, tamanho = "md", comLink = false }: BadgeLojaProps) {
  const dimensao =
    tamanho === "lg" ? "h-20 w-20 text-2xl" : tamanho === "sm" ? "h-8 w-8 text-xs" : "h-11 w-11 text-sm";

  const imagemSrc = loja.stickerUrl || loja.logoUrl;

  const conteudo = imagemSrc ? (
    <img src={imagemSrc} alt={`Logo da ${loja.nome}`} className="h-full w-full object-contain p-1" />
  ) : (
    <span className="font-bold uppercase text-[#6A38F3]">{loja.nome.charAt(0)}</span>
  );

  const classes = `flex ${dimensao} items-center justify-center overflow-hidden rounded-full bg-white shadow-sm border border-gray-100`;

  if (comLink) {
    return (
      <Link href={`/lojas/${loja.id}`} title={`Ver loja ${loja.nome}`} className={`${classes} transition hover:scale-105`}>
        {conteudo}
      </Link>
    );
  }

  return (
    <span title={loja.nome} className={classes}>
      {conteudo}
    </span>
  );
}
