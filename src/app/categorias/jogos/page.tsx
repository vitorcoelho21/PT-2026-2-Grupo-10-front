import Navbar from "@/components/Navbar";
import SearchBar from "@/components/home/SearchBar";
import FiltrosJogos from "@/components/feats-tela-de-categorias/FiltrosJogos";
import ListaProdutos from "@/components/feats-tela-de-categorias/ListaProdutos";

export default function PaginaEletronicos() {
  return (
    <div className="min-h-screen bg-[#FDF8EE] font-sans">
      {/* Topo Preto / Hero Section */}
      <div className="relative rounded-b-[40px] bg-black pb-24 overflow-hidden">
        <Navbar />

        <div className="relative flex items-center px-8 pb-15 pt-6 text-white md:px-16">
          <div className="ml-60 z-20">
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              O universo dos jogos<br />em um só lugar
            </h1>
          </div>

          <div className="absolute right-50 bottom-0 translate-y-[65%] pointer-events-none">
            <img 
              src="/images/Stockles.svg" 
              alt="Ilustração da personagem" 
              className="h-[600px] w-auto object-contain"
            />
          </div>
        </div>
      </div>

      

      {/* Barra de Pesquisa */}
      <div className="px-8 mt-12 ml-150 md:px-16 max-w-4xl mx-auto z-30 relative">
        <SearchBar />
      </div>

      {/* Filtros e Ordenação */}
      <div className="-mt-11">
        <FiltrosJogos />
      </div>

      {/* Grelha de Produtos vindos do Banco de Dados */}
      <div className="px-8 pb-16 md:px-16">

        <ListaProdutos categoria = "jogos" />

      </div>
    </div>
  );
}