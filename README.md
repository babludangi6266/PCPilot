<p align="center">
  <img src="https://img.shields.io/badge/PCPilot-AI%20PC%20Control-blue?style=for-the-badge&logo=rocket&logoColor=white" alt="PCPilot Badge" />
</p>

<h1 align="center">🚀 PCPilot</h1>
<h3 align="center">AI-Powered PC Control Agent</h3>

<p align="center">
  <em>Control your Windows PC with natural language — browse files, open apps, search documents, and more.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Gemini%20AI-8E75B2?style=flat-square&logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/Socket.IO-010101?style=flat-square&logo=socketdotio&logoColor=white" alt="Socket.IO" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License" />
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/babludangi6266/PCPilot?style=social" alt="Stars" />
  <img src="https://img.shields.io/github/forks/babludangi6266/PCPilot?style=social" alt="Forks" />
  <img src="https://img.shields.io/github/issues/babludangi6266/PCPilot?style=flat-square" alt="Issues" />
</p>

---

## 📖 Overview

**PCPilot** is an intelligent PC control agent that lets you manage your Windows computer using natural language commands — either typed or spoken. It combines the power of **Google Gemini AI** (function calling) with a local agent running on your PC to safely execute file operations, launch applications, and navigate your system.

> **Think of it as a smart assistant that actually _does_ things on your PC — not just talks about them.**

### 🎯 The Problem
Websites and web apps are sandboxed — they **cannot** touch your local files, open applications, or browse your PC's file system. PCPilot bridges this gap with a secure local agent architecture.

### 💡 The Solution
A **MERN-stack dashboard** connected to a **local Node.js agent** via WebSocket, with **Gemini AI** deciding _what_ to do and your agent _executing_ it — all with path validation, audit logging, and approval workflows.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🗣️ **Natural Language Control** | Type or speak commands in plain English (or Hinglish!) |
| 📁 **File Navigation** | Browse directories, search files, read text files |
| 🚀 **App Launcher** | Open Chrome, VS Code, Notepad, and 15+ apps by name |
| 🔒 **Path Security** | Allowed-folder validation blocks system path access |
| 🎙️ **Voice Input** | Built-in Web Speech API integration — just talk |
| 📊 **Live Progress** | See each AI tool call execute in real-time |
| 🛡️ **Audit Logging** | Every action is logged for transparency |
| 🎨 **Premium Dark UI** | Glassmorphic dashboard with smooth animations |
| 🤖 **Gemini Function Calling** | AI decides _which_ tool to use and _when_ |
| 💾 **MongoDB Storage** | Command history, user auth, device management |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   React Dashboard (Browser/Phone)                               │
│   ├── Chat Interface (text + voice)                             │
│   ├── Live Tool Execution Progress                              │
│   └── Command History & Audit Logs                              │
│         │                                                       │
│         │  HTTP / WebSocket                                     │
│         ▼                                                       │
│   Express + Node.js Backend                                     │
│   ├── REST API (commands, auth, devices)                        │
│   ├── Gemini AI Orchestrator (function calling loop)            │
│   ├── Socket.IO Hub (real-time communication)                   │
│   └── MongoDB (users, devices, commands, audit logs)            │
│         │                                                       │
│         │  Gemini API                                           │
│         ▼                                                       │
│   Google Gemini 3.8 Flash                                       │
│   └── Understands command → returns function calls              │
│         │                                                       │
│         │  Tool Execution                                       │
│         ▼                                                       │
│   Local PC Agent (Node.js)                                      │
│   ├── get_drives, list_directory, open_file                     │
│   ├── search_files, read_text_file, open_app                   │
│   ├── open_folder                                               │
│   └── Security: path validation, blocked paths                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express.js** | REST API framework |
| **Socket.IO** | Real-time WebSocket communication |
| **Mongoose** | MongoDB ODM |
| **JWT + bcrypt** | Authentication & security |
| **Zod** | Request validation |
| **Morgan** | HTTP request logging |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite** | Build tool & dev server |
| **Web Speech API** | Browser-native voice input (free) |
| **Socket.IO Client** | Real-time updates |
| **Lucide React** | Icon library |

### AI & Agent
| Technology | Purpose |
|---|---|
| **Google Gemini 3.8 Flash** | LLM with function calling |
| **@google/genai** | Official Google AI SDK |
| **open** (npm) | Opens files in default apps |
| **child_process** | System command execution |
| **fs** | File system operations |

### Database
| Technology | Purpose |
|---|---|
| **MongoDB** | Primary database |
| **MongoDB Atlas** | Cloud hosting (free tier) |

---

## 📂 Project Structure

```
PCPilot/
├── server/                          # Express.js Backend
│   ├── .env                         # Environment variables
│   ├── package.json
│   └── src/
│       ├── index.js                 # Server entry point
│       ├── config/
│       │   ├── env.js               # Environment config loader
│       │   └── db.js                # MongoDB connection
│       ├── models/
│       │   ├── User.js              # User schema
│       │   ├── Device.js            # Device schema
│       │   ├── Command.js           # Command + steps schema
│       │   └── AuditLog.js          # Audit trail schema
│       ├── routes/
│       │   └── commands.js          # /api/commands endpoints
│       ├── services/
│       │   ├── gemini.js            # Gemini AI + tool declarations
│       │   └── orchestrator.js      # Command execution loop
│       ├── sockets/                 # Socket.IO handlers (Phase 2)
│       └── middleware/              # Auth, rate limiting (Phase 2)
│
├── client/                          # React Frontend (Vite)
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx                 # React entry point
│       ├── App.jsx                  # Main app component
│       └── index.css                # Complete design system
│
└── agent/                           # Local PC Agent
    ├── package.json
    └── src/
        ├── tools/
        │   └── index.js             # All 7 tool implementations
        └── security/
            └── allowedPaths.js      # Path validation & blocking
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ installed
- **MongoDB** running locally (or use MongoDB Atlas)
- **Google AI Studio** API key ([Get one free](https://aistudio.google.com/apikey))
- **Git** installed

### 1. Clone the Repository

```bash
git clone https://github.com/babludangi6266/PCPilot.git
cd PCPilot
```

### 2. Setup the Server

```bash
cd server
npm install
```

Create your `.env` file:

```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=mongodb://localhost:27017/pcpilot
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173
```

> ⚠️ **Important:** Replace `your_gemini_api_key_here` with your actual API key from [Google AI Studio](https://aistudio.google.com/apikey).

### 3. Setup the Client

```bash
cd ../client
npm install
```

### 4. Setup the Agent

```bash
cd ../agent
npm install
```

### 5. Run the Application

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

Visit `http://localhost:5173` in your browser. 🎉

---

## 🔧 Available Tools (Phase 1)

These are the AI-accessible tools that Gemini can invoke:

| Tool | Description | Example Command |
|---|---|---|
| `get_drives` | Lists all drive letters (C:, D:, etc.) | *"Show my drives"* |
| `list_directory` | Lists files & folders in a path | *"What's in D:\Projects?"* |
| `open_file` | Opens a file in its default app | *"Open resume.pdf"* |
| `open_folder` | Opens a folder in File Explorer | *"Open my Downloads folder"* |
| `search_files` | Searches for files by name | *"Find invoice.xlsx in D:\Work"* |
| `read_text_file` | Reads content of text files | *"Read the README in my project"* |
| `open_app` | Launches an application | *"Open Chrome"* |

### Supported Applications

```
chrome · firefox · edge · notepad · vscode · calculator
explorer · cmd · powershell · paint · wordpad · spotify
task manager · control panel · settings · snipping tool
```

---

## 🔒 Security

PCPilot takes security seriously. Here's how your system is protected:

### Path Validation
- ✅ All paths are resolved with `path.resolve()` to prevent `../../` traversal attacks
- ✅ Paths are checked against an **allowed-folders whitelist**
- ✅ System paths are **blocked by default:**

```
C:\Windows, C:\Program Files, C:\Program Files (x86),
C:\ProgramData, C:\$Recycle.Bin
```

### Blocked Path Components
```
.ssh, .env, .git, .aws, .azure, AppData,
cookies, login data, passwords, credential
```

### Additional Security
- 🔐 **Gemini API key** stays on the server only — never exposed to client or agent
- 🛡️ **JWT authentication** for user sessions
- 📝 **Full audit log** of every tool call with args and results
- ⏱️ **Max 8 steps per command** to prevent runaway loops
- 🚫 **No raw shell access** — only whitelisted operations
- 🔍 **File contents are untrusted** — text from files never triggers actions

---

## 📡 API Reference

### Health Check
```
GET /api/health
```
```json
{
  "status": "ok",
  "service": "PCPilot Server",
  "timestamp": "2026-09-30T06:00:00.000Z",
  "uptime": 1234.56
}
```

### Execute Command
```
POST /api/commands
Content-Type: application/json

{
  "message": "Show me what's in D:\\Projects"
}
```
```json
{
  "reply": "Here are the contents of D:\\Projects:\n...",
  "steps": [
    {
      "index": 1,
      "tool": "list_directory",
      "args": { "path": "D:\\Projects" },
      "status": "done",
      "result": { "items": [...] }
    }
  ],
  "timestamp": "2026-09-30T06:00:00.000Z"
}
```

### List Available Tools
```
GET /api/commands/tools
```

---

## 🗄️ Database Schemas

### User
```javascript
{
  email: String,         // unique, lowercase
  passwordHash: String,
  createdAt: Date
}
```

### Device
```javascript
{
  userId: ObjectId,
  name: String,
  deviceToken: String,   // hashed
  status: 'online' | 'offline',
  lastSeen: Date,
  allowedFolders: [String]
}
```

### Command
```javascript
{
  userId: ObjectId,
  deviceId: ObjectId,
  inputText: String,
  status: 'pending' | 'running' | 'done' | 'failed',
  steps: [{
    tool: String,
    args: Mixed,
    result: Mixed,
    status: String,
    timestamp: Date
  }],
  finalReply: String,
  createdAt: Date
}
```

### AuditLog
```javascript
{
  deviceId: ObjectId,
  commandId: ObjectId,
  tool: String,
  args: Mixed,
  result: Mixed,
  status: 'success' | 'failed' | 'denied',
  approvedBy: String,
  timestamp: Date
}
```

---

## 🗺️ Roadmap

### ✅ Phase 1 — Local MVP (Current)
- [x] Express + Gemini function calling loop
- [x] 7 safe, read/open tools
- [x] Path validation & security
- [x] Premium React dashboard with voice input
- [x] MongoDB integration
- [x] Live tool execution progress

### 🔄 Phase 2 — Socket.IO Split
- [ ] Separate server ↔ agent via WebSocket
- [ ] Device pairing with one-time codes
- [ ] Online/offline status with heartbeat
- [ ] Multiple device support

### 🔮 Phase 3 — Advanced Features
- [ ] Approval modal for risky operations (delete, move, write)
- [ ] Create, move, copy, delete files (recycle bin)
- [ ] Write text files
- [ ] Full audit log UI

### 🚀 Phase 4 — Power Features
- [ ] Screenshot capture
- [ ] GUI automation (click, type)
- [ ] Whitelisted shell commands
- [ ] Electron tray app + Windows auto-start
- [ ] Multi-device dashboard

---

## ⚡ How It Works

Here's what happens when you say **"Open the invoice file in D:\Work"**:

```
1. 🗣️  You type or speak the command in the React dashboard
2. 📤  Frontend sends POST /api/commands with the message
3. 🤖  Server sends the command to Gemini with tool declarations
4. 🔍  Gemini returns: list_directory({ path: "D:\\Work" })
5. 📂  Agent validates the path and lists the directory
6. 📋  Results sent back to Gemini as a functionResponse
7. 📄  Gemini finds the invoice and calls: open_file({ path: "D:\\Work\\invoice_march.pdf" })
8. ✅  Agent validates and opens the file in the default PDF reader
9. 💬  Gemini returns: "Opened invoice_march.pdf for you!"
10. 📝  Every step is logged in the audit trail
```

---

## 🎙️ Voice Commands

PCPilot supports voice input using the **Web Speech API** (Chrome/Edge):

- Click the **🎙️ mic button** and speak naturally
- Works with English and Hinglish commands
- Real-time speech-to-text transcription
- Press again to stop and send

**Example voice commands:**
- *"Show me what's on the D drive"*
- *"Find my resume PDF"*
- *"Open VS Code"*
- *"Meri D drive me kya hai?"* (Hinglish)

---

## 🐛 Troubleshooting

| Problem | Solution |
|---|---|
| `GEMINI_API_KEY` error | Make sure your `.env` file has a valid API key from [Google AI Studio](https://aistudio.google.com/apikey) |
| MongoDB connection fails | Server works without MongoDB — auth and history will be disabled |
| "Access denied" on paths | Check the allowed folders in `agent/src/security/allowedPaths.js` |
| Voice not working | Use Chrome or Edge — Firefox doesn't support Web Speech API |
| Port already in use | Change `PORT` in `.env` or kill the process using the port |
| Model not found error | Check `server/src/services/gemini.js` — update `MODEL_NAME` to the latest available model |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Bablu Dangi**

- GitHub: [@babludangi6266](https://github.com/babludangi6266)

---

<p align="center">
  <strong>⭐ If you found this project useful, give it a star! ⭐</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge" alt="Made with Love" />
  <img src="https://img.shields.io/badge/Powered%20by-Gemini%20AI-blue?style=for-the-badge&logo=google&logoColor=white" alt="Powered by Gemini" />
</p>
