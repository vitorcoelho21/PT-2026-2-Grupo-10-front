import Navbar from "@/components/Navbar";
import ConteudoCategoria from "@/components/feats-tela-de-categorias/ConteudoCategoria";

// Dicionário para mapear os textos de destaque de cada categoria
const titulosDestaque: Record<string, { linha1: string; linha2: string }> = {
  beleza: { linha1: "O universo da beleza", linha2: "em um só lugar" },
  mercado: { linha1: "Tudo para o seu dia a dia", linha2: "em um só lugar" },
  moda: { linha1: "O melhor da moda", linha2: "em um só lugar" },
  eletronicos: { linha1: "A melhor tecnologia", linha2: "em um só lugar" },
};

export default async function PaginaCategoriaTemplate({ params }: { params: Promise<{ categoria: string }> }) {
  

    const resolvedParams = await params;
  const categoriaSlug = resolvedParams.categoria;

  // Busca o texto customizado ou usa um texto padrão dinâmico
    const titulo = titulosDestaque[categoriaSlug] || { 
    linha1: `Os melhores produtos de ${categoriaSlug}`, 
    linha2: "em um só lugar" 
  };

  return (
    <div className="min-h-screen bg-[#FDF8EE] font-sans">
      {/* Topo Preto / Hero Section */}
      <div className="relative overflow-hidden rounded-b-[40px] bg-black pb-24">
        <Navbar />

        <div className="relative flex items-center px-8 pb-15 pt-6 text-white md:px-16">
          <div className="z-20 ml-60">
            <h1 className="text-4xl font-bold capitalize leading-tight md:text-5xl">
              {titulo.linha1}<br />{titulo.linha2}
            </h1>
          </div>

          <div className="pointer-events-none absolute bottom-0 right-50 translate-y-[65%]">
            <img 
              src="/images/Stockles.svg" 
              alt="Ilustração da personagem" 
              className="h-[600px] w-auto object-contain"
            />
          </div>
        </div>
      </div>

      {/* Busca, filtros e produtos */}
      <ConteudoCategoria categoria={categoriaSlug} />
    </div>
  );
}