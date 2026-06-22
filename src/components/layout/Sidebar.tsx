import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import { ScrollArea } from "../ui/scroll-area"
import {
  MessageSquarePlus,
  Settings,
  History,
  Wifi,
  WifiOff,
} from "lucide-react"

interface Session {
  id: string
  title: string
  updatedAt: number
}

interface SidebarProps {
  sessions: Session[]
  activeSession?: string
  onSelect: (id: string) => void
  onNew: () => void
  rcaConnected?: boolean
}

export function Sidebar({
  sessions,
  activeSession,
  onSelect,
  onNew,
  rcaConnected,
}: SidebarProps) {
  return (
    <aside className="flex w-64 flex-col border-r bg-sidebar">
      <div className="flex items-center justify-between p-3">
        <span className="text-sm font-semibold">Neko</span>
        <Button variant="ghost" size="icon" onClick={onNew}>
          <MessageSquarePlus className="size-4" />
        </Button>
      </div>
      <Separator />
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {sessions.map(s => (
            <Button
              key={s.id}
              variant={s.id === activeSession ? "secondary" : "ghost"}
              className="w-full justify-start text-left text-sm"
              onClick={() => onSelect(s.id)}
            >
              <History className="mr-2 size-3.5 shrink-0" />
              <span className="truncate">{s.title}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
      <Separator />
      <div className="flex items-center gap-2 p-3 text-xs text-muted-foreground">
        {rcaConnected ? (
          <Wifi className="size-3 text-green-500" />
        ) : (
          <WifiOff className="size-3" />
        )}
        <span>{rcaConnected ? "Connected" : "Disconnected"}</span>
        <Button variant="ghost" size="icon" className="ml-auto size-6">
          <Settings className="size-3.5" />
        </Button>
      </div>
    </aside>
  )
}
