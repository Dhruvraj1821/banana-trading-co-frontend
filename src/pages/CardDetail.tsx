import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import { useCardPriceStream } from "../hooks/useCardPriceStream";
import { PixelPanel } from "../components/PixelPanel";
import { UserBadge } from "../components/UserBadge";
import { TradeForm } from "../components/TradeForm";
import { PriceChart } from "../components/PriceChart";
import type { Card } from "../types/api";

export function CardDetail() {
  const { cardId } = useParams<{ cardId: string }>();
  const [card, setCard] = useState<Card | null>(null);

  useEffect(() => {
    if (!cardId) return;
    api.getCard(cardId).then(setCard);
  }, [cardId]);

  if (!card) {
    return <p className="font-data text-text-dim p-8">Loading...</p>;
  }

  return <CardDetailContent card={card} onCardUpdate={setCard} />;
}

function CardDetailContent({
  card,
  onCardUpdate,
}: {
  card: Card;
  onCardUpdate: (card: Card) => void;
}) {
  const { history, latestPrice, connected } = useCardPriceStream(card.id, card.price);

  return (
    <div className="p-8">
      <Link to="/" className="font-data text-text-dim text-sm mb-4 inline-block">
        &larr; back to markets
      </Link>
      <UserBadge />
      <Link to="/portfolio" className="font-data text-banana text-xs mb-4 inline-block">
        view portfolio →
      </Link>

      <h1 className="font-pixel text-banana text-2xl mb-2">{card.name}</h1>
      <p className="font-data text-text-dim text-xs mb-6">
        {connected ? "● live" : "○ connecting..."}
      </p>

      <PixelPanel className="mb-6">
        <p className="font-data text-text-dim text-sm mb-2">Current Price</p>
        <p className="font-data text-gain text-4xl mb-4">
          ${latestPrice.toFixed(2)}
        </p>
        <PriceChart history={history} />
      </PixelPanel>

      <PixelPanel className="mb-6">
        <p className="font-data text-text-dim text-sm">Total Supply</p>
        <p className="font-data">{card.total_supply.toLocaleString()}</p>
      </PixelPanel>

      <TradeForm card={card} onTraded={() => api.getCard(card.id).then(onCardUpdate)} />
    </div>
  );
}