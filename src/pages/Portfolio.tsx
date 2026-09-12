import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { useUser } from "../context/UserContext";
import { PixelPanel } from "../components/PixelPanel";
import { UserBadge } from "../components/UserBadge";
import { PnlValue } from "../components/PnlValue";
import type { Portfolio as PortfolioType } from "../types/api";

export function Portfolio() {
  const { user } = useUser();
  const [portfolio, setPortfolio] = useState<PortfolioType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api.getPortfolio(user.id).then((data) => {
      setPortfolio(data);
      setLoading(false);
    });
  }, [user]);

  if (loading || !portfolio) {
    return <p className="font-data text-text-dim p-8">Loading portfolio...</p>;
  }

  return (
    <div className="p-8">
      <Link to="/" className="font-data text-text-dim text-sm mb-4 inline-block">
        &larr; back to markets
      </Link>
      <UserBadge />
      <h1 className="font-pixel text-banana text-2xl mb-6">Your Portfolio</h1>

      <PixelPanel className="mb-6">
        <p className="font-data text-text-dim text-sm mb-1">Total Value</p>
        <p className="font-data text-banana text-3xl">
          ${portfolio.total_portfolio_value.toFixed(2)}
        </p>
      </PixelPanel>

      {portfolio.holdings.length === 0 ? (
        <p className="font-data text-text-dim text-sm">
          No holdings yet, go buy something.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {portfolio.holdings.map((item) => (
            <Link key={item.card_id} to={`/cards/${item.card_id}`}>
              <PixelPanel className="hover:translate-x-1 hover:translate-y-1 transition-transform cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-pixel text-xs">{item.card_name}</p>
                  <PnlValue value={item.unrealized_pnl_pct} suffix="%" />
                </div>
                <div className="font-data text-xs text-text-dim grid grid-cols-2 gap-y-1">
                  <span>qty</span>
                  <span className="text-text text-right">{item.quantity.toFixed(2)}</span>

                  <span>avg cost</span>
                  <span className="text-text text-right">${item.avg_cost_basis.toFixed(2)}</span>

                  <span>current price</span>
                  <span className="text-text text-right">${item.current_price.toFixed(2)}</span>

                  <span>market value</span>
                  <span className="text-text text-right">${item.market_value.toFixed(2)}</span>

                  <span>unrealized P&amp;L</span>
                  <span className="text-right">
                    <PnlValue value={item.unrealized_pnl} suffix=" $" />
                  </span>
                </div>
              </PixelPanel>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}