import { Button } from "../ui/button"
import { ChevronDown, Settings } from "lucide-react"

interface HeaderProps {
  model?: string
  onSettings?: () => void
}

export function Header({ model, onSettings }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b px-4 py-2">
      <div className="flex items-center gap-2">
        <div className="flex size-6 items-center justify-center rounded-md bg-primary text-[10px] font-bold text-primary-foreground">
          N
        </div>
        {model && (
          <Button variant="ghost" size="sm" className="gap-1 text-xs font-normal">
            {model}
            <ChevronDown className="size-3" />
          </Button>
        )}
      </div>
      <Button variant="ghost" size="icon" className="size-7" onClick={onSettings}>
        <Settings className="size-4" />
      </Button>
    </header>
  )
}
