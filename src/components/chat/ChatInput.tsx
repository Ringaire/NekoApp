import { useState, useRef, useEffect } from "react"
import { Button } from "../ui/button"
import { ArrowUp, Wifi, WifiOff } from "lucide-react"

interface ChatInputProps {
  onSend: (text: string) => void
  disabled?: boolean
  rcaConnected?: boolean
  placeholder?: string
}

export function ChatInput({ onSend, disabled, rcaConnected, placeholder }: ChatInputProps) {
  const [text, setText] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [text])

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!text.trim()) return
    onSend(text.trim())
    setText("")
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="border-t bg-background p-3">
      <form onSubmit={handleSubmit} className="mx-auto flex max-w-3xl items-end gap-2 rounded-xl border bg-muted/50 p-2 focus-within:border-ring">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? "Message Neko..."}
          disabled={disabled}
          rows={1}
          className="max-h-[200px] flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
        />
        <Button
          type="submit"
          size="icon"
          disabled={disabled || !text.trim()}
          className="size-8 shrink-0 rounded-full"
        >
          <ArrowUp className="size-4" />
        </Button>
      </form>
      <div className="mt-1 flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
        {rcaConnected ? (
          <Wifi className="size-2.5 text-green-500" />
        ) : (
          <WifiOff className="size-2.5" />
        )}
        <span>{rcaConnected ? "RCA connected" : "RCA disconnected"}</span>
      </div>
    </div>
  )
}
