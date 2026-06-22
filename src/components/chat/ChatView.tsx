import { useRef, useEffect } from "react"
import { MessageBubble } from "./MessageBubble"
import { ChatInput } from "./ChatInput"
import type { Message } from "./types"

interface ChatViewProps {
  messages: Message[]
  onSend: (text: string) => void
  loading?: boolean
  rcaConnected?: boolean
  model?: string
}

export function ChatView({ messages, onSend, loading, rcaConnected, model }: ChatViewProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-4 p-4">
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-block size-1.5 animate-bounce rounded-full bg-current" />
              <span className="animation-delay-150 inline-block size-1.5 animate-bounce rounded-full bg-current" />
              <span className="animation-delay-300 inline-block size-1.5 animate-bounce rounded-full bg-current" />
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>
      <ChatInput onSend={onSend} disabled={loading} rcaConnected={rcaConnected} placeholder={model ? `Message ${model}...` : undefined} />
    </div>
  )
}
