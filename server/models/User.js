const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // unique impede emails duplicados
  senha: { type: String, required: true },
  dataCriacao: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);