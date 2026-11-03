
export default function CategoriasCarrossel() {
  const categorias = [
    { nome: "Mercado", icon: "🛒" },
    { nome: "Farmácia", icon: "💊" },
    { nome: "Beleza", icon: "💄" },
    { nome: "Moda", icon: "👗" },
    { nome: "Eletrônicos", icon: "💻" },
    { nome: "Jogos", icon: "🎮" },
    { nome: "Brinquedos", icon: "🧸" },
    { nome: "Casa", icon: "🏠" },
  ];

  return (
    <section className="mb-12">
      <h2 className="mb-6 text-2xl font-bold text-black">Categoria</h2>
      <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-4">
        {categorias.map((cat, i) => (
          <button
            key={i}
            className="flex h-[100px] min-w-[100px] flex-col items-center justify-center gap-2 rounded-3xl bg-white shadow-sm transition hover:shadow-md"
          >
            <span className="text-2xl">{cat.icon}</span>
            <span className="text-xs font-medium text-gray-800">{cat.nome}</span>
          </button>
        ))}
      </div>
    </section>
  );
}