import Link from "next/link";

interface BadgeLojaProps {
  loja: { id: number; nome: string; logoUrl?: string | null };
  tamanho?: "md" | "lg";
  comLink?: boolean;
}

// Círculo com o logo da loja no canto das imagens de produto.
// Sem logo cadastrado, mostra a inicial do nome da loja.
export default function BadgeLoja({ loja, tamanho = "md", comLink = false }: BadgeLojaProps) {
  const dimensao = tamanho === "lg" ? "h-20 w-20 text-2xl" : "h-14 w-14 text-lg";

  const conteudo = loja.logoUrl ? (
    <img src={loja.logoUrl} alt={`Logo da ${loja.nome}`} className="h-full w-full object-cover" />
  ) : (
    <span className="font-bold uppercase text-white">{loja.nome.charAt(0)}</span>
  );

  const classes = `flex ${dimensao} items-center justify-center overflow-hidden rounded-full bg-[#6A38F3] shadow-md`;

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
