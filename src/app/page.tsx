

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/home/Navbar";
import HeroSection from "@/components/home/Fantoche";
import SearchBar from "@/components/home/SearchBar";
import CategoriasCarrossel from "@/components/home/CategoriasCarrossel";
import ProdutosDestaqueMercado from "@/components/home/ProdutosDestaqueMercado";
import ProdutosDestaqueBeleza from "@/components/home/ProdutosDestaqueBeleza";
import ProdutosDestaqueModa from "@/components/home/ProdutosDestaqueModa";
import { getToken } from "@/utils/token"; // Usando a mesma função segura de token do teu projeto



export default function HomePage() {


const router = useRouter();
  const [verificando, setVerificando] = useState(true);

  useEffect(() => {
    // Verifica se já existe um token ativo no navegador
    const token = getToken();
    
    if (token) {
      // Se estiver logado, redireciona automaticamente para o dashboard
      router.replace("/dashboard");
    } else {
      // Se não estiver logado, libera a exibição da landing page pública
      setVerificando(false);
    }
  }, [router]);

  // Evita que a landing page apareça a "piscar" antes de fazer o redirecionamento
  if (verificando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDF8EE] text-black">
        <p className="text-sm font-medium">A verificar sessão...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF8EE] font-sans">
      {/* Topo Preto (Navbar + Hero) */}
      <div className="relative rounded-b-[40px] bg-black pb-24">
        <Navbar />
        <HeroSection />
      </div>

      {/* Barra de Pesquisa Flutuante */}
      <SearchBar />

      {/* Conteúdo Principal (Bege) */}
      <div className="px-8 py-12 md:px-16">
        <CategoriasCarrossel />
        <ProdutosDestaqueMercado />
        <ProdutosDestaqueBeleza />
        <ProdutosDestaqueModa />

      </div>
    </div>
  );
}