import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Estante from './pages/Estante';
import Login from './pages/Login';
import Busca from './pages/Busca';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        {/* Menu de Navegação - Estilo Moderno/Arredondado */}
        <nav className="bg-white shadow-sm shadow-b p-4 mb-8 rounded-b-4xl">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link to="/" className="text-2xl font-black text-purple-600">Bookshelf</Link>
            
            <div className="flex gap-6 font-bold text-gray-600">
              <Link to="/" className="hover:text-purple-600 transition-colors">Minha Estante</Link>
              <Link to="/busca" className="hover:text-purple-600 transition-colors">Explorar/Busca</Link>
              <Link to="/login" className="bg-purple-100 text-purple-700 px-4 py-2 rounded-xl hover:bg-purple-200 transition-all">Entrar</Link>
            </div>
          </div>
        </nav>

        {/* Aqui é onde as páginas "trocam" */}
        <main className="max-w-6xl mx-auto px-4">
          <Routes>
            <Route path="/" element={<Estante />} />
            <Route path="/busca" element={<Busca />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;