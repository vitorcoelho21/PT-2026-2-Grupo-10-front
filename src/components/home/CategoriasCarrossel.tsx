import Link from "next/link";

export default function CategoriasCarrossel() {
  const categorias = [
    { nome: "Mercado", img: "/images/CarrosselCategorias/mercado.svg", rota: "/categoriasespecificas/mercado" },
    { nome: "Farmácia", img: "/images/CarrosselCategorias/remedio.svg", rota: "/categoriasespecificas/farmacia" },
    { nome: "Beleza", img: "/images/CarrosselCategorias/batom.svg", rota: "/categoriasespecificas/beleza" },
    { nome: "Moda", img: "/images/CarrosselCategorias/moda.svg", rota: "/categoriasespecificas/moda" },
    { nome: "Eletrônicos", img: "/images/CarrosselCategorias/laptop.svg", rota: "/categoriasespecificas/eletronicos" },
    { nome: "Jogos", img: "/images/CarrosselCategorias/videogame.svg", rota: "/categoriasespecificas/jogos" },
    { nome: "Brinquedos", img: "/images/CarrosselCategorias/BONECA.png", rota: "/categoriasespecificas/brinquedos" },
    { nome: "Casa", img: "/images/CarrosselCategorias/CASA.png", rota: "/categoriasespecificas/casa" },
  ];

  return (
    <section className="mb-12">
      <h2 className="mb-6 text-2xl font-bold text-black">Categoria</h2>
      <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-4">
        {categorias.map((cat, i) => (
          <Link 
            key={i} 
            href={cat.rota} 
            className="flex h-[100px] min-w-[100px] flex-col items-center justify-center gap-2 rounded-3xl bg-white shadow-sm transition hover:shadow-md"
          >
            {}
            <div className="w-8 h-8 flex items-center justify-center">
              <img 
                src={cat.img} 
                alt={cat.nome} 
                className="max-h-full max-w-full object-contain" 
              />
            </div>
            <span className="text-xs font-medium text-gray-800">{cat.nome}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}