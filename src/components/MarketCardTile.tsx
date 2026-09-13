import { Link } from "react-router-dom";
import { PixelPanel } from "./PixelPanel";
import type { Card } from "../types/api";

export function MarketCardTile({ card }: { card: Card }) {
  return (
    <Link to={`/cards/${card.id}`}>
      <PixelPanel className="hover:translate-x-1 hover:translate-y-1 transition-transform cursor-pointer">
        <p className="font-pixel text-sm mb-3">{card.name}</p>
        <p className="font-data text-gain text-xl">${card.price.toFixed(2)}</p>
      </PixelPanel>
    </Link>
  );
}