import { ChevronDown } from "lucide-react";

export default function FiltrosModa() {
  return (
    <div className="px-8 md:px-16 pb-8 -mt-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          <button className="px-6 py-2.5 rounded-full bg-white shadow-sm text-sm font-medium text-gray-600 hover:bg-gray-50 transition">Vestidos</button>
          <button className="px-6 py-2.5 rounded-full bg-white shadow-sm text-sm font-medium text-gray-600 hover:bg-gray-50 transition">Blusas</button>
          <button className="px-6 py-2.5 rounded-full bg-white shadow-sm text-sm font-medium text-gray-600 hover:bg-gray-50 transition">Calças</button>
          <button className="px-6 py-2.5 rounded-full bg-white shadow-sm text-sm font-medium text-gray-600 hover:bg-gray-50 transition">Casacos</button>
          <button className="px-6 py-2.5 rounded-full bg-white shadow-sm text-sm font-medium text-gray-600 hover:bg-gray-50 transition">Outros</button>
        </div>

        <div className="flex items-center gap-2 bg-white px-6 py-2.5 rounded-full shadow-sm text-sm font-medium text-gray-400 cursor-pointer hover:bg-gray-50 transition">
          <span>ordenar por</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}