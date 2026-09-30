const { createChat, sendMessage, sendFunctionResult } = require('./gemini');
const { executeTool } = require('../../../agent/src/tools/index');

const MAX_STEPS = 8;

/**
 * Orchestrates a full command execution loop:
 * 1. Send user message to Gemini
 * 2. If Gemini returns function calls, execute them locally
 * 3. Send results back to Gemini
 * 4. Repeat until Gemini returns text or max steps reached
 *
 * @param {string} userMessage - The user's command
 * @param {function} onStep - Callback for each step (for real-time UI updates)
 * @returns {object} { reply, steps }
 */
async function executeCommand(userMessage, onStep = () => {}) {
  const chat = createChat();
  const steps = [];
  let stepCount = 0;

  // Send initial user message
  let response = await sendMessage(chat, userMessage);

  while (stepCount < MAX_STEPS) {
    // Check if the response has function calls
    const functionCalls = response.functionCalls;

    if (!functionCalls || functionCalls.length === 0) {
      // No function calls — Gemini returned final text
      break;
    }

    for (const fc of functionCalls) {
      stepCount++;
      const step = {
        index: stepCount,
        tool: fc.name,
        args: fc.args || {},
        status: 'running',
        result: null,
        timestamp: new Date().toISOString(),
      };

      onStep({ type: 'tool_call', step });

      try {
        // Execute the tool locally
        const result = await executeTool(fc.name, fc.args || {});
        step.result = result;
        step.status = 'done';

        onStep({ type: 'tool_result', step });

        // Send result back to Gemini
        response = await sendFunctionResult(chat, fc.name, result);
      } catch (err) {
        step.result = { error: err.message };
        step.status = 'failed';

        onStep({ type: 'tool_error', step });

        // Send error back to Gemini so it can handle gracefully
        response = await sendFunctionResult(chat, fc.name, {
          error: err.message,
        });
      }

      steps.push(step);

      if (stepCount >= MAX_STEPS) {
        break;
      }
    }
  }

  // Extract final text reply
  const reply = response.text || 'Command completed.';

  onStep({ type: 'final_reply', reply });

  return { reply, steps };
}

module.exports = { executeCommand };
