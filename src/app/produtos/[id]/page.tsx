import { notFound } from "next/navigation";

import Navbar from "@/components/Navbar";
import DetalheProduto from "@/components/produto/DetalheProduto";

export default async function PaginaProduto({ params }: PageProps<"/produtos/[id]">) {
  const { id } = await params;
  const produtoId = Number(id);

  // /produtos/abc ou /produtos/-1 -> página 404
  if (!Number.isInteger(produtoId) || produtoId <= 0) notFound();

  return (
    <div className="min-h-screen bg-[#FDF8EE] font-sans">
      <div className="bg-black">
        <Navbar />
      </div>

      <main className="mx-auto w-full max-w-6xl px-4 py-10 md:px-8">
        <DetalheProduto id={produtoId} />
      </main>
    </div>
  );
}
