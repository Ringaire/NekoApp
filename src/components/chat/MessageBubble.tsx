import { cn } from "../../lib/utils"
import type { Message } from "./types"

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user"
  const isSystem = message.role === "system"

  return (
    <div
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser && "bg-primary text-primary-foreground",
          isAssistant(message) && "bg-muted text-foreground",
          isSystem && "w-full bg-transparent text-muted-foreground text-xs text-center italic",
        )}
      >
        {message.content}
      </div>
    </div>
  )
}

function isAssistant(msg: Message) {
  return msg.role === "assistant"
}
