const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dob: { type: Date, required: true },
  idDocument: { type: String, required: true },
  role: { type: String, enum: ['voter', 'admin'], default: 'voter' },
  isVerified: { type: Boolean, default: false },
  walletAddress: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);