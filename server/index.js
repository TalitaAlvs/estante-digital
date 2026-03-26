
const Book = require('./models/Book');
const User = require('./models/User');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Importamos o tradutor do banco

const app = express();

app.use(cors()); // Isso permite que o React acesse o Back-end

// Configuração para o Express entender JSON no corpo das requisições
app.use(express.json());

const PORT = 3001;

const mongoURI = "mongodb://talitamoraisalv_db_user:31uYl6hrdYwpuP7Q@ac-prlpsz1-shard-00-00.gopwjrr.mongodb.net:27017,ac-prlpsz1-shard-00-01.gopwjrr.mongodb.net:27017,ac-prlpsz1-shard-00-02.gopwjrr.mongodb.net:27017/?ssl=true&replicaSet=atlas-c01uag-shard-0&authSource=admin&appName=Cluster0";

mongoose.connect(mongoURI)
  .then(() => console.log("Conectado ao MongoDB! 🍃"))
  .catch((err) => console.error("Erro ao conectar:", err));

app.get('/', (req, res) => {
  res.send('Servidor e Banco de Dados configurados!');
});


// Rota de Registro de Usuário
app.post('/api/auth/register', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    
    // Verifica se o usuário já existe
    const usuarioExiste = await User.findOne({ email });
    if (usuarioExiste) return res.status(400).json({ message: "E-mail já cadastrado." });

    const novoUsuario = new User({ nome, email, senha });
    await novoUsuario.save();

    res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao registrar usuário." });
  }
});

// Rota de Login de Usuário
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    // 1. Procura o usuário pelo e-mail
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "E-mail ou senha incorretos." });
    }

    // 2. Verifica se a senha bate (Comparação simples por enquanto)
    if (user.senha !== senha) {
      return res.status(400).json({ message: "E-mail ou senha incorretos." });
    }

    // 3. Se deu tudo certo, retorna os dados do usuário (menos a senha por segurança)
    res.status(200).json({
      message: "Login realizado com sucesso!",
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Erro ao realizar login." });
  }
});

// --- ROTA PARA CADASTRAR LIVRO (Create) ---
app.post('/api/books', async (req, res) => {
    try {
        const newBook = new Book(req.body); 
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({ message: "Erro ao cadastrar livro", error });
    }
});

// --- ROTA PARA LISTAR TODOS OS LIVROS (Read) ---
app.get('/api/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar livros", error });
    }
});

// --- ROTA PARA LISTAR LIVROS DO USUÁRIO LOGADO ---
app.get('/api/books/:userId', async (req, res) => {
    try {
        const { userId } = req.params; // Pegamos o ID que vem na URL
        const books = await Book.find({ userId: userId }); // Filtramos apenas por esse ID
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar seus livros", error });
    }
});

// --- ROTA PARA DELETAR LIVRO (Delete) ---
app.delete('/api/books/:id', async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.json({ message: "Livro removido da estante!" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao deletar", error });
    }
});

// --- ROTA PARA ATUALIZAR STATUS OU NOTA (Update) ---
app.put('/api/books/:id', async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar", error });
    }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});