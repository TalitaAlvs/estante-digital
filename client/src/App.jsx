import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Estante from './pages/Estante';
import Login from './pages/Login';
import Busca from './pages/Busca';
import Perfil from './pages/Perfil';

function App() {
  const [usuario, setUsuario] = useState(null);

  // Verifica se tem alguém logado assim que o app abre
  useEffect(() => {
    const dadosSalvos = localStorage.getItem('usuarioLogado');
    if (dadosSalvos) {
      setUsuario(JSON.parse(dadosSalvos));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    setUsuario(null);
    window.location.href = '/login';
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        
        {/* Menu de Navegação */}
        <nav className="bg-white shadow-sm p-4 mb-8 rounded-b-[2.5rem] border-b border-purple-50">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link to="/" className="text-2xl font-black text-purple-600 tracking-tighter">
              Book<span className="text-gray-900">shelf</span>
            </Link>
            
            <div className="flex items-center gap-6 font-bold text-gray-600">
              <Link to="/" className="hover:text-purple-600 transition-colors">Minha Estante</Link>
              <Link to="/busca" className="hover:text-purple-600 transition-colors">Explorar</Link>
              
              {/* Se estiver logado, mostra o nome. Se não, mostra o botão Entrar */}
              {usuario ? (
                <div className="flex items-center gap-4 pl-4 border-l border-gray-100">
                  <Link to="/perfil" className="text-sm text-gray-400 font-medium hover:text-purple-600">Olá, {usuario.nome}</Link>
                  <button 
                    onClick={handleLogout}
                    className="text-red-400 hover:text-red-600 text-sm transition-colors"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <Link to="/login" className="bg-purple-100 text-purple-700 px-5 py-2 rounded-xl hover:bg-purple-200 transition-all text-sm">
                  Entrar
                </Link>
              )}
            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-4">
          <Routes>
            <Route path="/" element={<Estante />} />
            <Route path="/busca" element={<Busca />} />
            <Route path="/login" element={<Login />} />
            <Route path="/perfil" element={<Perfil />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;