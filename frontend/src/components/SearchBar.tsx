// SearchBar.tsx
import { useState } from "react";
import { useCity } from "../contexts/CityContext";


export default function SearchBar() {
  const [query, setQuery] = useState("");
  const { setCity } = useCity();

  const handleSearch = () => {
    if (!query) return;
    setCity(query);
    setQuery(""); // Limpa o input
  };

  return (
    <div className="flex justify-center mb-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Digite o nome da cidade"
        className="px-4 py-2 rounded-l bg-gray-700 text-white"
      />
      <button
        onClick={handleSearch}
        className="px-4 py-2 rounded-r bg-blue-500 hover:bg-blue-600 text-white"
      >
        Buscar
      </button>
    </div>
  );
}
