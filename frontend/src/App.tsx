import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Detailed from "./pages/Detailed";
import Header from "./components/Header";


function App() {
  return (
    <Router>
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="mx-auto px-4 py-6 w-full max-w-7xl">
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detailed" element={<Detailed />} />
          </Routes>
      </main>
      <Footer />
    </div>
    </Router>
  );
}

export default App;