import { useState } from 'react';
import axios from 'axios'; 

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  
  // NOVOS ESTADOS
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // NOVA FUNÇÃO: Lógica para enviar os dados para o servidor (Porta 3001)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Impede a página de recarregar
    
    // Define para qual rota mandar (Login ou Cadastro)
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin ? { email, senha } : { nome, email, senha };

    try {
      const response = await axios.post(`http://localhost:3001${endpoint}`, payload);
      
      if (isLogin) {
        // Se logar, guardamos os dados básicos no navegador
        localStorage.setItem('usuarioLogado', JSON.stringify(response.data.user));
        alert(`Bem-vindo(a) de volta! 👋`);
        window.location.href = '/'; // Redireciona para a estante
      } else {
        alert("Conta criada! Agora você já pode fazer login.");
        setIsLogin(true); // Muda para a tela de login automaticamente
      }
    } catch (err) {
      // Exibe o erro vindo do servidor (ex: "E-mail já cadastrado")
      alert(err.response?.data?.message || "Erro na autenticação! Verifique se seu e-mail ou senha estão corretos.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] animate-in fade-in zoom-in duration-300">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-purple-50 w-full max-w-md">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-800 mb-2">
            {isLogin ? 'Bem-vindo(a)!' : 'Crie sua conta'}
          </h2>
          <p className="text-gray-500 font-medium">
            {isLogin ? 'Sua estante virtual está te esperando.' : 'Comece a organizar suas leituras hoje mesmo.'}
          </p>
        </div>

        {/* CONEXÃO NO FORM: Adicionamos o onSubmit aqui */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-4">Nome Completo</label>
              <input 
                type="text" 
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)} // Conecta o input ao estado 'nome'
                placeholder="Como quer ser chamado?"
                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-purple-500 focus:bg-white rounded-2xl outline-none transition-all text-gray-700"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-4">E-mail</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Conecta o input ao estado 'email'
              placeholder="seu@email.com"
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-purple-500 focus:bg-white rounded-2xl outline-none transition-all text-gray-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-4">Senha</label>
            <input 
              type="password" 
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)} // Conecta o input ao estado 'senha'
              placeholder="••••••••"
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-purple-500 focus:bg-white rounded-2xl outline-none transition-all text-gray-700"
            />
          </div>

          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-200 transition-all transform active:scale-95 mt-4">
            {isLogin ? 'Entrar na Estante' : 'Finalizar Cadastro'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-bold text-gray-400">
          {isLogin ? 'Novo por aqui?' : 'Já tem uma conta?'} 
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-purple-600 hover:text-purple-700 underline underline-offset-4"
          >
            {isLogin ? 'Criar conta gratuita' : 'Fazer login'}
          </button>
        </div>
      </div>
    </div>
  );
}