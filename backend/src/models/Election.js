const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
  resultsPublished: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

electionSchema.methods.getStatus = function() {
  const now = new Date();
  const start = new Date(this.startDate);
  const end = new Date(this.endDate);

  if (!this.isActive) {
    return 'inactive';
  }

  if (now < start) {
    return 'upcoming';
  } else if (now > end) {
    return 'ended';
  } else {
    return 'active';
  }
};

module.exports = mongoose.model('Election', electionSchema);