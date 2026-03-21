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
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Minha Estante Digital 📚</h1>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {books.map((book) => (
          <div key={book._id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', width: '200px' }}>
            <img src={book.coverUrl} alt={book.title} style={{ width: '100%', borderRadius: '4px' }} />
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            <span style={{ background: '#eee', padding: '2px 8px', borderRadius: '10px', fontSize: '12px' }}>
              {book.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App