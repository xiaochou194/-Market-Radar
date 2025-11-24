
export type Direction = 'up' | 'down' | 'neutral';
export type MarketStatus = 'open' | 'closed';
export type Region = 'US' | 'CN' | 'HK' | 'Global';

export interface OHLC {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface MarketData {
  id: string;
  name: string;
  code: string; // e.g., SPX, 000001.SS
  price: number;
  change: number;
  changePercent: number;
  direction: Direction;
  history: number[]; // For sparklines (simple close prices)
  ohlc: OHLC[]; // For candlestick charts
  lastUpdated: string; // HH:MM:SS
  source: string;
  category: 'index' | 'commodity' | 'bond' | 'currency';
  region: Region;
  status: MarketStatus; // Dynamic status
  openTime: string; // Local time e.g., "09:30"
  closeTime: string; // Local time e.g., "16:00"
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  timestamp: string; // YYYY-MM-DD HH:MM:SS
  tags: string[];
  url: string;
  category: 'central_bank' | 'earnings' | 'global' | 'tech' | 'macro';
}

export interface EconomicIndicator {
  id: string;
  name: string;
  value: string; // e.g., "3.4%"
  comparison: string; // e.g., "环比 +0.1%"
  description: string;
  impact: string; // "High" | "Medium" | "Low"
  nextRelease: string;
  lastUpdated: string;
  history: { date: string; value: number }[];
  category: 'US' | 'CN' | 'Global';
  source: string;
}

export interface UserSettings {
  refreshRate: 1000 | 5000 | 10000; // ms
  theme: 'light' | 'dark' | 'system';
  beginnerMode: boolean; // Show tooltips
  marketPreference: 'global' | 'cn' | 'us';
}
