export type ConnectionStatus = "connected" | "connecting" | "disconnected";
export type MarketSession   = "pre-market" | "regular" | "after-hours" | "closed";
export type BreakoutStatus  = "bullish" | "bearish" | "inside-day" | "none";
export type Signal = "Inside Day" | "Key Level" | "EMA Stack" | "Volume Surge";

export interface ScannerRow {
  ticker: string;
  price: number;
  change: number;
  changePct: number;
  rvol: number;
  signals: Signal[];
  lastUpdated: number;
}

export interface FullScannerRow extends ScannerRow {
  company: string;
  volume: number;
  pdh: number;
  pdl: number;
  pmh: number;
  pml: number;
  newsHeadline: string | null;
  breakoutStatus: BreakoutStatus;
}

export interface WatchlistEntry {
  ticker: string;
  pinnedAt: string;
  pinnedBy: string;
}

export interface MarketTicker {
  symbol: string;
  price: number;
  change: number;
  changePct: number;
  history: number[];   // sparkline values
}
