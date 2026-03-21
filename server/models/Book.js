const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    pages: Number,
    status: { 
        type: String, 
        enum: ['Quero Ler', 'Lendo', 'Lido'], 
        default: 'Quero Ler' 
    },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    coverUrl: String // Para colocarmos o link de uma imagem da capa depois!
});

module.exports = mongoose.model('Book', BookSchema);