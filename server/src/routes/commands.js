const express = require('express');
const { executeCommand } = require('../services/orchestrator');

const router = express.Router();

/**
 * POST /api/commands
 * Body: { message: string }
 * Response: { reply: string, steps: array }
 */
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    if (message.length > 2000) {
      return res.status(400).json({ error: 'Message too long (max 2000 chars).' });
    }

    const steps = [];

    const result = await executeCommand(message.trim(), (event) => {
      // In future: stream these via SSE or WebSocket
      if (event.type === 'tool_call' || event.type === 'tool_result' || event.type === 'tool_error') {
        steps.push(event.step);
      }
    });

    res.json({
      reply: result.reply,
      steps: result.steps,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Command error:', err);
    res.status(500).json({
      error: 'Failed to process command.',
      details: err.message,
    });
  }
});

/**
 * GET /api/commands/tools
 * Returns list of available tools (for the UI)
 */
router.get('/tools', (req, res) => {
  const { toolDeclarations } = require('../services/gemini');
  res.json({
    tools: toolDeclarations.map(t => ({
      name: t.name,
      description: t.description,
    })),
  });
});

module.exports = router;
