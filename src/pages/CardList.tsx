import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { PixelPanel } from "../components/PixelPanel";
import type { Card } from "../types/api";
import { UserBadge } from "../components/UserBadge";

export function CardList() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listCards().then((data) => {
      setCards(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p className="font-data text-text-dim p-8">Loading cards...</p>;
  }

  return (
    <div className="p-8">
      <UserBadge />
      <h1 className="font-pixel text-banana text-2xl mb-6">Markets</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link key={card.id} to={`/cards/${card.id}`}>
            <PixelPanel className="hover:translate-x-1 hover:translate-y-1 transition-transform cursor-pointer">
              <p className="font-pixel text-sm mb-3">{card.name}</p>
              <p className="font-data text-gain text-xl">
                ${card.price.toFixed(2)}
              </p>
            </PixelPanel>
          </Link>
        ))}
      </div>
    </div>
  );
}