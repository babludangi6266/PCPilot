const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { PORT, ALLOWED_ORIGINS, NODE_ENV } = require('./config/env');
const { connectDB } = require('./config/db');
const commandsRouter = require('./routes/commands');

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────
app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

// ── Health check ─────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'PCPilot Server',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ── Routes ───────────────────────────────────────────────────────────────
app.use('/api/commands', commandsRouter);

// ── Error handler ────────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

// ── Start server ─────────────────────────────────────────────────────────
async function start() {
  // Try to connect to MongoDB (non-blocking — works without it in MVP)
  await connectDB();

  app.listen(PORT, () => {
    console.log('');
    console.log('  ╔══════════════════════════════════════════╗');
    console.log('  ║         🚀 PCPilot Server Running        ║');
    console.log('  ╠══════════════════════════════════════════╣');
    console.log(`  ║  Port:    ${PORT}                            ║`);
    console.log(`  ║  Mode:    ${NODE_ENV.padEnd(28)}║`);
    console.log(`  ║  API:     http://localhost:${PORT}/api        ║`);
    console.log('  ╚══════════════════════════════════════════╝');
    console.log('');
  });
}

start().catch(console.error);

module.exports = app;
