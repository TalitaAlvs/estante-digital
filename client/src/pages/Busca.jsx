import { useState } from 'react';
import axios from 'axios';

export default function Busca() {
  const [termoBusca, setTermoBusca] = useState('');
  const [resultados, setResultados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [idMenuAberto, setIdMenuAberto] = useState(null);
  const [erro, setErro] = useState(null);

  const buscarLivros = async () => {
    if (!termoBusca) return;
    setCarregando(true);
    setErro(null);
    setResultados([]);

    try {
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${termoBusca}&printType=books&maxResults=12`);
      if (response.data.items) {
        setResultados(response.data.items);
      } else {
        setResultados([]);
      }
    } catch (err) {
      console.error("Erro na busca do Google Books:", err);
      setErro("Não foi possível realizar a busca. Tente novamente mais tarde.");
    } finally {
      setCarregando(false);
    }
  };

  const adicionarAEstante = async (livro, statusSelecionado) => {
    // Pegamos os dados do usuário logado
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

    // Verificação de segurança: se o usuário não estiver logado, avisa e para.
    if (!usuario || !usuario.id) {
      alert("Você precisa estar logada para adicionar livros!");
      return;
    }

    const novoLivro = {
      googleId: livro.id,
      title: livro.volumeInfo.title,
      author: livro.volumeInfo.authors?.join(', ') || 'Autor Desconhecido',
      coverUrl: livro.volumeInfo.imageLinks?.thumbnail || '',
      status: statusSelecionado,
      userId: usuario.id // ENVIAMOS O ID AQUI!
    };

    try {
      await axios.post('http://localhost:3001/api/books', novoLivro);
      alert(`${novoLivro.title} foi adicionado à sua estante! 📚`);
    } catch (err) {
      console.error("Erro ao salvar livro:", err);
      alert("Erro ao salvar o livro. Verifique se o servidor está ligado.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      buscarLivros();
    }
  };

  const getCapa = (volumeInfo) => {
    return volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail || 'https://via.placeholder.com/128x192?text=Sem+Capa';
  };

  const getAutores = (authors) => {
    return authors ? authors.join(', ') : 'Autor Desconhecido';
  };

  return (
    <div className="pb-16 font-sans">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
          Explorar Novos <span className="text-purple-600">Livros</span> 🔍
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Pesquise na vasta biblioteca do Google Books e encontre sua próxima leitura.
        </p>
      </header>

      <div className="max-w-2xl mx-auto mb-16 relative">
        <div className="flex gap-3 p-3 bg-white rounded-3xl shadow-xl border border-purple-100 hover:border-purple-200 transition-all focus-within:ring-2 focus-within:ring-purple-200">
          <input 
            type="text" 
            placeholder="Digite título, autor ou ISBN..."
            className="flex-1 px-5 py-3 outline-none text-gray-800 text-lg bg-transparent"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button 
            onClick={buscarLivros}
            disabled={carregando}
            className="bg-purple-600 text-white px-8 py-3 rounded-2xl font-bold text-lg hover:bg-purple-700 transition-all disabled:bg-gray-400"
          >
            {carregando ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </div>

      {erro && (
        <div className="text-center p-6 bg-red-50 text-red-700 rounded-2xl max-w-md mx-auto mb-10 border border-red-200">
          <p>{erro}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {resultados.map((item) => {
          const { volumeInfo } = item;
          return (
            <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col h-full">
              <div className="overflow-hidden rounded-xl mb-5 aspect-[2/3] bg-gray-100">
                <img 
                  src={getCapa(volumeInfo)} 
                  alt={volumeInfo.title} 
                  className="w-full h-full object-cover" 
                />
              </div>

              <div className="flex-grow mb-4">
                <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{volumeInfo.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-1">{getAutores(volumeInfo.authors)}</p>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-50 min-h-[80px] flex items-center justify-center">
                {idMenuAberto !== item.id ? (
                  <button 
                    onClick={() => setIdMenuAberto(item.id)}
                    className="w-full bg-purple-50 text-purple-700 py-3 rounded-xl font-bold text-sm hover:bg-purple-600 hover:text-white transition-all shadow-sm"
                  >
                    + Adicionar à Estante
                  </button>
                ) : (
                  <div className="w-full">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 text-center">
                      Adicionar como:
                    </p>
                    <div className="flex gap-1.5 justify-center">
                      {['Quero Ler', 'Lendo', 'Lido'].map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            adicionarAEstante(item, status);
                            setIdMenuAberto(null);
                          }}
                          className="flex-1 bg-white border-2 border-purple-100 text-purple-700 py-2 rounded-lg text-[10px] font-bold hover:border-purple-600 transition-colors"
                        >
                          {status}
                        </button>
                      ))}
                      <button onClick={() => setIdMenuAberto(null)} className="px-2 text-gray-400 hover:text-red-500">✕</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!carregando && resultados.length === 0 && termoBusca !== '' && !erro && (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-xl">Clique em buscar para explorar...</p>
        </div>
      )}

      {carregando && (
        <div className="text-center mt-20">
          <div className="inline-block animate-bounce text-purple-600 font-bold text-xl">
            Buscando na biblioteca do Google... 📚
          </div>
        </div>
      )}
    </div>
  );
}