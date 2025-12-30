const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  party: { type: String, required: true },
  manifesto: { type: String },
  photo: { type: String },
  electionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Election', required: true },
  candidateId: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Candidate', candidateSchema);