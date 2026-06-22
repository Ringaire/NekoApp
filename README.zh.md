# NekoApp

<div align="center">

**Desktop GUI for NekoCLI — Tauri + React**

(Project in early stage. Version stays 0.x.x until first stable release. [Semantic Versioning 2.0](https://semver.org/))

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/Ringaire/NekoApp)
[![Rust](https://img.shields.io/badge/rust-1.85+-orange.svg)](https://www.rust-lang.org/)
[![License](https://img.shields.io/badge/license-AGPL--3.0-orange.svg)](LICENSE)

Desktop GUI for NekoCLI — spawns the AI coding assistant as a subprocess.

[Features](#features) • [Quick Start](#quick-start) • [Architecture](#architecture) • [Build](#build)

</div>

---

## Features

- 🖥️ **Native desktop app** — Tauri v2, cross-platform (Linux/macOS/Windows)
- 🤖 **NekoCLI subprocess** — spawns `neko sdk` mode, JSON-line protocol
- 🔌 **NekoRCA integration** — optional WebSocket connection to remote gateway
- 📋 **Chat interface** — shadcn/ui based message list and input
- 🌙 **Dark/Light theme** — follows system preference

## Prerequisites

- [NekoCLI](https://github.com/Ringaire/NekoCLI) installed and in `$PATH`
- Node.js 18+ + pnpm
- Rust toolchain (for Tauri)

## Quick Start

```bash
git clone https://github.com/Ringaire/NekoApp.git
cd NekoApp
pnpm install
pnpm tauri dev
```

## Architecture

```
NekoApp (Tauri)
  ├── React frontend (Vite + shadcn/ui)
  │     └── invoke("send_message")
  └── Tauri Rust backend
        └── spawn stdin/stdout
              └── neko sdk ──→ LLM Provider
```

### Protocol

Frontend calls Rust backend via Tauri IPC. Backend spawns `neko sdk` as subprocess with JSON-line protocol:

```json
// Input (React → Rust → neko stdin)
{"id":"uuid","type":"message","payload":"hello"}

// Output (neko stdout → Rust → React)
{"id":"uuid","type":"text","payload":"response"}
{"id":"uuid","type":"done","payload":""}
```

## Build

```bash
pnpm tauri build
pnpm build       # frontend only
```

## Related Projects

| Project | Description |
|---------|-------------|
| [NekoCLI](https://github.com/Ringaire/NekoCLI) | Terminal AI coding assistant |
| [NekoRCA](https://github.com/Ringaire/NekoRCA) | Remote Control Adapter gateway |

## License

[AGPL-3.0](LICENSE)
