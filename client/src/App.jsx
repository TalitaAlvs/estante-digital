import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [books, setBooks] = useState([]);

  // Função para buscar livros do nosso Back-end
  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:3001/books');
      setBooks(response.data);
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
    }
  };

  // Executa a busca assim que a página carrega
  useEffect(() => {
    fetchBooks();
  }, []);

  return (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8 font-sans">
    <header className="max-w-6xl mx-auto mb-10 flex justify-between items-center">
      <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
        Minha Estante <span className="text-purple-600 font-black">Digital</span> 📚
      </h1>
      <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-2xl font-bold transition-all shadow-lg hover:shadow-purple-200">
        + Adicionar Livro
      </button>
    </header>

    <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {books.map((book) => (
        <div key={book._id} className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100 group">
          <div className="overflow-hidden rounded-xl mb-4 h-64 bg-gray-200">
            <img 
              src={book.coverUrl} 
              alt={book.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
          </div>
          <h3 className="text-lg font-bold text-gray-800 leading-tight mb-1">{book.title}</h3>
          <p className="text-gray-500 text-sm mb-3">{book.author}</p>
          <div className="flex justify-between items-center">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              book.status === 'Lido' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {book.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
)
}

export default App