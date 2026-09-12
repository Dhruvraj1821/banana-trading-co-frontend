import { useEffect, useRef, useState } from "react";
import type { PriceUpdate } from "../types/api";

export interface PricePoint {
  time: string;
  price: number;
  event: "initial" | "trade" | "drift";
}

export function useCardPriceStream(cardId: string, initialPrice: number) {
  const [history, setHistory] = useState<PricePoint[]>([
    { time: new Date().toLocaleTimeString(), price: initialPrice, event: "initial" },
  ]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl = `ws://localhost:8000/ws/cards/${cardId}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);

    ws.onmessage = (wsEvent) => {
      const data: PriceUpdate = JSON.parse(wsEvent.data);
      if (data.event === "subscribed") return;

      const eventType: "trade" | "drift" = data.event;
      const price = data.price;

      setHistory((prev) => [
        ...prev.slice(-49),
        { time: new Date().toLocaleTimeString(), price, event: eventType },
      ]);
    };

    return () => {
      ws.close();
    };
  }, [cardId]);

  const latestPrice = history[history.length - 1]?.price ?? initialPrice;

  return { history, latestPrice, connected };
}