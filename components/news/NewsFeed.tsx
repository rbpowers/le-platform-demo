"use client";

import { useTicker } from "@/lib/TickerContext";

interface NewsItem {
  id: number;
  time: string;
  headline: string;
  tickers: string[];
  category: "bullish" | "bearish" | "neutral";
}

const MOCK_NEWS: NewsItem[] = [
  { id: 1,  time: "09:47", headline: "{NVDA} announces expanded H200 allocation for hyperscalers",      tickers: ["NVDA"],        category: "bullish"  },
  { id: 2,  time: "09:41", headline: "Fed minutes signal 'patient' approach — {SPY} {QQQ} react",       tickers: ["SPY","QQQ"],   category: "neutral"  },
  { id: 3,  time: "09:35", headline: "{TSLA} deliveries miss consensus by ~12k units in Q1",             tickers: ["TSLA"],        category: "bearish"  },
  { id: 4,  time: "09:28", headline: "{AMD} MI300X production ramp confirmed for H2",                    tickers: ["AMD"],         category: "bullish"  },
  { id: 5,  time: "09:21", headline: "{MSTR} adds 2,500 BTC to treasury, total now 214k",               tickers: ["MSTR"],        category: "bullish"  },
  { id: 6,  time: "09:15", headline: "{AAPL} EU hits with €1.8B fine over App Store practices",         tickers: ["AAPL"],        category: "bearish"  },
  { id: 7,  time: "09:09", headline: "{PLTR} wins $400M DoD contract expansion",                        tickers: ["PLTR"],        category: "bullish"  },
  { id: 8,  time: "08:58", headline: "{META} AI Studio rolling out to 3M creators",                     tickers: ["META"],        category: "bullish"  },
  { id: 9,  time: "08:46", headline: "{SMCI} delays 10-K filing again — auditor change flagged",        tickers: ["SMCI"],        category: "bearish"  },
  { id: 10, time: "08:32", headline: "{COIN} BTC custody volumes up 34% QoQ — mgmt commentary",        tickers: ["COIN"],        category: "bullish"  },
  { id: 11, time: "08:21", headline: "{MSFT} Azure growth re-accelerates to 31% YoY in cloud",         tickers: ["MSFT"],        category: "bullish"  },
  { id: 12, time: "07:55", headline: "Pre-market: {SPY} futures flat ahead of CPI print at 8:30",      tickers: ["SPY"],         category: "neutral"  },
];

const DOT_COLOR = { bullish: "var(--success)", bearish: "var(--danger)", neutral: "var(--text-muted)" } as const;

function parseHeadline(
  headline: string,
  tickers: string[],
  openChartModal: (t: string) => void
): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let rem = headline;

  for (const ticker of tickers) {
    const token = `{${ticker}}`;
    const idx   = rem.indexOf(token);
    if (idx === -1) continue;
    if (idx > 0) parts.push(rem.slice(0, idx));
    parts.push(
      <button
        key={ticker}
        onClick={(e) => { e.stopPropagation(); openChartModal(ticker); }}
        className="inline-flex items-center px-1.5 rounded font-semibold transition-opacity hover:opacity-75"
        style={{
          background: "rgba(124,58,237,0.2)",
          color: "var(--primary-bright)",
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: "11px",
          lineHeight: "inherit",
          verticalAlign: "baseline",
        }}
      >
        {ticker}
      </button>
    );
    rem = rem.slice(idx + token.length);
  }
  if (rem) parts.push(rem);
  return parts;
}

export function NewsFeed() {
  const { openChartModal } = useTicker();

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--bg-card)" }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 h-9 shrink-0 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          News
        </span>
        <span
          className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
          style={{ background: "rgba(16,185,129,0.1)", color: "var(--success)" }}
        >
          Benzinga
        </span>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto">
        {MOCK_NEWS.map((item) => (
          <div
            key={item.id}
            className="flex gap-2.5 px-3 py-2.5 border-b transition-colors hover:bg-[var(--bg-hover)] cursor-default"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="pt-1 shrink-0">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: DOT_COLOR[item.category], boxShadow: `0 0 4px ${DOT_COLOR[item.category]}` }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="num text-[10px] block mb-0.5" style={{ color: "var(--text-muted)" }}>
                {item.time} ET
              </span>
              <p className="text-[11px] leading-[1.45]" style={{ color: "var(--text-secondary)" }}>
                {parseHeadline(item.headline, item.tickers, openChartModal)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Options Flow divider */}
      <div
        className="flex items-center justify-center border-t shrink-0"
        style={{ borderColor: "var(--border)", height: "36px" }}
      >
        <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          Options Flow — Phase 3
        </span>
      </div>
    </div>
  );
}
