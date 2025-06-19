import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home";
import Footer from "./components/Footer";
import Detailed from "./pages/Detailed";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import ForecastCard from "./components/ForecastCard";

import { PrevisaoResponse } from "./types/weather";
import { CityProvider } from "./contexts/CityContext";

function App() {
  const [searchForecast, setSearchForecast] = useState<PrevisaoResponse | null>(null);

  return (
    <CityProvider>
      <Router>
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
          <Header />
          <SearchBar onSearch={setSearchForecast} /> {/* Atualiza o contexto e a previsão */}

          <main className="flex-grow mx-auto px-4 py-6 w-full max-w-7xl">
              {searchForecast && searchForecast.cidade ? (
              <div>
                <h2 className="text-xl font-bold text-center mb-6">
                  Previsão para {searchForecast.cidade.nome}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {searchForecast.cidade.previsao.map((dia) => (
                    <ForecastCard key={dia.dia} {...dia} />
                  ))}
                </div>
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
    </CityProvider>
  );
}

export default App;
