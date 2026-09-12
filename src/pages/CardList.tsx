import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { PixelPanel } from "../components/PixelPanel";
import { PixelSpinner } from "../components/PixelSpinner";
import { PageContainer } from "../components/PageContainer";
import { UserBadge } from "../components/UserBadge";
import type { Card } from "../types/api";

export function CardList() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listCards().then((data) => {
      setCards(data);
      setLoading(false);
    });
  }, []);

  return (
    <PageContainer>
      <UserBadge />
      <Link to="/portfolio" className="font-data text-banana text-xs mb-4 inline-block">
        view portfolio →
      </Link>
      <h1 className="font-pixel text-banana text-2xl mb-6">Markets</h1>

      {loading ? (
        <PixelSpinner label="loading markets..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map((card) => (
            <Link key={card.id} to={`/cards/${card.id}`}>
              <PixelPanel className="hover:translate-x-1 hover:translate-y-1 transition-transform cursor-pointer">
                <p className="font-pixel text-sm mb-3">{card.name}</p>
                <p className="font-data text-gain text-xl">${card.price.toFixed(2)}</p>
              </PixelPanel>
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  );
}