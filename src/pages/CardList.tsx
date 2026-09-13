import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { PageContainer } from "../components/PageContainer";
import { UserBadge } from "../components/UserBadge";
import { MarketCardTile } from "../components/MarketCardTile";
import { CardSkeleton } from "../components/CardSkeleton";
import type { Card } from "../types/api";

type SortOption = "name" | "price-asc" | "price-desc" | "newest";

export function CardList() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");

  useEffect(() => {
    api.listCards().then((data) => {
      setCards(data);
      setLoading(false);
    });
  }, []);

  const visibleCards = useMemo(() => {
    let result = cards.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
    switch (sort) {
      case "name":
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        // API already returns newest first
        break;
    }
    return result;
  }, [cards, search, sort]);

  return (
    <PageContainer>
      <UserBadge />
      <Link to="/portfolio" className="font-data text-banana text-xs mb-4 inline-block">
        view portfolio →
      </Link>
      <h1 className="font-pixel text-banana text-2xl mb-6">Markets</h1>

      {!loading && cards.length > 0 && (
        <div className="flex gap-2 mb-6">
          <input
            className="font-data text-sm bg-panel border-2 border-border p-2 flex-1 text-text"
            placeholder="search cards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="font-data text-sm bg-panel border-2 border-border p-2 text-text"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
          >
            <option value="newest">newest</option>
            <option value="name">name</option>
            <option value="price-asc">price ↑</option>
            <option value="price-desc">price ↓</option>
          </select>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : cards.length === 0 ? (
        <div className="font-data text-text-dim text-sm text-center py-12">
          <p className="mb-1">no cards exist yet.</p>
          <p>create one via the API to get started.</p>
        </div>
      ) : visibleCards.length === 0 ? (
        <p className="font-data text-text-dim text-sm">no cards match "{search}"</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {visibleCards.map((card) => (
            <MarketCardTile key={card.id} card={card} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}