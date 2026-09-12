import type { PricePoint } from "../hooks/useCardPriceStream";

export function computeTrend(history: PricePoint[]) {
  if (history.length < 2 || history[0].price <= 0) {
    return { isUp: true, changePct: 0 };
  }
  const first = history[0].price;
  const last = history[history.length - 1].price;
  const changePct = ((last - first) / first) * 100;
  return { isUp: changePct >= 0, changePct };
}