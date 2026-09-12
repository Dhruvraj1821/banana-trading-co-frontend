import { useEffect, useState, type FormEvent } from "react";
import { api } from "../lib/api";
import { useUser } from "../context/UserContext";
import { useToast } from "../context/ToastContext";
import { estimateBuy, estimateSell } from "../lib/quote";
import { PixelPanel } from "./PixelPanel";
import { PixelButton } from "./PixelButton";
import type { Card } from "../types/api";

interface TradeFormProps {
  card: Card;
  onTraded?: () => void;
}

export function TradeForm({ card, onTraded }: TradeFormProps) {
  const { user, refreshUser } = useUser();
  const { addToast } = useToast();
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [shake, setShake] = useState(false);
  const [heldQty, setHeldQty] = useState(0);

  useEffect(() => {
    if (!user) return;
    api.getPortfolio(user.id).then((portfolio) => {
      const holding = portfolio.holdings.find((h) => h.card_id === card.id);
      setHeldQty(holding?.quantity ?? 0);
    });
  }, [user, card.id, submitting]); // refetch after each submit too

  if (!user) return null;

  const parsedAmount = parseFloat(amount) || 0;
  const maxAvailable = side === "buy" ? user.currency_balance : heldQty;
  const exceedsMax = parsedAmount > maxAvailable;
  const isValidAmount = parsedAmount > 0 && !exceedsMax;

  const quote =
    parsedAmount > 0
      ? side === "buy"
        ? estimateBuy(card, parsedAmount)
        : estimateSell(card, parsedAmount)
      : null;

  function setQuickAmount(fraction: number) {
    const value = maxAvailable * fraction;
    setAmount(value > 0 ? value.toFixed(2) : "");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValidAmount) {
      setShake(true);
      return;
    }

    setSubmitting(true);
    try {
      const trade = await api.executeTrade({
        user_id: user.id,
        card_id: card.id,
        side,
        amount: parsedAmount,
      });
      addToast(
        `${trade.side === "buy" ? "Bought" : "Sold"} ${trade.quantity.toFixed(2)} @ $${trade.price.toFixed(2)}`,
        "success"
      );
      setAmount("");
      await refreshUser();
      onTraded?.();
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Trade failed", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PixelPanel>
      <p className="font-pixel text-sm mb-4">Trade</p>

      <div className="flex gap-2 mb-3">
        <PixelButton
          type="button"
          variant={side === "buy" ? "gain" : "neutral"}
          onClick={() => {
            setSide("buy");
            setAmount("");
          }}
          className="flex-1"
        >
          buy
        </PixelButton>
        <PixelButton
          type="button"
          variant={side === "sell" ? "loss" : "neutral"}
          onClick={() => {
            setSide("sell");
            setAmount("");
          }}
          className="flex-1"
        >
          sell
        </PixelButton>
      </div>

      {side === "sell" && (
        <p className="font-data text-text-dim text-xs mb-2">
          you hold: <span className="text-text">{heldQty.toFixed(2)}</span> units
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <label className="font-data text-text-dim text-xs block mb-1">
          {side === "buy" ? "currency to spend" : "units to sell"}
        </label>
        <input
          type="number"
          step="any"
          className={`font-data w-full bg-bg border-2 border-border p-2 mb-2 text-text ${shake ? "animate-shake" : ""}`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onAnimationEnd={() => setShake(false)}
          placeholder="0"
        />

        <div className="flex gap-1 mb-3">
          {[0.25, 0.5, 0.75, 1].map((fraction) => (
            <button
              key={fraction}
              type="button"
              onClick={() => setQuickAmount(fraction)}
              className="font-data text-xs text-text-dim border border-border px-2 py-1 flex-1 hover:text-banana"
            >
              {fraction === 1 ? "max" : `${fraction * 100}%`}
            </button>
          ))}
        </div>

        {quote && (
          <p className="font-data text-text-dim text-xs mb-2">
            estimate:{" "}
            <span className="text-banana">
              {side === "buy"
                ? `~${(quote as ReturnType<typeof estimateBuy>).unitsOut.toFixed(2)} units`
                : `~$${(quote as ReturnType<typeof estimateSell>).netOut.toFixed(2)}`}
            </span>
          </p>
        )}

        {exceedsMax && parsedAmount > 0 && (
          <p className="font-data text-loss text-xs mb-2">
            exceeds your {side === "buy" ? "balance" : "holding"} (max {maxAvailable.toFixed(2)})
          </p>
        )}

        <PixelButton
          type="submit"
          variant="primary"
          disabled={submitting || !isValidAmount}
          className="w-full"
        >
          {submitting ? "trading..." : "confirm"}
        </PixelButton>
      </form>
    </PixelPanel>
  );
}