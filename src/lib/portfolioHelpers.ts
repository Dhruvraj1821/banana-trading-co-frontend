import type { PortfolioItem } from "../types/api";

export function totalUnrealizedPnl(holdings: PortfolioItem[]): number {
  return holdings.reduce((sum, h) => sum + h.unrealized_pnl, 0);
}

export type HoldingSort = "value-desc" | "pnl-desc" | "pnl-asc" | "name";

export function sortHoldings(holdings: PortfolioItem[], sort: HoldingSort): PortfolioItem[] {
  const copy = [...holdings];
  switch (sort) {
    case "value-desc":
      return copy.sort((a, b) => b.market_value - a.market_value);
    case "pnl-desc":
      return copy.sort((a, b) => b.unrealized_pnl - a.unrealized_pnl);
    case "pnl-asc":
      return copy.sort((a, b) => a.unrealized_pnl - b.unrealized_pnl);
    case "name":
      return copy.sort((a, b) => a.card_name.localeCompare(b.card_name));
  }
}