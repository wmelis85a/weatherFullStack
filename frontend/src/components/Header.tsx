import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-gray-800 p-4">
      <nav className="flex space-x-4">
        <Link to="/" className="text-white hover:text-gray-400">Home</Link>
        <Link to="/detailed" className="text-white hover:text-gray-400">Detailed Forecast</Link>
      </nav>
    </header>
  );
};

export default Header;
