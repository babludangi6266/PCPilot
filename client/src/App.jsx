import { useState, useRef, useEffect, useCallback } from 'react';
import './index.css';

const API_BASE = '/api';

// ── Suggested commands for the welcome screen ────────────────────────────
const SUGGESTIONS = [
  { icon: '💻', text: 'Show my drives' },
  { icon: '📁', text: 'List files in D:\\Projects' },
  { icon: '🔍', text: 'Find resume.pdf in C:\\Users' },
  { icon: '📄', text: 'Open the latest report in D:\\Work' },
  { icon: '🌐', text: 'Open Chrome' },
  { icon: '📝', text: 'Open Notepad' },
  { icon: '⚡', text: 'Open VS Code' },
  { icon: '📂', text: 'Open Downloads folder' },
];

// ── Status icons for tool steps ──────────────────────────────────────────
const STATUS_ICON = {
  running: '⏳',
  done: '✅',
  failed: '❌',
  pending: '🔄',
};

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking');

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // ── Scroll to bottom on new messages ─────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Check server health on mount ─────────────────────────────────────
  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  async function checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (res.ok) setServerStatus('online');
      else setServerStatus('offline');
    } catch {
      setServerStatus('offline');
    }
  }

  // ── Initialize speech recognition ────────────────────────────────────
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (e) => {
        const transcript = Array.from(e.results)
          .map(r => r[0].transcript)
          .join('');
        setInput(transcript);
      };

      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  // ── Toggle mic ───────────────────────────────────────────────────────
  function toggleMic() {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  }

  // ── Send command ─────────────────────────────────────────────────────
  const sendCommand = useCallback(async (commandText) => {
    const text = commandText || input.trim();
    if (!text || isLoading) return;

    // Stop listening if active
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    // Add user message
    const userMsg = {
      id: Date.now(),
      role: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/commands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.details || 'Something went wrong');
      }

      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        text: data.reply,
        steps: data.steps || [],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        text: `⚠️ Error: ${err.message}`,
        steps: [],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }, [input, isLoading, isListening]);

  // ── Handle key press ─────────────────────────────────────────────────
  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendCommand();
    }
  }

  // ── Auto-resize textarea ─────────────────────────────────────────────
  function handleInputChange(e) {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  }

  return (
    <div className="app">
      {/* ── Navbar ─────────────────────────────────────────────────── */}
      <nav className="navbar">
        <div className="navbar__brand">
          <div className="navbar__logo">P</div>
          <div>
            <div className="navbar__title">PCPilot</div>
            <div className="navbar__subtitle">AI PC Control Agent</div>
          </div>
        </div>

        <div className="navbar__status">
          <span className={`navbar__status-dot ${serverStatus !== 'online' ? 'navbar__status-dot--offline' : ''}`} />
          <span>
            {serverStatus === 'online' ? 'Agent Online' : serverStatus === 'checking' ? 'Connecting...' : 'Offline'}
          </span>
        </div>
      </nav>

      {/* ── Main Content ──────────────────────────────────────────── */}
      <main className="main">
        {/* Info bar */}
        <div className="info-bar">
          <div className="info-card">
            <span className="info-card__icon">🛡️</span>
            <span>Path Validation</span>
            <span className="info-card__value">Active</span>
          </div>
          <div className="info-card">
            <span className="info-card__icon">🔧</span>
            <span>Tools</span>
            <span className="info-card__value">7 loaded</span>
          </div>
          <div className="info-card">
            <span className="info-card__icon">📊</span>
            <span>Commands</span>
            <span className="info-card__value">{messages.filter(m => m.role === 'user').length}</span>
          </div>
        </div>

        {/* Chat area */}
        <div className="chat">
          <div className="chat__messages">
            {messages.length === 0 ? (
              <Welcome onSuggest={(text) => {
                setInput(text);
                sendCommand(text);
              }} />
            ) : (
              messages.map(msg => (
                <Message key={msg.id} message={msg} />
              ))
            )}

            {isLoading && (
              <div className="typing-indicator">
                <div className="typing-dots">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
                <span>PCPilot is thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="input-area">
            <button
              className={`input-area__btn input-area__btn--mic ${isListening ? 'active' : ''}`}
              onClick={toggleMic}
              title={isListening ? 'Stop listening' : 'Voice input'}
              type="button"
            >
              {isListening ? '🔴' : '🎙️'}
            </button>

            <textarea
              ref={inputRef}
              className="input-area__field"
              placeholder={isListening ? 'Listening...' : 'Ask PCPilot to control your PC...'}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={isLoading}
            />

            <button
              className="input-area__btn input-area__btn--send"
              onClick={() => sendCommand()}
              disabled={!input.trim() || isLoading}
              title="Send command"
              type="button"
            >
              {isLoading ? '⏳' : '➤'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// ── Welcome Component ────────────────────────────────────────────────────
function Welcome({ onSuggest }) {
  return (
    <div className="welcome">
      <div className="welcome__icon">🚀</div>
      <h1 className="welcome__title">Welcome to PCPilot</h1>
      <p className="welcome__text">
        Control your PC with natural language. Browse files, open apps, 
        search documents — just tell me what you need.
      </p>
      <div className="welcome__chips">
        {SUGGESTIONS.map((s, i) => (
          <button
            key={i}
            className="welcome__chip"
            onClick={() => onSuggest(s.text)}
          >
            <span className="welcome__chip-icon">{s.icon}</span>
            {s.text}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Message Component ────────────────────────────────────────────────────
function Message({ message }) {
  const { role, text, steps, time, isError } = message;

  return (
    <div className={`message message--${role}`}>
      <div className="message__avatar">
        {role === 'user' ? '👤' : '🤖'}
      </div>
      <div className="message__content">
        <div
          className="message__bubble"
          style={isError ? { borderColor: 'var(--accent-red)', borderWidth: '1px', borderStyle: 'solid' } : {}}
        >
          {text}
        </div>

        {steps && steps.length > 0 && (
          <div className="steps">
            {steps.map((step, i) => (
              <div key={i} className={`step step--${step.status}`}>
                <span className="step__icon">{STATUS_ICON[step.status] || '⏳'}</span>
                <div className="step__info">
                  <span className="step__name">{step.tool}</span>
                  <span className="step__args">
                    {JSON.stringify(step.args).slice(0, 100)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <span className="message__time">{time}</span>
      </div>
    </div>
  );
}

export default App;
