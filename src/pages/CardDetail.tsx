import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { api } from "../lib/api";
import { useCardPriceStream } from "../hooks/useCardPriceStream";
import { PixelPanel } from "../components/PixelPanel";
import type { Card } from "../types/api";
import { UserBadge } from "../components/UserBadge";
import { TradeForm } from "../components/TradeForm";

export function CardDetail() {
  const { cardId } = useParams<{ cardId: string }>();
  const [card, setCard] = useState<Card | null>(null);

  useEffect(() => {
    if (!cardId) return;
    api.getCard(cardId).then(setCard);
  }, [cardId]);

  const { history, latestPrice, connected } = useCardPriceStream(
    cardId ?? "",
    card?.price ?? 0
  );

  if (!card) {
    return <p className="font-data text-text-dim p-8">Loading...</p>;
  }

  return (
    <div className="p-8">
      <Link to="/" className="font-data text-text-dim text-sm mb-4 inline-block">
        &larr; back to markets
      </Link>
      <UserBadge />
      <Link to="/portfolio" className="font-data text-banana text-xs mb-4 inline-block"> view portfolio →</Link>
      <h1 className="font-pixel text-banana text-2xl mb-2">{card.name}</h1>
      <p className="font-data text-text-dim text-xs mb-6">
        {connected ? "● live" : "○ connecting..."}
      </p>

      <PixelPanel className="mb-6">
        <p className="font-data text-text-dim text-sm mb-2">Current Price</p>
        <p className="font-data text-gain text-4xl mb-4">
          ${latestPrice.toFixed(2)}
        </p>
        <div style={{ width: "100%", height: 250 }}>
          <ResponsiveContainer>
            <LineChart data={history}>
              <XAxis dataKey="time" hide />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fontFamily: "JetBrains Mono", fontSize: 11 }}
                stroke="#8a8a96"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#17171f",
                  border: "2px solid #000",
                  fontFamily: "JetBrains Mono",
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#4ade80"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </PixelPanel>

      <PixelPanel>
        <p className="font-data text-text-dim text-sm">Total Supply</p>
        <p className="font-data">{card.total_supply.toLocaleString()}</p>
      </PixelPanel>
      <TradeForm cardId={card.id} onTraded={() => api.getCard(card.id).then(setCard)} />
    </div>
  );
}