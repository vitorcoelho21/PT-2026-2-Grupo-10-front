"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Store, User, LogOut } from "lucide-react";
import { logout } from "@/services/authService";

export default function NavbarLogado() {
  const router = useRouter();

  const handleLogout = () => {
    logout(); // Apaga o token do navegador de forma segura
    router.replace("/");
  };

  return (
    <nav className="flex items-center justify-between px-8 py-6 text-white">
      {/* Logótipo em SVG */}
      <Link href="/dashboard" className="flex items-center">
        <img 
          src="/images/LOGOStock.io.svg" 
          alt="STOCK.IO" 
          className="h-8 w-auto object-contain" 
        />
      </Link>

      <div className="flex items-center gap-6 text-sm font-semibold">
        <ShoppingBag className="h-5 w-5 cursor-pointer hover:text-gray-300" />
        
        <Link href="/lojas" title="Minhas Lojas">
          <Store className="h-5 w-5 cursor-pointer hover:text-gray-300" />
        </Link>

        <User className="h-5 w-5 cursor-pointer hover:text-gray-300" />

        <button 
          onClick={handleLogout} 
          title="Terminar Sessão"
          className="flex items-center gap-1 transition hover:text-red-400"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </nav>
  );
}