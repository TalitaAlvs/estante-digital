const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  coverUrl: { type: String },
  status: { 
    type: String, 
    enum: ['Quero Ler', 'Lendo', 'Lido', 'Abandonado'], 
    default: 'Quero Ler' 
  },
  // Referência ao ID do Usuário
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
});

module.exports = mongoose.model('Book', BookSchema);