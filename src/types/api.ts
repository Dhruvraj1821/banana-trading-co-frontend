export interface User {
  id: string;
  username: string;
  currency_balance: number;
}

export interface Card {
  id: string;
  name: string;
  creator_id: string;
  total_supply: number;
  currency_reserve: number;
  card_reserve: number;
  fee_rate: number;
  cap_pct: number;
  creator_stake_pct: number;
  supply_model: string;
  price: number;
}

export interface Trade {
  id: string;
  user_id: string;
  card_id: string;
  side: "buy" | "sell";
  quantity: number;
  price: number;
  fee_amount: number;
}

export interface PortfolioItem {
  card_id: string;
  card_name: string;
  quantity: number;
  avg_cost_basis: number;
  current_price: number;
  market_value: number;
  unrealized_pnl: number;
  unrealized_pnl_pct: number;
}

export interface Portfolio {
  user_id: string;
  currency_balance: number;
  holdings: PortfolioItem[];
  total_portfolio_value: number;
}

export interface PriceUpdate {
  card_id: string;
  price: number;
  event: "trade" | "drift" | "subscribed";
}