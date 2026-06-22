# NekoApp

[NekoCLI](https://github.com/Ringaire/NekoCLI) 的桌面图形界面——AI 编程助手。

基于 [Tauri](https://tauri.app) v2 + React + TypeScript + [shadcn/ui](https://ui.shadcn.com) 构建。

## 功能

- 🖥️ 原生桌面应用（Linux/macOS/Windows）
- 🤖 以子进程方式运行 NekoCLI，提供 AI 对话能力
- 🔌 通过 WebSocket 连接 NekoRCA 实现远程控制
- 📋 聊天界面，支持消息历史
- ⚡ 实时流式响应
- 🌙 深色/浅色主题支持

## 前置要求

- 已安装 [NekoCLI](https://github.com/Ringaire/NekoCLI) 并在 `$PATH` 中
- Node.js 18+ + pnpm
- Rust 工具链（用于 Tauri）

## 开发

```bash
pnpm install
pnpm tauri dev
```

## 构建

```bash
pnpm tauri build
```

## 架构

```
NekoApp (Tauri)
  ├── React 前端 ──invoke──→ Tauri Rust 后端
  │                                │
  │                        spawn neko sdk（子进程）
  │                                │
  │                         ┌──────┴──────┐
  │                         │  Ollama API  │
  │                         │ 或其他 LLM    │
  │                         └─────────────┘
  │
  └── 可选：WS ──→ NekoRCA（远程网关）
```

## 许可证

AGPL-3.0
