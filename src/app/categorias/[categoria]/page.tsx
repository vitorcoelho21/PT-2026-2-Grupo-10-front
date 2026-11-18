import Navbar from "@/components/Navbar";
import ConteudoCategoria from "@/components/feats-tela-de-categorias/ConteudoCategoria";

// Dicionário para mapear os textos de destaque de cada categoria
const titulosDestaque: Record<string, { linha1: string; linha2: string }> = {
  beleza: { linha1: "O universo da beleza", linha2: "em um só lugar" },
  mercado: { linha1: "Tudo para o seu dia a dia", linha2: "em um só lugar" },
  moda: { linha1: "O melhor da moda", linha2: "em um só lugar" },
  eletronicos: { linha1: "O universo da tecnologia", linha2: "em um só lugar" },
  jogos: { linha1: "O melhor dos games", linha2: "em um só lugar" },
  farmacia: { linha1: "Sua saúde e cuidado", linha2: "em um só lugar" },
  brinquedos: { linha1: "A magia da infância", linha2: "em um só lugar" },
  casa: { linha1: "Tudo para o seu lar", linha2: "em um só lugar" },
};

export default async function PaginaCategoriaTemplate({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const resolvedParams = await params;
  const categoriaSlug = resolvedParams.categoria;

  // Busca o texto customizado ou usa um texto padrão dinâmico
  const titulo = titulosDestaque[categoriaSlug.toLowerCase()] || {
    linha1: `Os melhores produtos de ${categoriaSlug}`,
    linha2: "em um só lugar",
  };

  return (
    <div className="min-h-screen bg-[#FDF8EE] font-sans">
      {/* Topo Preto / Hero Section */}
      <div className="relative overflow-hidden rounded-b-[40px] bg-black">
        <Navbar />

        <div className="relative mx-auto flex min-h-[200px] max-w-7xl items-center justify-between px-8 pb-8 pt-4 text-white md:px-16">
          <div className="z-20 max-w-xl">
            <h1 className="text-3xl font-bold leading-tight md:text-5xl">
              {titulo.linha1}
              <br />
              {titulo.linha2}
            </h1>
          </div>

          <div className="pointer-events-none absolute bottom-0 right-6 h-52 w-auto md:right-16 md:h-72">
            <img
              src="/images/Stockles.svg"
              alt="Ilustração da personagem"
              className="h-full w-auto object-contain object-bottom"
            />
          </div>
        </div>
      </div>

      {/* Busca, filtros e produtos */}
      <ConteudoCategoria categoria={categoriaSlug} />
    </div>
  );
}
