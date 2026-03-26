"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { ScannerRow } from "@/lib/types";
import { useTicker } from "@/lib/TickerContext";

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_DATA: (ScannerRow & { abovePdh?: boolean })[] = [
  { ticker: "NVDA", price: 875.42, change: 18.34,  changePct:  2.14, rvol: 2.8, signals: ["Key Level"],    lastUpdated: Date.now(), abovePdh: true  },
  { ticker: "TSLA", price: 248.15, change: -6.72,  changePct: -2.63, rvol: 3.1, signals: ["Inside Day"],   lastUpdated: Date.now() },
  { ticker: "AMD",  price: 172.33, change:  4.56,  changePct:  2.72, rvol: 4.7, signals: ["Volume Surge"], lastUpdated: Date.now(), abovePdh: true },
  { ticker: "SPY",  price: 523.88, change:  1.05,  changePct:  0.20, rvol: 1.2, signals: [],               lastUpdated: Date.now() },
  { ticker: "AAPL", price: 212.67, change: -0.88,  changePct: -0.41, rvol: 0.9, signals: ["Inside Day"],   lastUpdated: Date.now() },
  { ticker: "META", price: 507.21, change:  9.44,  changePct:  1.90, rvol: 2.2, signals: ["EMA Stack"],    lastUpdated: Date.now() },
  { ticker: "QQQ",  price: 447.60, change:  2.18,  changePct:  0.49, rvol: 1.5, signals: [],               lastUpdated: Date.now() },
  { ticker: "MSFT", price: 420.10, change: -3.22,  changePct: -0.76, rvol: 1.1, signals: ["Key Level"],    lastUpdated: Date.now() },
  { ticker: "MSTR", price: 1640.5, change: 88.30,  changePct:  5.69, rvol: 5.2, signals: ["Volume Surge"], lastUpdated: Date.now(), abovePdh: true },
  { ticker: "PLTR", price: 24.87,  change:  1.44,  changePct:  6.14, rvol: 3.8, signals: ["EMA Stack"],    lastUpdated: Date.now() },
  { ticker: "COIN", price: 198.33, change: -7.55,  changePct: -3.67, rvol: 2.6, signals: [],               lastUpdated: Date.now() },
  { ticker: "SMCI", price: 88.21,  change:  4.10,  changePct:  4.88, rvol: 4.1, signals: ["Volume Surge"], lastUpdated: Date.now() },
];

/** When suppressModal is true (hub page), single-click only updates activeTicker.
 *  When false (default), single-click opens the chart modal. */
interface Props { suppressModal?: boolean; }

export function MarketScannerTable({ suppressModal = false }: Props) {
  const { activeTicker, setActiveTicker, openChartModal } = useTicker();
  const [rows, setRows]       = useState(MOCK_DATA);
  const [flashMap, setFlashMap] = useState<Record<string, "green" | "red">>({});
  const [researchTicker, setResearchTicker] = useState<string | null>(null);
  const prevRef     = useRef<Record<string, number>>({});
  const clickTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Live price simulation
  useEffect(() => {
    const id = setInterval(() => {
      setRows((prev) => {
        const next = prev.map((row) => {
          const delta = (Math.random() - 0.489) * row.price * 0.0018;
          const newPrice  = parseFloat((row.price + delta).toFixed(2));
          const base      = row.price - row.change;
          const newChange = parseFloat((newPrice - base).toFixed(2));
          const newPct    = parseFloat(((newChange / base) * 100).toFixed(2));
          return { ...row, price: newPrice, change: newChange, changePct: newPct, lastUpdated: Date.now() };
        });
        const flashes: Record<string, "green" | "red"> = {};
        next.forEach((r) => {
          const p = prevRef.current[r.ticker];
          if (p !== undefined) flashes[r.ticker] = r.price > p ? "green" : "red";
          prevRef.current[r.ticker] = r.price;
        });
        setFlashMap(flashes);
        return next;
      });
    }, 1400);
    return () => clearInterval(id);
  }, []);

  const handleRowClick = useCallback((ticker: string) => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      // double-click → research modal (placeholder)
      setResearchTicker(ticker);
    } else {
      clickTimer.current = setTimeout(() => {
        clickTimer.current = null;
        if (suppressModal) {
          setActiveTicker(ticker);
        } else {
          openChartModal(ticker);
        }
      }, 220);
    }
  }, [suppressModal, setActiveTicker, openChartModal]);

  return (
    <>
      {/* Research modal placeholder */}
      {researchTicker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(5,3,15,0.75)" }}
          onClick={() => setResearchTicker(null)}
        >
          <div
            className="rounded-xl border p-6 w-96 space-y-3"
            style={{ background: "var(--bg-card)", borderColor: "var(--primary)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <span className="num font-bold" style={{ color: "var(--primary-bright)" }}>
                {researchTicker} — Research
              </span>
              <button onClick={() => setResearchTicker(null)} style={{ color: "var(--text-muted)" }}>✕</button>
            </div>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Full research modal — earnings dates, key levels, thesis builder — arriving in Phase 2.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col h-full" style={{ background: "var(--bg-card)" }}>
        {/* Header */}
        <div
          className="flex items-center justify-between px-3 h-9 shrink-0 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
            Live Scanner
          </span>
          <span
            className="px-1.5 py-0.5 rounded text-[10px] font-semibold"
            style={{ background: "rgba(16,185,129,0.12)", color: "var(--success)" }}
          >
            {rows.length}
          </span>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <table className="w-full border-collapse" style={{ tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "32%" }} />
              <col style={{ width: "24%" }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: "22%" }} />
            </colgroup>
            <thead className="sticky top-0 z-10" style={{ background: "var(--bg-base)" }}>
              <tr>
                {["Ticker", "Price", "Chg%", "RVOL"].map((h) => (
                  <th
                    key={h}
                    className="px-2 text-left border-b"
                    style={{
                      color: "var(--text-muted)",
                      borderColor: "var(--border)",
                      fontSize: "10px",
                      fontWeight: 600,
                      letterSpacing: "0.07em",
                      textTransform: "uppercase",
                      height: "26px",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const isActive  = row.ticker === activeTicker;
                const flash     = flashMap[row.ticker];
                const up        = row.change >= 0;
                const rvolHot   = row.rvol >= 2.0;

                return (
                  <tr
                    key={row.ticker}
                    onClick={() => handleRowClick(row.ticker)}
                    className={`cursor-pointer border-b select-none transition-colors ${
                      flash === "green" ? "flash-green" : flash === "red" ? "flash-red" : ""
                    }`}
                    style={{
                      height: "32px",
                      borderColor: "var(--border)",
                      background: isActive ? "rgba(76,29,149,0.25)" : "transparent",
                      borderLeft: isActive ? "2px solid var(--primary-bright)" : "2px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) (e.currentTarget as HTMLTableRowElement).style.background = "var(--bg-hover)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) (e.currentTarget as HTMLTableRowElement).style.background = "transparent";
                    }}
                  >
                    <td className="px-2">
                      <div className="flex items-center gap-1.5">
                        <span className="num font-bold text-[12px]" style={{ color: isActive ? "var(--primary-bright)" : "var(--text-primary)" }}>
                          {row.ticker}
                        </span>
                        {row.abovePdh && (
                          <span
                            className="text-[9px] font-bold px-1 rounded leading-none"
                            style={{ background: "rgba(124,58,237,0.25)", color: "var(--primary-bright)", paddingTop: "2px", paddingBottom: "2px" }}
                          >
                            PDH
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-2">
                      <span className="num text-[12px]" style={{ color: "var(--text-primary)" }}>
                        ${row.price >= 1000
                          ? row.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                          : row.price.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-2">
                      <div className="flex items-center gap-0.5">
                        {up
                          ? <TrendingUp  size={10} style={{ color: "var(--success)" }} />
                          : <TrendingDown size={10} style={{ color: "var(--danger)"  }} />
                        }
                        <span className="num text-[12px]" style={{ color: up ? "var(--success)" : "var(--danger)" }}>
                          {row.changePct > 0 ? "+" : ""}{row.changePct.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-2">
                      <span
                        className="num text-[12px]"
                        style={{ color: rvolHot ? "var(--success)" : "var(--text-muted)", fontWeight: rvolHot ? 700 : 500 }}
                      >
                        {row.rvol.toFixed(1)}x
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-3 py-1.5 shrink-0 border-t" style={{ borderColor: "var(--border)" }}>
          <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>1-click chart · 2-click research</span>
        </div>
      </div>
    </>
  );
}
