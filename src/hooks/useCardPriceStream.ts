import { useEffect, useRef, useState } from "react";
import type { PriceUpdate } from "../types/api";

interface PricePoint {
  time: string;
  price: number;
}

export function useCardPriceStream(cardId: string, initialPrice: number) {
  const [history, setHistory] = useState<PricePoint[]>([
    { time: new Date().toLocaleTimeString(), price: initialPrice },
  ]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl = `ws://localhost:8000/ws/cards/${cardId}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);

    ws.onmessage = (event) => {
      const data: PriceUpdate = JSON.parse(event.data);
      if (data.event === "subscribed") return;

      setHistory((prev) => [
        ...prev.slice(-49), // keep at most the last 50 points
        { time: new Date().toLocaleTimeString(), price: data.price },
      ]);
    };

    return () => {
      ws.close();
    };
  }, [cardId]);

  const latestPrice = history[history.length - 1]?.price ?? initialPrice;

  return { history, latestPrice, connected };
}