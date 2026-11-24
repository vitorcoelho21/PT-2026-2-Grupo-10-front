"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Pencil, Plus } from "lucide-react";

import Navbar from "@/components/Navbar";
import CardProduto from "@/components/produtos/CardProduto";
import ModalProduto, {
  formatarPreco,
  precoParaNumero,
  ProdutoForm,
} from "@/components/produto/ModalProduto";
import { getMe } from "@/services/authService";
import { getLojas, Loja } from "@/services/lojaService";
import {
  adicionarImagemProduto,
  atualizarImagemProduto,
  atualizarProduto,
  criarProduto,
  deletarImagemProduto,
  deletarProduto,
  getOpcoesCategorias,
  getProduto,
  getProdutos,
} from "@/services/produtoService";
import { ImagemProduto, OpcaoCategoria, Produto } from "@/types/produto";
import { extrairMensagemErro } from "@/utils/erros";

// Produto aberto no modal de edição, com as imagens originais
// (precisamos dos ids delas para editar/apagar no back-end)
interface Edicao {
  id: number;
  form: ProdutoForm;
  imagensOriginais: ImagemProduto[];
}

// Página onde o dono cria, edita e apaga os produtos das suas lojas.
export default function GerenciarProdutos() {
  const router = useRouter();
  const [lojas, setLojas] = useState<Loja[]>([]);
  const [lojaId, setLojaId] = useState<number | null>(null);
  const [categorias, setCategorias] = useState<OpcaoCategoria[]>([]);
  const [produtos, setProdutos] = useState<Produto[] | null>(null); // null = carregando
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [aberto, setAberto] = useState(false);
  const [edicao, setEdicao] = useState<Edicao | null>(null);

  // 1) Descobre quem está logado, as lojas dele e as categorias
  useEffect(() => {
    Promise.all([getMe(), getLojas(), getOpcoesCategorias()])
      .then(([eu, todasLojas, cats]: [{ sub: number }, Loja[], OpcaoCategoria[]]) => {
        const minhas = todasLojas.filter((l) => l.usuarioId === eu.sub);
        setLojas(minhas);
        setLojaId(minhas[0]?.id ?? null);
        setCategorias([...cats].sort((a, b) => a.caminho.localeCompare(b.caminho)));
      })
      .catch((e) => setErro(extrairMensagemErro(e, "Não foi possível carregar suas lojas.")))
      .finally(() => setCarregando(false));
  }, []);

  // 2) Lista os produtos da loja escolhida
  useEffect(() => {
    if (lojaId === null) return;
    let ativo = true;
    getProdutos({ lojaId })
      .then((lista) => ativo && setProdutos(lista))
      .catch((e) => ativo && setErro(extrairMensagemErro(e, "Não foi possível carregar os produtos.")));
    return () => {
      ativo = false;
    };
  }, [lojaId]);

  // Recarrega depois de salvar/deletar
  const recarregarProdutos = useCallback(async () => {
    if (lojaId === null) return;
    try {
      setProdutos(await getProdutos({ lojaId }));
    } catch (e) {
      setErro(extrairMensagemErro(e, "Não foi possível carregar os produtos."));
    }
  }, [lojaId]);

  const trocarLoja = (id: number) => {
    setProdutos(null);
    setLojaId(id);
  };

  const abrirNovo = () => {
    setEdicao(null);
    setAberto(true);
  };

  // A listagem só traz a imagem principal, então busca o produto completo antes de editar
  const abrirEdicao = async (id: number) => {
    try {
      const p = await getProduto(id);
      const imagensOriginais = [...p.imagens].sort((a, b) => a.ordem - b.ordem).slice(0, 4);
      const imagens = ["", "", "", ""];
      imagensOriginais.forEach((img, i) => (imagens[i] = img.urlImagem));
      setEdicao({
        id,
        imagensOriginais,
        form: {
          nome: p.nome,
          categoriaId: p.categoriaId,
          descricao: p.descricao ?? "",
          preco: formatarPreco(Number(p.preco)),
          estoque: p.estoque,
          imagens,
        },
      });
      setAberto(true);
    } catch (e) {
      setErro(extrairMensagemErro(e, "Não foi possível abrir o produto."));
    }
  };

  const salvar = async (form: ProdutoForm) => {
    if (lojaId === null) throw new Error("Você precisa ter uma loja para cadastrar produtos.");

    const dados = {
      categoriaId: Number(form.categoriaId),
      nome: form.nome.trim(),
      descricao: form.descricao.trim() || undefined,
      preco: precoParaNumero(form.preco),
      estoque: form.estoque,
    };
    const urls = form.imagens.map((u) => u.trim());

    try {
      if (!edicao) {
        // Cria o produto e depois cada imagem, na ordem dos espaços
        const novo = await criarProduto({ ...dados, lojaId });
        for (const [i, url] of urls.entries()) {
          if (url) await adicionarImagemProduto(novo.id, url, i + 1);
        }
      } else {
        await atualizarProduto(edicao.id, dados);
        // Compara cada espaço com a imagem que estava lá antes
        for (const [i, url] of urls.entries()) {
          const antiga = edicao.imagensOriginais[i];
          if (antiga && !url) await deletarImagemProduto(antiga.id);
          else if (antiga && url !== antiga.urlImagem) await atualizarImagemProduto(antiga.id, url);
          else if (!antiga && url) await adicionarImagemProduto(edicao.id, url, i + 1);
        }
      }
    } catch (e) {
      throw new Error(extrairMensagemErro(e));
    } finally {
      await recarregarProdutos();
    }
  };

  const deletar = async () => {
    if (!edicao) return;
    try {
      await deletarProduto(edicao.id);
    } catch (e) {
      throw new Error(extrairMensagemErro(e));
    }
    await recarregarProdutos();
  };

  const lojaAtual = lojas.find((l) => l.id === lojaId);

  return (
    <main className="min-h-screen bg-[#F6F3E4]">
      <div className="bg-black pb-10">
        <Navbar />
      </div>

      <div className="px-4 py-10 md:px-16">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              title="Voltar"
              aria-label="Voltar"
              className="text-black transition hover:text-[#6A38F3]"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-black md:text-3xl">Meus produtos</h1>
              {lojaAtual && lojas.length === 1 && (
                <p className="text-sm text-gray-600">Loja: {lojaAtual.nome}</p>
              )}
            </div>
          </div>

          {lojaId !== null && (
            <button
              type="button"
              onClick={abrirNovo}
              className="ml-10 flex w-fit items-center gap-2 rounded-full bg-[#6A38F3] px-6 py-2.5 text-base font-medium text-white shadow-md transition hover:bg-[#7B4FF5] md:ml-0"
            >
              <Plus className="h-5 w-5" strokeWidth={3} />
              Adicionar produto
            </button>
          )}
        </div>

        {/* Escolha da loja quando o usuário tem mais de uma */}
        {lojas.length > 1 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {lojas.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => trocarLoja(l.id)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                  l.id === lojaId
                    ? "bg-[#6A38F3] text-white shadow-md"
                    : "bg-white text-black hover:bg-[#EDE7FE]"
                }`}
              >
                {l.nome}
              </button>
            ))}
          </div>
        )}

        {erro && (
          <p className="mb-6 w-fit rounded-xl bg-red-500/10 px-4 py-2 text-sm text-red-600">{erro}</p>
        )}

        {carregando || (lojaId !== null && !produtos && !erro) ? (
          <p className="text-sm text-gray-600">Carregando produtos...</p>
        ) : lojas.length === 0 ? (
          !erro && (
            <p className="rounded-3xl bg-white px-6 py-10 text-center text-sm text-gray-600">
              Você ainda não tem uma loja. Crie uma loja no seu perfil para cadastrar produtos.
            </p>
          )
        ) : produtos?.length === 0 ? (
          <p className="rounded-3xl bg-white px-6 py-10 text-center text-sm text-gray-600">
            Nenhum produto nesta loja ainda. Clique em “Adicionar produto”.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {produtos?.map((p) => (
              <li key={p.id} className="relative">
                <CardProduto produto={p} />
                <button
                  type="button"
                  onClick={() => abrirEdicao(p.id)}
                  title={`Editar ${p.nome}`}
                  aria-label={`Editar ${p.nome}`}
                  className="absolute left-3.5 top-3.5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[#6A38F3] text-white shadow-md transition hover:bg-[#7B4FF5]"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ModalProduto
        aberto={aberto}
        categorias={categorias}
        onFechar={() => setAberto(false)}
        onSalvar={salvar}
        produtoInicial={edicao?.form ?? null}
        onDeletar={deletar}
      />
    </main>
  );
}
