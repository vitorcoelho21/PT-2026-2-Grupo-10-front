"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import RotaProtegida from "@/components/RotaProtegida";
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

// Transforma o erro do axios na mensagem que o back-end mandou (o Nest às vezes manda uma lista)
function mensagemDeErro(erro: unknown) {
  if (axios.isAxiosError(erro)) {
    const msg = erro.response?.data?.message;
    if (Array.isArray(msg)) return msg.join(" ");
    if (typeof msg === "string") return msg;
  }
  return "Não foi possível falar com o servidor.";
}

// Produto que está aberto no modal de edição, com as imagens originais
// (precisamos dos ids delas para editar/apagar no back-end)
interface Edicao {
  id: number;
  form: ProdutoForm;
  imagensOriginais: ImagemProduto[];
}

export default function TesteModalPage() {
  return (
    <RotaProtegida>
      <TesteModal />
    </RotaProtegida>
  );
}

function TesteModal() {
  const [lojas, setLojas] = useState<Loja[]>([]);
  const [lojaId, setLojaId] = useState<number | null>(null);
  const [categorias, setCategorias] = useState<OpcaoCategoria[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroPagina, setErroPagina] = useState("");

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
      .catch((e) => setErroPagina(mensagemDeErro(e)))
      .finally(() => setCarregando(false));
  }, []);

  // 2) Lista os produtos da loja escolhida (de novo sempre que salvar/deletar)
  const carregarProdutos = useCallback(async () => {
    if (lojaId === null) return;
    try {
      setProdutos(await getProdutos({ lojaId }));
    } catch (e) {
      setErroPagina(mensagemDeErro(e));
    }
  }, [lojaId]);

  useEffect(() => {
    if (lojaId === null) return;
    let ativo = true;
    getProdutos({ lojaId })
      .then((lista) => ativo && setProdutos(lista))
      .catch((e) => ativo && setErroPagina(mensagemDeErro(e)));
    return () => {
      ativo = false;
    };
  }, [lojaId]);

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
      setErroPagina(mensagemDeErro(e));
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
      throw new Error(mensagemDeErro(e));
    } finally {
      await carregarProdutos();
    }
  };

  const deletar = async () => {
    if (!edicao) return;
    try {
      await deletarProduto(edicao.id);
    } catch (e) {
      throw new Error(mensagemDeErro(e));
    }
    await carregarProdutos();
  };

  if (carregando) {
    return <main className="min-h-screen bg-[#FDF8EE] p-16 text-gray-500">Carregando...</main>;
  }

  return (
    <main className="min-h-screen bg-[#FDF8EE] px-8 py-12 md:px-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Teste do modal de produto</h1>
          {lojas.length > 1 && (
            <select
              className="mt-2 rounded-full bg-white px-4 py-2 text-sm text-black"
              value={lojaId ?? ""}
              onChange={(e) => setLojaId(Number(e.target.value))}
            >
              {lojas.map((l) => (
                <option key={l.id} value={l.id}>{l.nome}</option>
              ))}
            </select>
          )}
          {lojas.length === 1 && <p className="mt-1 text-sm text-gray-600">Loja: {lojas[0].nome}</p>}
        </div>
        <button
          onClick={abrirNovo}
          disabled={lojaId === null}
          className="rounded-full bg-[#6A38F3] px-6 py-3 text-sm font-medium text-white shadow-md hover:bg-[#5a2de0] disabled:opacity-50"
        >
          + Adicionar produto
        </button>
      </div>

      {erroPagina && <p className="mb-6 text-red-600">{erroPagina}</p>}

      {!erroPagina && lojas.length === 0 ? (
        <p className="text-gray-500">Você ainda não tem uma loja. Crie uma loja para cadastrar produtos.</p>
      ) : produtos.length === 0 ? (
        <p className="text-gray-500">Nenhum produto nesta loja. Clique em “Adicionar produto”.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {produtos.map((p) => (
            <li key={p.id}>
              <button
                onClick={() => abrirEdicao(p.id)}
                className="w-full overflow-hidden rounded-3xl bg-white text-left shadow-sm transition hover:shadow-md"
              >
                <div className="flex h-32 items-center justify-center bg-gray-100">
                  {p.imagens[0] ? (
                    <img src={p.imagens[0].urlImagem} alt={p.nome} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs text-gray-400">Sem foto</span>
                  )}
                </div>
                <div className="p-4">
                  <p className="truncate font-semibold text-black">{p.nome}</p>
                  <p className="text-xs text-gray-500">
                    {p.categoria.nome} · {p.estoque} em estoque
                  </p>
                  <p className="mt-1 font-bold text-[#6A38F3]">{formatarPreco(Number(p.preco))}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

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
