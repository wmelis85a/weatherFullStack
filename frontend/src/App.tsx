import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Detailed from "./pages/Detailed";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import { PrevisaoResponse } from "./types/weather";
import ForecastCard from "./components/ForecastCard";

function App() {
  const [searchForecast, setSearchForecast] = useState<PrevisaoResponse | null>(null); // ✅ MOVIDO AQUI

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <SearchBar onSearch={setSearchForecast} /> {/* ok fora do <main> */}
        
        <main className="mx-auto px-4 py-6 w-full max-w-7xl">
          {searchForecast ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {searchForecast.cidade.previsao.map((dia) => (
                <ForecastCard key={dia.dia} {...dia} />
              ))}
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/detailed" element={<Detailed />} />
            </Routes>
          )}
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
