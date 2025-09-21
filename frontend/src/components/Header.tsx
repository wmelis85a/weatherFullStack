// src/components/Header.tsx (Versão corrigida e consistente)

import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/detailed">Detailed Forecast</Link>
          </li>
          <li>
            <Link to="/extended">Extended Forecast</Link>
          </li>
        </ul>
      </nav>
      {/* 👈 A SearchBar agora é renderizada sem props */}
      <SearchBar />
    </header>
  );
}
