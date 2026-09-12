import { useState, type FormEvent } from "react";
import { api } from "../lib/api";
import { useUser } from "../context/UserContext";
import { PixelPanel } from "./PixelPanel";
import type { Trade } from "../types/api";

interface TradeFormProps {
  cardId: string;
  onTraded?: () => void;
}

export function TradeForm({ cardId, onTraded }: TradeFormProps) {
  const { user, refreshUser } = useUser();
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTrade, setLastTrade] = useState<Trade | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;

    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      setError("Enter an amount greater than 0");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const trade = await api.executeTrade({
        user_id: user.id,
        card_id: cardId,
        side,
        amount: parsedAmount,
      });
      setLastTrade(trade);
      setAmount("");
      await refreshUser();
      onTraded?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Trade failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PixelPanel>
      <p className="font-pixel text-sm mb-4">Trade</p>

      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setSide("buy")}
          className={`font-pixel text-xs flex-1 py-2 border-2 border-border ${
            side === "buy" ? "bg-gain text-bg" : "bg-bg text-text-dim"
          }`}
        >
          buy
        </button>
        <button
          type="button"
          onClick={() => setSide("sell")}
          className={`font-pixel text-xs flex-1 py-2 border-2 border-border ${
            side === "sell" ? "bg-loss text-bg" : "bg-bg text-text-dim"
          }`}
        >
          sell
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <label className="font-data text-text-dim text-xs block mb-1">
          {side === "buy" ? "currency to spend" : "units to sell"}
        </label>
        <input
          type="number"
          step="any"
          className="font-data w-full bg-bg border-2 border-border p-2 mb-3 text-text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
        />

        {error && <p className="font-data text-loss text-xs mb-3">{error}</p>}
        {lastTrade && !error && (
          <p className="font-data text-gain text-xs mb-3">
            {lastTrade.side === "buy" ? "bought" : "sold"} {lastTrade.quantity.toFixed(2)} @ $
            {lastTrade.price.toFixed(2)}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="font-pixel text-xs bg-banana text-bg border-2 border-border px-4 py-2 w-full disabled:opacity-50"
        >
          {submitting ? "trading..." : "confirm"}
        </button>
      </form>
    </PixelPanel>
  );
}