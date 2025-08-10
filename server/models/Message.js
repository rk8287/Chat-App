const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  text: { type: String, required: true },
direction: { type: String, enum: ['in', 'out'], required: false },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, default: 'sent' }
});


module.exports = mongoose.model('Message', MessageSchema);
