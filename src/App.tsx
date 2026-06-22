import { useState, useCallback, useEffect } from "react"
import "./App.css"
import { Sidebar } from "./components/layout/Sidebar"
import { Header } from "./components/layout/Header"
import { ChatView } from "./components/chat/ChatView"
import { Button } from "./components/ui/button"
import { useNekoClient } from "./hooks/useNekoClient"
import type { Message } from "./components/chat/types"

interface Session {
  id: string
  title: string
  updatedAt: number
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "system",
      content: "Neko Desktop — connect to start chatting",
      timestamp: Date.now(),
    },
  ])
  const [loading, setLoading] = useState(false)
  const [sessions] = useState<Session[]>([
    { id: "1", title: "Chat 1", updatedAt: Date.now() },
  ])
  const [activeSession] = useState("1")
  const { status, error: connError, start, send } = useNekoClient()

  useEffect(() => {
    if (status === "idle") start()
  }, [status, start])

  const handleSend = useCallback(async (text: string) => {
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const reply = await send(text)
      const msg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: reply,
        timestamp: Date.now(),
      }
      setMessages(prev => [...prev, msg])
    } catch (e) {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: "system",
        content: `Error: ${e}`,
        timestamp: Date.now(),
      }])
    }
    setLoading(false)
  }, [send])

  return (
    <div className="flex h-dvh">
      <Sidebar
        sessions={sessions}
        activeSession={activeSession}
        onSelect={() => {}}
        onNew={() => {}}
        rcaConnected={status === "ready"}
      />
      <div className="flex flex-1 flex-col">
        <Header model={status === "ready" ? "neko sdk" : undefined} />
        {(status === "error") && (
          <div className="flex items-center justify-center gap-2 border-b bg-destructive/10 px-4 py-2 text-sm text-destructive">
            <span>Failed to start Neko: {connError}</span>
            <Button variant="outline" size="sm" onClick={start}>Retry</Button>
          </div>
        )}
        <ChatView
          messages={messages}
          onSend={handleSend}
          loading={loading}
          rcaConnected={status === "ready"}
        />
      </div>
    </div>
  )
}

export default App
