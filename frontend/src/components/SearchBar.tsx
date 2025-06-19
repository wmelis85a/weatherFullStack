import { useState } from "react";
import { getHomeForecast } from "../services/api";
import { PrevisaoResponse } from "../types/weather";

interface SearchBarProps {
  onSearch: (data: PrevisaoResponse | null) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    try {
      const response = await getHomeForecast(query);
      onSearch(response);
    } catch (error) {
      onSearch(null);
    }
  };

  return (
    <header className="bg-gray-900 text-white px-4 py-4 shadow-md">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for city name"
          className="px-3 py-2 rounded-md text-black w-64"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
        >
          Search
        </button>
      </div>
    </header>
  );
}
