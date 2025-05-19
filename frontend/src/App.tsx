import Home from "./pages/Home";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="mx-auto px-4 py-6 w-full max-w-7xl">
        <Home />
        <Footer />
      </main>
    </div>
  );
}

export default App;