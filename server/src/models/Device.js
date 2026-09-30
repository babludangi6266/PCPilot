const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  deviceToken: { type: String, required: true },
  status: { type: String, enum: ['online', 'offline'], default: 'offline' },
  lastSeen: { type: Date, default: Date.now },
  allowedFolders: [{ type: String }],
});

deviceSchema.index({ userId: 1 });
deviceSchema.index({ deviceToken: 1 });

module.exports = mongoose.model('Device', deviceSchema);
