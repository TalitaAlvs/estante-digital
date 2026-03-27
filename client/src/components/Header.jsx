import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    navigate('/login');
    window.location.reload(); // Garante que o estado seja limpo
  };

  if (!usuario) return null; // Não mostra o header se não estiver logado

  return (
    <nav className="flex items-center justify-between px-10 py-6 bg-white border-b border-gray-100 mb-8">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-2xl font-black text-purple-600 tracking-tighter">
          Skoob<span className="text-gray-900">Clone</span>
        </Link>
        <div className="flex gap-6 text-sm font-bold text-gray-400">
          <Link to="/" className="hover:text-purple-600 transition-colors">Explorar</Link>
          <Link to="/estante" className="hover:text-purple-600 transition-colors">Minha Estante</Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Leitor(a)</p>
          <p className="text-sm font-bold text-gray-800">{usuario.nome}</p>
        </div>
        
        {/* Avatar Simples e Elegante */}
        <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-black">
          {usuario.nome.charAt(0).toUpperCase()}
        </div>

        <button 
          onClick={handleLogout}
          className="ml-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
          title="Sair da conta"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </nav>
  );
}