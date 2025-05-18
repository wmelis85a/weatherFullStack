import Home from "./pages/Home";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <main className="w-full max-w-none px-4 py-6"> {/* Removendo limitação de largura */}
        <Home />
        <br></br>
        <Footer />
      </main>
    </div>
  );
}

export default App;