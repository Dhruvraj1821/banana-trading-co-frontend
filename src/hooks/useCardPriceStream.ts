import { useEffect, useRef, useState } from "react";
import type { PriceUpdate } from "../types/api";

export interface PricePoint {
  time: string;
  price: number;
  event: "initial" | "trade" | "drift";
}

export function useCardPriceStream(cardId: string, initialPrice: number, maxPoints = 50) {
  const [history, setHistory] = useState<PricePoint[]>([
    { time: new Date().toLocaleTimeString(), price: initialPrice, event: "initial" },
  ]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const ws = new WebSocket(`ws://localhost:8000/ws/cards/${cardId}`);

    ws.onopen = () => {
      if (!cancelled) setConnected(true);
    };
    ws.onclose = () => {
      if (!cancelled) setConnected(false);
    };
    ws.onerror = () => {
      // swallow; onclose fires right after and handles state
    };

    ws.onmessage = (wsEvent) => {
      if (cancelled) return;
      const data: PriceUpdate = JSON.parse(wsEvent.data);
      if (data.event === "subscribed") return;

      const eventType: "trade" | "drift" = data.event;
      const price = data.price;

      setHistory((prev) => [
        ...prev.slice(-(maxPoints - 1)),
        { time: new Date().toLocaleTimeString(), price, event: eventType },
      ]);
    };

    return () => {
      cancelled = true;
      if (ws.readyState === WebSocket.CONNECTING) {
        // don't close a socket that hasn't finished opening yet, wait
        // for it to open, then close it immediately, this is what
        // avoids the "closed before connection established" error.
        ws.onopen = () => ws.close();
      } else {
        ws.close();
      }
    };
  }, [cardId, maxPoints]);

  const latestPrice = history[history.length - 1]?.price ?? initialPrice;

  return { history, latestPrice, connected };
}