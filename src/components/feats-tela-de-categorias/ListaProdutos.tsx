"use client";

import { useEffect, useState } from "react";
import CardProduto from "@/components/produtos/CardProduto";
import { getProdutos } from "@/services/produtoService";
import { Produto } from "@/types/produto";
import { extrairMensagemErro } from "@/utils/erros";

interface ListaProdutosProps {
  categoria?: string;
  subcategoria?: string | null;
  busca?: string;
  ordenarPor?: string;
  ordem?: string;
}

// Remove acentos e padroniza para comparar nomes ("Bebé" == "Bebê" == "bebe")
const normalizar = (texto: string) =>
  texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

// Rótulo do filtro no front -> nomes aceitos da subcategoria no banco
const SINONIMOS_SUBCATEGORIA: Record<string, string[]> = {
  celulares: ["celulares", "celular", "smartphones", "smartphone"],
  notebooks: ["notebooks", "notebook", "computadores", "computador"],
  tvs: ["tvs", "tv", "televisores", "televisao"],
  maquilhagem: ["maquilhagem", "maquiagem"],
  calcado: ["calcado", "calcados"],
};

const nomesDaSubcategoria = (sub: string) => {
  const chave = normalizar(sub);
  return SINONIMOS_SUBCATEGORIA[chave] ?? [chave];
};

export default function ListaProdutos({
  categoria,
  subcategoria,
  busca = "",
  ordenarPor,
  ordem,
}: ListaProdutosProps) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let cancelado = false;

    async function carregarProdutos() {
      setLoading(true);
      setErro("");

      try {
        const params: Record<string, string | number | undefined> = {};

        if (busca.trim()) params.busca = busca.trim();
        if (ordenarPor) params.ordenarPor = ordenarPor;
        if (ordem) params.ordem = ordem;
        // Sempre busca pela categoria principal (o backend já inclui as subcategorias dela).
        // A subcategoria é filtrada aqui: pelo nome ela não é única (ex.: "Acessórios" existe
        // em Moda e em Eletrônicos) e pode nem existir no banco, o que daria 404.
        if (categoria) params.categoria = categoria;

        const dados = await getProdutos(params);

        if (!cancelado) {
          let lista = Array.isArray(dados) ? dados : [];

          // "Outros" mostra todos os produtos da categoria (sem filtrar subcategoria)
          if (subcategoria && normalizar(subcategoria) !== "outros") {
            const aceitos = new Set(nomesDaSubcategoria(subcategoria));
            lista = lista.filter(
              (p) =>
                p.categoria?.categoriaPaiId != null &&
                aceitos.has(normalizar(p.categoria.nome)),
            );
          }

          setProdutos(lista);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelado) {
          setErro(extrairMensagemErro(err, "Não foi possível carregar os produtos."));
          setLoading(false);
        }
      }
    }

    carregarProdutos();

    return () => {
      cancelado = true;
    };
  }, [categoria, subcategoria, busca, ordenarPor, ordem]);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <p className="text-base text-gray-500">Carregando produtos...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="py-12 text-center">
        <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">{erro}</p>
      </div>
    );
  }

  if (produtos.length === 0) {
    return (
      <div className="rounded-3xl bg-white px-6 py-16 text-center text-gray-500 shadow-sm">
        <p className="text-base font-medium">
          {busca.trim()
            ? `Nenhum produto encontrado para "${busca.trim()}".`
            : subcategoria
            ? `Nenhum produto encontrado no filtro "${subcategoria}".`
            : "Nenhum produto encontrado nesta categoria."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {produtos.map((produto) => (
        <CardProduto key={produto.id} produto={produto} />
      ))}
    </div>
  );
}
