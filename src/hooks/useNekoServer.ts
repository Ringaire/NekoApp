import { useState, useRef, useCallback, useEffect } from "react"

type Status = "disconnected" | "connecting" | "connected" | "error"

interface UseNekoServerOptions {
  serverUrl?: string
  onMessage?: (text: string) => void
}

export function useNekoServer(opts: UseNekoServerOptions = {}) {
  const [status, setStatus] = useState<Status>("disconnected")
  const [error, setError] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const serverUrl = opts.serverUrl ?? "http://localhost:9090"

  const connect = useCallback(async () => {
    setStatus("connecting")
    setError(null)

    try {
      // 1. Create session
      const res = await fetch(`${serverUrl}/v1/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      })
      if (!res.ok) throw new Error(`session creation failed: ${res.status}`)
      const { session_id } = await res.json()

      // 2. Open WebSocket
      const wsUrl = serverUrl.replace(/^http/, "ws") + `/v1/sessions/${session_id}/ws`
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => setStatus("connected")

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === "echo" && data.payload) {
            opts.onMessage?.(data.payload)
          }
        } catch { /* ignore parse errors */ }
      }

      ws.onerror = () => {
        setError("WebSocket error")
        setStatus("error")
      }

      ws.onclose = () => {
        setStatus("disconnected")
        wsRef.current = null
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "connection failed")
      setStatus("error")
    }
  }, [serverUrl, opts.onMessage])

  const send = useCallback((text: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        id: crypto.randomUUID(),
        type: "message",
        payload: text,
        timestamp: Date.now(),
      }))
    }
  }, [])

  const disconnect = useCallback(() => {
    wsRef.current?.close()
    wsRef.current = null
    setStatus("disconnected")
  }, [])

  useEffect(() => {
    return () => {
      wsRef.current?.close()
    }
  }, [])

  return { status, error, connect, send, disconnect }
}
