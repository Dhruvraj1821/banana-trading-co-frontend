import type { Card } from "../types/api";

export function estimateBuy(card: Card, currencyIn: number) {
  const fee = currencyIn * card.fee_rate;
  const currencyAfterFee = currencyIn - fee;
  const k = card.currency_reserve * card.card_reserve;
  const newCurrencyReserve = card.currency_reserve + currencyAfterFee;
  const newCardReserve = k / newCurrencyReserve;
  const unitsOut = card.card_reserve - newCardReserve;
  return { unitsOut, fee };
}

export function estimateSell(card: Card, unitsIn: number) {
  const k = card.currency_reserve * card.card_reserve;
  const newCardReserve = card.card_reserve + unitsIn;
  const newCurrencyReserve = k / newCardReserve;
  const grossOut = card.currency_reserve - newCurrencyReserve;
  const fee = grossOut * card.fee_rate;
  const netOut = grossOut - fee;
  return { netOut, fee };
}