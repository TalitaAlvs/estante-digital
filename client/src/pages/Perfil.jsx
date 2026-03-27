import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Perfil() {
  const [usuario, setUsuario] = useState(JSON.parse(localStorage.getItem('usuarioLogado')));
  const [estatisticas, setEstatisticas] = useState({ total: 0, lendo: 0, lidos: 0 });

  useEffect(() => {
    const buscarDadosPerfil = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/books/${usuario.id}`);
        const livros = res.data;
        
        // Lógica de contagem para o seu painel
        setEstatisticas({
          total: livros.length,
          lendo: livros.filter(b => b.status === 'Lendo').length,
          lidos: livros.filter(b => b.status === 'Lido').length
        });
      } catch (err) {
        console.error("Erro ao carregar estatísticas");
      }
    };

    if (usuario) buscarDadosPerfil();
  }, [usuario]);

  if (!usuario) return <div className="text-center mt-20">Por favor, faça login.</div>;

    const obterLiga = (totalLidos) => {
        if (totalLidos >= 60) return { nome: "Liga Diamante", classe: "bg-gradient-to-r from-cyan-400 to-blue-400 text-white shadow-cyan-200" };
        if (totalLidos >= 46) return { nome: "Liga Obsidiana", classe: "bg-gray-800 text-gray-100" };
        if (totalLidos >= 36) return { nome: "Liga Pérola", classe: "bg-pink-100 text-pink-600" };
        if (totalLidos >= 28) return { nome: "Liga Ametista", classe: "bg-purple-500 text-white" };
        if (totalLidos >= 21) return { nome: "Liga Esmeralda", classe: "bg-emerald-500 text-white" };
        if (totalLidos >= 15) return { nome: "Liga Rubi", classe: "bg-red-500 text-white" };
        if (totalLidos >= 10) return { nome: "Liga Safira", classe: "bg-blue-500 text-white" };
        if (totalLidos >= 6)  return { nome: "Liga Ouro", classe: "bg-yellow-400 text-yellow-900" };
        if (totalLidos >= 3)  return { nome: "Liga Prata", classe: "bg-slate-300 text-slate-700" };
        return { nome: "Liga Bronze", classe: "bg-amber-600 text-white" };
    };

    const ligaAtual = obterLiga(estatisticas.lidos);

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header do Perfil */}
            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-purple-50 flex flex-col md:flex-row items-center gap-8 mb-8">
                <div className="w-32 h-32 bg-purple-600 text-white rounded-full flex items-center justify-center text-5xl font-black shadow-xl shadow-purple-200">
                {usuario.nome.charAt(0).toUpperCase()}
                </div>
                <div className="text-center md:text-left">
                    <h1 className="text-4xl font-black text-gray-900">{usuario.nome}</h1>
                    <p className="text-gray-400 font-medium">{usuario.email}</p>
                    
                    {/* BADGE DINÂMICO ESTILO DUOLINGO */}
                    <div className={`inline-flex items-center gap-2 mt-4 px-5 py-2 ${ligaAtual.classe} rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] shadow-lg transition-all duration-500`}>
                        <span className="text-base">🏆</span>
                        {ligaAtual.nome}
                    </div>
                </div>
            </div>

            {/* Grid de Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center">
                    <p className="text-4xl mb-2">📚</p>
                    <h3 className="text-3xl font-black text-gray-800">{estatisticas.total}</h3>
                    <p className="text-gray-400 font-bold text-sm uppercase">Na Estante</p>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center">
                    <p className="text-4xl mb-2">📖</p>
                    <h3 className="text-3xl font-black text-purple-600">{estatisticas.lendo}</h3>
                    <p className="text-gray-400 font-bold text-sm uppercase">Lendo Agora</p>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center">
                    <p className="text-4xl mb-2">🏆</p>
                    <h3 className="text-3xl font-black text-green-500">{estatisticas.lidos}</h3>
                    <p className="text-gray-400 font-bold text-sm uppercase">Livros Lidos</p>
                </div>
            </div>
        </div>
  );
}