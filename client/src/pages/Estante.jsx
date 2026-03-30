import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Estante() {
  const [books, setBooks] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState('Todos');
  const [carregando, setCarregando] = useState(true);

  const fetchBooks = async () => {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuario) return;

    try {
      const res = await axios.get(`http://localhost:3001/api/books/${usuario.id}`);
      setBooks(res.data);
    } catch (err) {
      console.error("Erro ao buscar livros da estante:", err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const livrosFiltrados = abaAtiva === 'Todos' 
    ? books 
    : books.filter(book => book.status === abaAtiva);

  const categorias = ['Todos', 'Quero Ler', 'Lendo', 'Lido'];

  return (
    <div className="pb-16 animate-in fade-in duration-500">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-800 tracking-tight">
            Minha <span className="text-purple-600">Estante</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Você tem {books.length} livros na sua coleção pessoal.
          </p>
        </div>

        <div className="flex bg-gray-100 p-1.5 rounded-2xl">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setAbaAtiva(cat)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                abaAtiva === cat 
                ? 'bg-white text-purple-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* --- LÓGICA DE RENDERIZAÇÃO --- */}
      {carregando ? (
        <div className="text-center py-20 text-gray-400 font-bold animate-pulse">
          Carregando sua estante... 📖
        </div>
      ) : books.length === 0 ? (
        /* ESTADO VAZIO: Estante totalmente zerada */
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[3rem] border border-purple-50 shadow-sm">
          <div className="w-40 h-40 bg-purple-50 rounded-full flex items-center justify-center mb-8 text-6xl">
            🏜️
          </div>
          <h2 className="text-2xl font-black text-gray-800 mb-3">Sua estante está solitária...</h2>
          <p className="text-gray-500 max-w-sm mb-10 font-medium">
            Parece que você ainda não adicionou nenhum livro. Que tal encontrar sua próxima aventura?
          </p>
          <Link 
            to="/busca" 
            className="bg-purple-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-purple-700 transition-all shadow-xl shadow-purple-100"
          >
            Explorar Livros 🔍
          </Link>
        </div>
      ) : livrosFiltrados.length === 0 ? (
        /* ESTADO VAZIO: Filtro específico sem resultados */
        <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
          <p className="text-5xl mb-6">🔍</p>
          <p className="text-gray-400 font-bold italic text-lg">
            Nenhum livro marcado como "{abaAtiva}" ainda.
          </p>
        </div>
      ) : (
        /* GRID DE LIVROS: Quando há o que mostrar */
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {livrosFiltrados.map((book) => (
            <div key={book._id} className="group cursor-pointer">
              <div className="relative aspect-[2/3] rounded-[2rem] overflow-hidden shadow-md group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300 border border-gray-100">
                <img 
                  src={book.coverUrl || 'https://via.placeholder.com/150x225?text=Sem+Capa'} 
                  className="w-full h-full object-cover"
                  alt={book.title}
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-white/95 backdrop-blur-sm text-[10px] font-black px-3 py-1.5 rounded-xl shadow-sm text-purple-700 uppercase tracking-wider">
                    {book.status}
                  </span>
                </div>
              </div>
              <h3 className="mt-5 font-bold text-gray-800 text-base line-clamp-1 group-hover:text-purple-600 transition-colors">
                {book.title}
              </h3>
              <p className="text-sm text-gray-400 font-semibold">{book.author}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}