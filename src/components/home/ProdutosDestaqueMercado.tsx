export default function ProdutosDestaque() {
  return (
    <section>
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="text-2xl font-bold text-black">
          Produtos <span className="text-sm font-normal text-[#7B3CF6]">em Mercado</span>
        </h2>
        <button className="text-sm font-semibold text-[#7B3CF6] hover:underline">
          ver mais
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="relative flex aspect-square flex-col items-center justify-center rounded-3xl bg-white p-4 shadow-sm"
          >
            <span className="text-sm text-gray-400">[Imagem Produto]</span>
          </div>
        ))}
      </div>
    </section>
  );
}