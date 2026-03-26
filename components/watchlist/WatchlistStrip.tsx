"use client";

import { useTicker } from "@/lib/TickerContext";

interface WatchlistCard {
  ticker: string;
  price: number;
  changePct: number;
  thesis: string;
  conviction: "high" | "normal";
}

const PINNED: WatchlistCard[] = [
  { ticker: "NVDA",  price: 875.42,  changePct:  2.14, thesis: "AI compute supercycle — data center demand accelerating.",  conviction: "high"   },
  { ticker: "AMD",   price: 172.33,  changePct:  2.72, thesis: "MI300X gaining share in AI inference vs NVDA.",             conviction: "high"   },
  { ticker: "MSTR",  price: 1640.5,  changePct:  5.69, thesis: "Bitcoin proxy with leverage — watch BTC for directional.",  conviction: "normal" },
  { ticker: "PLTR",  price: 24.87,   changePct:  6.14, thesis: "AIP platform expansion + gov contract momentum.",           conviction: "normal" },
  { ticker: "SPY",   price: 523.88,  changePct:  0.20, thesis: "Market pulse — 521 key support, watch for trend change.",   conviction: "normal" },
];

export function WatchlistStrip() {
  const { activeTicker, setActiveTicker, openChartModal } = useTicker();

  return (
    <div
      className="flex items-stretch gap-2 px-2 py-2 border-b overflow-x-auto shrink-0"
      style={{ borderColor: "var(--border)", background: "var(--bg-base)" }}
    >
      <div className="flex items-center shrink-0 mr-1">
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          Today&apos;s Watches
        </span>
      </div>

      {PINNED.map((card) => {
        const isActive = card.ticker === activeTicker;
        const up = card.changePct >= 0;

        return (
          <button
            key={card.ticker}
            onClick={() => setActiveTicker(card.ticker)}          // hub: update center chart
            onDoubleClick={() => openChartModal(card.ticker)}     // double-click: open modal
            className={`flex flex-col justify-between rounded-lg px-3 py-2 border shrink-0 text-left transition-all ${
              card.conviction === "high" ? "pulse-conviction" : ""
            }`}
            style={{
              width: "152px",
              minWidth: "152px",
              background: isActive ? "rgba(76,29,149,0.22)" : "var(--bg-card)",
              borderColor: isActive
                ? "var(--primary-bright)"
                : card.conviction === "high"
                ? "var(--primary)"
                : "var(--border)",
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className="num font-bold text-[12px]"
                style={{ color: isActive ? "var(--primary-bright)" : "var(--text-primary)" }}
              >
                {card.ticker}
              </span>
              <span
                className="num text-[11px] font-semibold"
                style={{ color: up ? "var(--success)" : "var(--danger)" }}
              >
                {up ? "+" : ""}{card.changePct.toFixed(2)}%
              </span>
            </div>
            <span className="num text-[11px]" style={{ color: "var(--text-secondary)" }}>
              ${card.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <p className="text-[10px] mt-1 leading-tight line-clamp-2" style={{ color: "var(--text-muted)" }}>
              {card.thesis}
            </p>
            {card.conviction === "high" && (
              <span
                className="mt-1.5 self-start text-[9px] font-bold px-1.5 py-0.5 rounded"
                style={{ background: "rgba(76,29,149,0.3)", color: "var(--primary-bright)" }}
              >
                HIGH CONVICTION
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
