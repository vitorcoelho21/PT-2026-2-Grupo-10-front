import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="relative z-10 mx-auto -mt-6 max-w-3xl px-4">
      <div className="flex items-center rounded-full bg-white px-4 py-3 shadow-lg">
        <input
          type="text"
          placeholder="Procurar por..."
          className="flex-1 bg-transparent px-2 text-gray-700 outline-none"
        />
        <Search className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
}