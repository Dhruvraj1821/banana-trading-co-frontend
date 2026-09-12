import type { User, Card, Trade, Portfolio } from "../types/api";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail ?? `Request failed: ${response.status}`);
  }
  return response.json();
}

export const api = {
  createUser: (username: string) =>
    request<User>("/users/", { method: "POST", body: JSON.stringify({ username }) }),

  getUser: (userId: string) => request<User>(`/users/${userId}`),

  getPortfolio: (userId: string) => request<Portfolio>(`/users/${userId}/portfolio`),

  listCards: () => request<Card[]>("/cards/"),

  getCard: (cardId: string) => request<Card>(`/cards/${cardId}`),

  createCard: (payload: {
    name: string;
    creator_id: string;
    total_supply: number;
    initial_currency_reserve: number;
    initial_card_reserve: number;
    creator_stake_pct?: number;
  }) => request<Card>("/cards/", { method: "POST", body: JSON.stringify(payload) }),

  executeTrade: (payload: {
    user_id: string;
    card_id: string;
    side: "buy" | "sell";
    amount: number;
  }) => request<Trade>("/trades/", { method: "POST", body: JSON.stringify(payload) }),
};