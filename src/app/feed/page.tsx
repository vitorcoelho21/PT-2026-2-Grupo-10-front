"use client";

import { useEffect, useState } from "react";
import NavbarLogado from "@/components/home/NavbarLogado";
import SearchBar from "@/components/home/SearchBar";
import CategoriasCarrossel from "@/components/home/CategoriasCarrossel";
import ProdutosDestaqueBeleza from "@/components/home/ProdutosDestaqueBeleza";
import ProdutosDestaqueMercado from "@/components/home/ProdutosDestaqueMercado";
import ProdutosDestaqueModa from "@/components/home/ProdutosDestaqueModa";
import RotaProtegida from "@/components/RotaProtegida";
import Fantoche from "@/components/home/Fantoche";
import { getMe } from "@/services/authService";

export default function DashboardPage() {
  const [usuarioEmail, setUsuarioEmail] = useState("");

  // Roda uma vez ao abrir: valida a sessão real no back-end
  useEffect(() => {
    getMe()
      .then((usuario) => setUsuarioEmail(usuario.email))
      .catch(() => {
        // Se o token falhar, o interceptor ou a própria rota tratam do redirecionamento
      });
  }, []);

  return (
    <RotaProtegida>
      <div className="min-h-screen bg-[#FDF8EE] font-sans">
        <div className="relative rounded-b-[40px] bg-black pb-16 overflow-hidden">
          <NavbarLogado />
          <Fantoche />
        </div>

        {}
        <SearchBar />

        {}
        <div className="px-8 py-12 md:px-16">
          <CategoriasCarrossel />
          <ProdutosDestaqueMercado />
          <ProdutosDestaqueBeleza />
          <ProdutosDestaqueModa />
        </div>
      </div>
    </RotaProtegida>
  );
}