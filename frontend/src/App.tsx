// src/App.tsx (Versão corrigida e simplificada)

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Footer from "./components/Footer";
import Header from "./components/Header";
import { CityProvider } from "./contexts/CityContext";
import Detailed from "./pages/Detailed";
import ExtendedForecast from "./pages/ExtendedForecast";
import Home from "./pages/Home";

function App() {
  return (
    <CityProvider>
      <Router>
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
          <Header />

          <main className="flex-grow mx-auto px-4 py-6 w-full max-w-7xl">
            {/* O roteamento deve ser a única coisa aqui */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/detailed" element={<Detailed />} />
              <Route path="/extended" element={<ExtendedForecast />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </CityProvider>
  );
}

export default App;
