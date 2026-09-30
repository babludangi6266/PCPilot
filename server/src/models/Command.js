const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
  tool: String,
  args: mongoose.Schema.Types.Mixed,
  result: mongoose.Schema.Types.Mixed,
  status: { type: String, enum: ['pending', 'running', 'done', 'failed', 'denied'] },
  timestamp: { type: Date, default: Date.now },
}, { _id: false });

const commandSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
  inputText: { type: String, required: true },
  status: { type: String, enum: ['pending', 'running', 'done', 'failed'], default: 'pending' },
  steps: [stepSchema],
  finalReply: String,
  createdAt: { type: Date, default: Date.now },
});

commandSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Command', commandSchema);
