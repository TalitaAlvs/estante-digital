import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Estante() {
  const [books, setBooks] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState('Todos');
  const [carregando, setCarregando] = useState(true);

  // Busca os livros do SEU banco de dados (Porta 3001!)
  const fetchBooks = async () => {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
  
    if (!usuario) return; // Se não houver usuário, nem tenta buscar

    try {
      const res = await axios.get('http://localhost:3001/api/books/${usuario.id}');
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

  // Filtra os livros de acordo com a aba selecionada
  const livrosFiltrados = abaAtiva === 'Todos' 
    ? books 
    : books.filter(book => book.status === abaAtiva);

  const categorias = ['Todos', 'Quero Ler', 'Lendo', 'Lido'];

  return (
    <div className="pb-16 animate-in fade-in duration-500">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-800 tracking-tight">Minha <span className="text-purple-600">Estante</span></h1>
          <p className="text-gray-500 mt-2 font-medium">Você tem {books.length} livros na sua coleção pessoal.</p>
        </div>

        {/* --- NAVEGAÇÃO POR ABAS --- */}
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

      {/* --- GRID DE LIVROS --- */}
      {carregando ? (
        <div className="text-center py-20 text-gray-400 font-bold animate-pulse">Carregando sua estante... 📖</div>
      ) : livrosFiltrados.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {livrosFiltrados.map((book) => (
            <div key={book._id} className="group cursor-pointer">
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-md group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300 border border-gray-100">
                <img 
                  src={book.coverUrl || 'https://via.placeholder.com/150x225?text=Sem+Capa'} 
                  className="w-full h-full object-cover"
                  alt={book.title}
                />
                {/* Badge de Status flutuante */}
                <div className="absolute top-3 right-3">
                  <span className="bg-white/90 backdrop-blur-sm text-[10px] font-black px-2 py-1 rounded-lg shadow-sm text-purple-700 uppercase">
                    {book.status}
                  </span>
                </div>
              </div>
              <h3 className="mt-4 font-bold text-gray-800 text-sm line-clamp-1 group-hover:text-purple-600 transition-colors">{book.title}</h3>
              <p className="text-xs text-gray-500 font-medium">{book.author}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <p className="text-4xl mb-4 text-gray-300">🏜️</p>
          <p className="text-gray-400 font-bold italic">Nenhum livro encontrado nesta categoria.</p>
        </div>
      )}
    </div>
  );
}