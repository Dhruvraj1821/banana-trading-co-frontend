import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { useUser } from "../context/UserContext";
import { PixelPanel } from "../components/PixelPanel";
import { UserBadge } from "../components/UserBadge";
import { PnlValue } from "../components/PnlValue";
import { PixelSpinner } from "../components/PixelSpinner";
import { PageContainer } from "../components/PageContainer";
import { AllocationChart } from "../components/AllocationChart";
import { totalUnrealizedPnl, sortHoldings, type HoldingSort } from "../lib/portfolioHelpers";
import type { Portfolio as PortfolioType } from "../types/api";
import { ResponsiveSparklineImpl } from "../components/ResponsiveSparklineImpl";

interface ValuePoint {
  time: string;
  value: number;
}

const POLL_INTERVAL_MS = 10000;
const MAX_SESSION_POINTS = 30;

export function Portfolio() {
  const { user } = useUser();
  const [portfolio, setPortfolio] = useState<PortfolioType | null>(null);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<HoldingSort>("value-desc");
  const [sessionHistory, setSessionHistory] = useState<ValuePoint[]>([]);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function fetchAndRecord() {
      const data = await api.getPortfolio(user!.id);
      if (cancelled) return;
      setPortfolio(data);
      setLoading(false);
      setSessionHistory((prev) => [
        ...prev.slice(-(MAX_SESSION_POINTS - 1)),
        { time: new Date().toLocaleTimeString(), value: data.total_portfolio_value },
      ]);
    }

    fetchAndRecord();
    const interval = setInterval(fetchAndRecord, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [user]);

  if (loading || !portfolio) {
    return (
      <PageContainer>
        <PixelSpinner label="loading portfolio..." />
      </PageContainer>
    );
  }

  const aggregatePnl = totalUnrealizedPnl(portfolio.holdings);
  const sortedHoldings = sortHoldings(portfolio.holdings, sort);

  return (
    <PageContainer>
      <Link to="/" className="font-data text-text-dim text-sm mb-4 inline-block">
        &larr; back to markets
      </Link>
      <UserBadge />
      <h1 className="font-pixel text-banana text-2xl mb-6">Your Portfolio</h1>

      <PixelPanel className="mb-6">
        <p className="font-data text-text-dim text-sm mb-1">Total Value</p>
        <p className="font-data text-banana text-3xl mb-2">
          ${portfolio.total_portfolio_value.toFixed(2)}
        </p>
        {portfolio.holdings.length > 0 && (
          <p className="font-data text-sm">
            unrealized P&amp;L: <PnlValue value={aggregatePnl} suffix=" $" />
          </p>
        )}
      </PixelPanel>

      {sessionHistory.length > 1 && (
        <PixelPanel className="mb-6">
          <p className="font-data text-text-dim text-xs mb-2">
            session value history (this tab only)
          </p>
          <div style={{ width: "100%", height: 80 }}>
            <SessionSparkline history={sessionHistory} />
          </div>
        </PixelPanel>
      )}

      {portfolio.holdings.length === 0 ? (
        <div className="font-data text-text-dim text-sm text-center py-12">
          <p className="mb-4">no holdings yet.</p>
          <Link
            to="/"
            className="font-pixel text-xs bg-banana text-bg border-2 border-border px-4 py-2 inline-block"
          >
            browse markets
          </Link>
        </div>
      ) : (
        <>
          <PixelPanel className="mb-6">
            <p className="font-data text-text-dim text-xs mb-2">allocation</p>
            <AllocationChart holdings={portfolio.holdings} />
          </PixelPanel>

          <div className="flex justify-end mb-3">
            <select
              className="font-data text-xs bg-panel border-2 border-border p-1 text-text"
              value={sort}
              onChange={(e) => setSort(e.target.value as HoldingSort)}
            >
              <option value="value-desc">sort: value</option>
              <option value="pnl-desc">sort: P&amp;L (high to low)</option>
              <option value="pnl-asc">sort: P&amp;L (low to high)</option>
              <option value="name">sort: name</option>
            </select>
          </div>

          <div className="flex flex-col gap-3">
            {sortedHoldings.map((item) => (
              <Link key={item.card_id} to={`/cards/${item.card_id}`}>
                <PixelPanel
                  className={`hover:translate-x-1 hover:translate-y-1 transition-transform cursor-pointer border-l-4 ${
                    item.unrealized_pnl >= 0 ? "border-l-gain" : "border-l-loss"
                  }`}
                >
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
        </>
      )}
    </PageContainer>
  );
}

function SessionSparkline({ history }: { history: ValuePoint[] }) {
  const isUp = history[history.length - 1].value >= history[0].value;
  return (
    <ResponsiveSparklineImpl history={history} isUp={isUp} />
  );
}