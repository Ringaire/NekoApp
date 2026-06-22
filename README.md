# NekoApp

Desktop GUI for [NekoCLI](https://github.com/Ringaire/NekoCLI) — an AI coding assistant.

Built with [Tauri](https://tauri.app) v2 + React + TypeScript + [shadcn/ui](https://ui.shadcn.com).

## Features

- 🖥️ Native desktop app (Linux/macOS/Windows)
- 🤖 Spawns NekoCLI as a subprocess for AI conversations
- 🔌 Connects to NekoRCA for remote control via WebSocket
- 📋 Chat interface with message history
- ⚡ Real-time streaming responses
- 🌙 Dark/light theme support

## Prerequisites

- [NekoCLI](https://github.com/Ringaire/NekoCLI) installed and in `$PATH`
- Node.js 18+ + pnpm
- Rust toolchain (for Tauri)

## Development

```bash
pnpm install
pnpm tauri dev
```

## Build

```bash
pnpm tauri build
```

## Architecture

```
NekoApp (Tauri)
  ├── React frontend ──invoke──→ Tauri Rust backend
  │                                   │
  │                           spawn neko sdk (subprocess)
  │                                   │
  │                            ┌──────┴──────┐
  │                            │  Ollama API  │
  │                            │ 或其他 LLM    │
  │                            └─────────────┘
  │
  └── Optional: WS ──→ NekoRCA (remote gateway)
```

## License

AGPL-3.0
