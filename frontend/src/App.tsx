import Home from "./pages/Home";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-6">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Hometown forecast. Next 4 days</h1>
        <p className="text-sm text-gray-600">Weather api data</p>
      </header>
      <main>
        <Home />
        <br></br>
        <Footer />
      </main>
    </div>
  );
}

export default App;