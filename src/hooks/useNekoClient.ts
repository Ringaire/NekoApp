import { useState, useCallback, useEffect } from "react"
import { invoke } from "@tauri-apps/api/core"

type Status = "idle" | "starting" | "ready" | "error"

export function useNekoClient() {
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState<string | null>(null)

  const start = useCallback(async () => {
    setStatus("starting")
    setError(null)
    try {
      await invoke("start_neko")
      setStatus("ready")
    } catch (e) {
      setError(String(e))
      setStatus("error")
    }
  }, [])

  const send = useCallback(async (text: string): Promise<string> => {
    return await invoke("send_message", { text })
  }, [])

  const stop = useCallback(async () => {
    try {
      await invoke("stop_neko")
    } catch { /* ignore */ }
    setStatus("idle")
  }, [])

  useEffect(() => {
    return () => { stop() }
  }, [])

  return { status, error, start, send, stop }
}
