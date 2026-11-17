import { categorias } from "@/components/home/CategoriasCarrossel";

interface CategoriasFiltroProps {
  selecionada: string | null;
  onSelecionar: (categoria: string | null) => void;
}

// Carrossel de categorias das telas de lojas e de produtos (fundo preto).
// Em vez de navegar, clicar numa categoria filtra a lista; clicar de novo limpa o filtro.
export default function CategoriasFiltro({ selecionada, onSelecionar }: CategoriasFiltroProps) {
  return (
    <section className="px-4 pt-10 md:px-24">
      <h2 className="mb-6 text-2xl font-bold text-[#FDF8EE]">Categoria</h2>

      <div className="scrollbar-hide flex gap-6 overflow-x-auto pb-4 md:gap-12">
        {categorias.map((cat) => {
          const ativa = selecionada === cat.nome;
          return (
            <button
              key={cat.nome}
              type="button"
              onClick={() => onSelecionar(ativa ? null : cat.nome)}
              aria-pressed={ativa}
              className={`flex h-24 w-24 shrink-0 flex-col items-center justify-center gap-2 rounded-[28px] transition md:h-28 md:w-28 md:rounded-[32px] ${
                ativa ? "bg-[#C6E700]" : "bg-white hover:bg-[#EDE6FF]"
              }`}
            >
              <div className="flex h-8 w-8 items-center justify-center md:h-10 md:w-10">
                <img src={cat.img} alt="" className="max-h-full max-w-full object-contain" />
              </div>
              <span className="text-xs font-medium text-black md:text-sm">{cat.nome}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
