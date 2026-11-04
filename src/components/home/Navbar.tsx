import Link from "next/link";
import { ShoppingBag, Store } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-6 text-white">
      {/* Logotipo em SVG */}
      <Link href="/" className="flex items-center">
        <img 
          src="/images/LOGOStock.io.svg" 
          alt="STOCK.IO" 
          className="h-8 w-auto object-contain" 
        />
      </Link>





      {/* Links de navegação e autenticação */}
      <div className="flex items-center gap-6 text-sm font-semibold">
         <ShoppingBag className="h-5 w-5 cursor-pointer hover:text-gray-300" />
        
        <Link href="/lojas" title="Minhas Lojas">
          <Store className="h-5 w-5 cursor-pointer hover:text-gray-300" />
        </Link>
        <Link href="/login" className="hover:text-gray-300">LOGIN</Link>
        <Link href="/cadastro" className="rounded-full bg-[#7B3CF6] px-6 py-2 transition hover:bg-purple-600">
          CADASTRE-SE
        </Link>
      </div>
    </nav>
  );
}