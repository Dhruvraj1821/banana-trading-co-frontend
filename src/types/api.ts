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

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  net_worth: number;
  roi_pct: number;
}

export interface CreatorLeaderboardEntry {
  user_id: string;
  username: string;
  card_count: number;
  total_trading_volume: number;
}

export interface GainerLoser {
  card_id: string;
  card_name: string;
  pct_change: number;
  latest_price: number;
}

export interface NewListing {
  card_id: string;
  card_name: string;
  creator_username: string;
  total_supply: number;
}

export interface WhaleTrade {
  card_name: string;
  username: string;
  side: "buy" | "sell";
  currency_value: number;
}

export interface Newspaper {
  generated_at: string;
  headlines: string[];
  top_gainers: GainerLoser[];
  top_losers: GainerLoser[];
  new_listings: NewListing[];
  whale_trades: WhaleTrade[];
}