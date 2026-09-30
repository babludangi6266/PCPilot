const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
  commandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Command' },
  tool: { type: String, required: true },
  args: mongoose.Schema.Types.Mixed,
  result: mongoose.Schema.Types.Mixed,
  status: { type: String, enum: ['success', 'failed', 'denied'] },
  approvedBy: String,
  timestamp: { type: Date, default: Date.now },
});

auditLogSchema.index({ deviceId: 1, timestamp: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
