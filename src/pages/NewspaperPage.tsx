import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { PixelPanel } from "../components/PixelPanel";
import { PixelSpinner } from "../components/PixelSpinner";
import { PageContainer } from "../components/PageContainer";
import { PnlValue } from "../components/PnlValue";
import type { Newspaper } from "../types/api";

export function NewspaperPage() {
  const [paper, setPaper] = useState<Newspaper | null>(null);

  useEffect(() => {
    api.getNewspaper().then(setPaper);
  }, []);

  if (!paper) {
    return (
      <PageContainer>
        <PixelSpinner label="printing today's edition..." />
      </PageContainer>
    );
  }

  const printedAt = new Date(paper.generated_at).toLocaleString();

  return (
    <PageContainer>
      <div className="text-center border-b-4 border-border pb-4 mb-6">
        <h1 className="font-pixel text-banana text-2xl mb-1">The Daily Banana</h1>
        <p className="font-data text-text-dim text-xs">{printedAt}</p>
      </div>

      <PixelPanel className="mb-6">
        {paper.headlines.map((headline, i) => (
          <p
            key={i}
            className={`font-data ${i === 0 ? "text-banana text-base" : "text-text text-sm"} ${
              i !== paper.headlines.length - 1 ? "mb-2 pb-2 border-b border-border" : ""
            }`}
          >
            {i === 0 ? "▶ " : "· "}
            {headline}
          </p>
        ))}
      </PixelPanel>

      {(paper.top_gainers.length > 0 || paper.top_losers.length > 0) && (
        <PixelPanel className="mb-6">
          <p className="font-pixel text-xs mb-3">Market Movers</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="font-data text-gain text-xs mb-2">gainers</p>
              {paper.top_gainers.length === 0 ? (
                <p className="font-data text-text-dim text-xs">none</p>
              ) : (
                paper.top_gainers.map((g) => (
                  <Link key={g.card_id} to={`/cards/${g.card_id}`} className="block mb-1">
                    <div className="font-data text-xs flex justify-between hover:text-banana">
                      <span>{g.card_name}</span>
                      <PnlValue value={g.pct_change} suffix="%" />
                    </div>
                  </Link>
                ))
              )}
            </div>
            <div>
              <p className="font-data text-loss text-xs mb-2">losers</p>
              {paper.top_losers.length === 0 ? (
                <p className="font-data text-text-dim text-xs">none</p>
              ) : (
                paper.top_losers.map((l) => (
                  <Link key={l.card_id} to={`/cards/${l.card_id}`} className="block mb-1">
                    <div className="font-data text-xs flex justify-between hover:text-banana">
                      <span>{l.card_name}</span>
                      <PnlValue value={l.pct_change} suffix="%" />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </PixelPanel>
      )}

      {paper.new_listings.length > 0 && (
        <PixelPanel className="mb-6">
          <p className="font-pixel text-xs mb-3">New Listings</p>
          {paper.new_listings.map((listing) => (
            <Link key={listing.card_id} to={`/cards/${listing.card_id}`} className="block mb-2">
              <div className="font-data text-xs hover:text-banana">
                <span className="text-text">{listing.card_name}</span>
                <span className="text-text-dim"> — by {listing.creator_username}</span>
              </div>
            </Link>
          ))}
        </PixelPanel>
      )}

      {paper.whale_trades.length > 0 && (
        <PixelPanel>
          <p className="font-pixel text-xs mb-3">Whale Watch</p>
          {paper.whale_trades.map((whale, i) => (
            <div key={i} className="font-data text-xs mb-2">
              <span className={whale.side === "buy" ? "text-gain" : "text-loss"}>
                {whale.username} {whale.side === "buy" ? "bought" : "sold"}
              </span>{" "}
              <span className="text-banana">${whale.currency_value.toFixed(0)}</span>
              <span className="text-text-dim"> of {whale.card_name}</span>
            </div>
          ))}
        </PixelPanel>
      )}
    </PageContainer>
  );
}