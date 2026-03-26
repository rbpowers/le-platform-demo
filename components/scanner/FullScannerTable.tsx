"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { TrendingUp, TrendingDown, ChevronUp, ChevronDown, SlidersHorizontal } from "lucide-react";
import type { FullScannerRow, BreakoutStatus } from "@/lib/types";
import { useTicker } from "@/lib/TickerContext";

// ─── Mock data (OVERVIEW.md §3.3 columns) ────────────────────────────────────
const BASE_DATA: FullScannerRow[] = [
  { ticker:"NVDA", company:"NVIDIA Corporation",      price:875.42, change:18.34,  changePct:2.14,   volume:48200000, rvol:2.8, pdh:862.50, pdl:844.20, pmh:879.00, pml:858.50, newsHeadline:"H200 allocation expands for hyperscalers",         breakoutStatus:"bullish",    signals:["Key Level"],    lastUpdated:0, },
  { ticker:"TSLA", company:"Tesla Inc",               price:248.15, change:-6.72,  changePct:-2.63,  volume:91400000, rvol:3.1, pdh:258.40, pdl:241.80, pmh:260.10, pml:245.00, newsHeadline:"Q1 deliveries miss consensus by ~12k units",        breakoutStatus:"bearish",    signals:["Inside Day"],   lastUpdated:0, },
  { ticker:"AMD",  company:"Advanced Micro Devices",  price:172.33, change:4.56,   changePct:2.72,   volume:62800000, rvol:4.7, pdh:168.90, pdl:163.40, pmh:173.50, pml:167.20, newsHeadline:"MI300X production ramp confirmed for H2",           breakoutStatus:"bullish",    signals:["Volume Surge"], lastUpdated:0, },
  { ticker:"SPY",  company:"SPDR S&P 500 ETF",        price:523.88, change:1.05,   changePct:0.20,   volume:78200000, rvol:1.2, pdh:524.10, pdl:519.80, pmh:524.80, pml:521.50, newsHeadline:null,                                               breakoutStatus:"inside-day", signals:[],               lastUpdated:0, },
  { ticker:"AAPL", company:"Apple Inc",               price:212.67, change:-0.88,  changePct:-0.41,  volume:55600000, rvol:0.9, pdh:215.20, pdl:211.40, pmh:215.80, pml:213.20, newsHeadline:"EU hits with €1.8B fine over App Store practices", breakoutStatus:"inside-day", signals:["Inside Day"],   lastUpdated:0, },
  { ticker:"META", company:"Meta Platforms",          price:507.21, change:9.44,   changePct:1.90,   volume:22100000, rvol:2.2, pdh:499.80, pdl:492.10, pmh:508.50, pml:497.40, newsHeadline:"AI Studio rolling out to 3M creators",              breakoutStatus:"bullish",    signals:["EMA Stack"],    lastUpdated:0, },
  { ticker:"QQQ",  company:"Invesco QQQ Trust",       price:447.60, change:2.18,   changePct:0.49,   volume:44300000, rvol:1.5, pdh:447.20, pdl:441.50, pmh:448.20, pml:444.60, newsHeadline:null,                                               breakoutStatus:"bullish",    signals:[],               lastUpdated:0, },
  { ticker:"MSFT", company:"Microsoft Corp",          price:420.10, change:-3.22,  changePct:-0.76,  volume:19800000, rvol:1.1, pdh:425.40, pdl:418.60, pmh:426.80, pml:421.20, newsHeadline:"Azure growth re-accelerates to 31% YoY",           breakoutStatus:"inside-day", signals:["Key Level"],    lastUpdated:0, },
  { ticker:"MSTR", company:"MicroStrategy Inc",       price:1640.5, change:88.30,  changePct:5.69,   volume:8400000,  rvol:5.2, pdh:1562.0, pdl:1520.0, pmh:1668.0, pml:1595.0, newsHeadline:"Adds 2,500 BTC to treasury, total now 214k",       breakoutStatus:"bullish",    signals:["Volume Surge","Key Level"], lastUpdated:0, },
  { ticker:"PLTR", company:"Palantir Technologies",   price:24.87,  change:1.44,   changePct:6.14,   volume:112000000,rvol:3.8, pdh:23.80,  pdl:22.90,  pmh:25.10,  pml:23.60,  newsHeadline:"Wins $400M DoD contract expansion",                breakoutStatus:"bullish",    signals:["EMA Stack"],    lastUpdated:0, },
  { ticker:"COIN", company:"Coinbase Global",         price:198.33, change:-7.55,  changePct:-3.67,  volume:18600000, rvol:2.6, pdh:208.20, pdl:197.40, pmh:210.00, pml:200.40, newsHeadline:"BTC custody volumes up 34% QoQ",                   breakoutStatus:"bearish",    signals:[],               lastUpdated:0, },
  { ticker:"SMCI", company:"Super Micro Computer",    price:88.21,  change:4.10,   changePct:4.88,   volume:31200000, rvol:4.1, pdh:84.60,  pdl:80.20,  pmh:89.40,  pml:83.80,  newsHeadline:"Delays 10-K filing again — auditor change flagged", breakoutStatus:"bullish",    signals:["Volume Surge"], lastUpdated:0, },
];

// ─── Breakout status config ───────────────────────────────────────────────────
const BREAKOUT_CFG: Record<BreakoutStatus, { label: string; color: string; rowBg: string }> = {
  bullish:    { label: "Bullish",    color: "#10B981", rowBg: "rgba(16,185,129,0.07)"  },
  bearish:    { label: "Bearish",    color: "#EF4444", rowBg: "rgba(239,68,68,0.07)"   },
  "inside-day": { label: "Inside Day", color: "#A78BFA", rowBg: "transparent"           },
  none:       { label: "—",         color: "#7C6FA8", rowBg: "transparent"             },
};

function fmtVol(v: number) {
  if (v >= 1e9) return (v / 1e9).toFixed(1) + "B";
  if (v >= 1e6) return (v / 1e6).toFixed(1) + "M";
  if (v >= 1e3) return (v / 1e3).toFixed(0) + "K";
  return v.toString();
}

type SortKey = keyof FullScannerRow;

export function FullScannerTable() {
  const { openChartModal, activeTicker } = useTicker();
  const [rows, setRows]         = useState(BASE_DATA.map(r => ({ ...r, lastUpdated: Date.now() })));
  const [flashMap, setFlashMap] = useState<Record<string, "green" | "red">>({});
  const [sortKey, setSortKey]   = useState<SortKey>("rvol");
  const [sortDir, setSortDir]   = useState<"asc" | "desc">("desc");
  const [filterNews, setFilterNews] = useState(false);
  const [minRvol, setMinRvol]   = useState(0);
  const prevRef = useRef<Record<string, number>>({});

  // Live ticks
  useEffect(() => {
    const id = setInterval(() => {
      setRows((prev) => {
        const next = prev.map((row) => {
          const delta    = (Math.random() - 0.489) * row.price * 0.0018;
          const newPrice = parseFloat((row.price + delta).toFixed(2));
          const base     = row.price - row.change;
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

  const handleSort = useCallback((key: SortKey) => {
    if (key === sortKey) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  }, [sortKey]);

  const displayed = rows
    .filter(r => !filterNews || r.newsHeadline)
    .filter(r => r.rvol >= minRvol)
    .sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number")
        return sortDir === "desc" ? bv - av : av - bv;
      return 0;
    });

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k
      ? sortDir === "desc" ? <ChevronDown size={10} /> : <ChevronUp size={10} />
      : null;

  const Th = ({ label, k, right }: { label: string; k: SortKey; right?: boolean }) => (
    <th
      onClick={() => handleSort(k)}
      className="px-2 text-left border-b cursor-pointer select-none hover:opacity-80 transition-opacity whitespace-nowrap"
      style={{
        color: sortKey === k ? "var(--primary-bright)" : "var(--text-muted)",
        borderColor: "var(--border)",
        fontSize: "10px",
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        height: "30px",
        textAlign: right ? "right" : "left",
      }}
    >
      <span className="inline-flex items-center gap-0.5">
        {label}<SortIcon k={k} />
      </span>
    </th>
  );

  return (
    <div className="flex flex-col h-full pb-16 lg:pb-0" style={{ background: "var(--bg-card)" }}>
      {/* ── Filter bar ── */}
      <div
        className="flex items-center gap-4 px-4 shrink-0 border-b flex-wrap"
        style={{ borderColor: "var(--border)", minHeight: "44px", background: "var(--bg-base)" }}
      >
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal size={12} style={{ color: "var(--text-muted)" }} />
          <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            Filters
          </span>
        </div>

        {/* Has News toggle */}
        <label className="flex items-center gap-2 cursor-pointer">
          <div
            onClick={() => setFilterNews(v => !v)}
            className="w-8 h-4 rounded-full transition-colors relative cursor-pointer"
            style={{ background: filterNews ? "var(--primary)" : "var(--border)" }}
          >
            <div
              className="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform"
              style={{ left: filterNews ? "17px" : "2px" }}
            />
          </div>
          <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>Has News</span>
        </label>

        {/* Min RVOL */}
        <label className="flex items-center gap-2">
          <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>Min RVOL</span>
          <input
            type="range" min="0" max="4" step="0.5"
            value={minRvol}
            onChange={e => setMinRvol(parseFloat(e.target.value))}
            className="w-20 accent-violet-600"
          />
          <span className="num text-[11px] w-8" style={{ color: "var(--primary-bright)" }}>
            {minRvol}x
          </span>
        </label>

        <span className="ml-auto num text-[11px]" style={{ color: "var(--text-muted)" }}>
          {displayed.length} results
        </span>
      </div>

      {/* ── Table ── */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse" style={{ minWidth: "960px" }}>
          <thead className="sticky top-0 z-10" style={{ background: "var(--bg-base)" }}>
            <tr>
              <Th label="Ticker"    k="ticker"        />
              <Th label="Company"   k="company"       />
              <Th label="Price"     k="price"  right  />
              <Th label="Chg%"      k="changePct" right />
              <Th label="Volume"    k="volume"  right  />
              <Th label="RVOL"      k="rvol"    right  />
              <Th label="PDH"       k="pdh"     right  />
              <Th label="PDL"       k="pdl"     right  />
              <Th label="PMH"       k="pmh"     right  />
              <Th label="PML"       k="pml"     right  />
              <th
                className="px-2 text-left border-b"
                style={{ color:"var(--text-muted)", borderColor:"var(--border)", fontSize:"10px",
                         fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", height:"30px" }}
              >
                News Headline
              </th>
              <th
                className="px-2 text-left border-b"
                style={{ color:"var(--text-muted)", borderColor:"var(--border)", fontSize:"10px",
                         fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", height:"30px", whiteSpace:"nowrap" }}
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((row) => {
              const flash   = flashMap[row.ticker];
              const up      = row.changePct >= 0;
              const rvolHot = row.rvol >= 2.0;
              const boCfg   = BREAKOUT_CFG[row.breakoutStatus];
              const isActive = row.ticker === activeTicker;

              return (
                <tr
                  key={row.ticker}
                  onClick={() => openChartModal(row.ticker)}
                  className={`border-b cursor-pointer select-none ${
                    flash === "green" ? "flash-green" : flash === "red" ? "flash-red" : ""
                  }`}
                  style={{
                    height: "32px",
                    borderColor: "var(--border)",
                    background: isActive ? "rgba(76,29,149,0.22)" : boCfg.rowBg,
                    borderLeft: isActive ? "2px solid var(--primary-bright)" : "2px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.background = "var(--bg-hover)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.background =
                      isActive ? "rgba(76,29,149,0.22)" : boCfg.rowBg;
                  }}
                >
                  {/* Ticker */}
                  <td className="px-2">
                    <span className="num font-bold text-[12px]" style={{ color: "var(--primary-bright)" }}>
                      {row.ticker}
                    </span>
                  </td>
                  {/* Company */}
                  <td className="px-2">
                    <span className="text-[11px] truncate block max-w-[140px]" style={{ color: "var(--text-secondary)" }}>
                      {row.company}
                    </span>
                  </td>
                  {/* Price */}
                  <td className="px-2 text-right">
                    <span className="num text-[12px]" style={{ color: "var(--text-primary)" }}>
                      ${row.price >= 1000
                        ? row.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        : row.price.toFixed(2)}
                    </span>
                  </td>
                  {/* Chg% */}
                  <td className="px-2 text-right">
                    <div className="flex items-center justify-end gap-0.5">
                      {up ? <TrendingUp size={10} style={{ color: "var(--success)" }} />
                           : <TrendingDown size={10} style={{ color: "var(--danger)"  }} />}
                      <span className="num text-[12px]" style={{ color: up ? "var(--success)" : "var(--danger)" }}>
                        {row.changePct > 0 ? "+" : ""}{row.changePct.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                  {/* Volume */}
                  <td className="px-2 text-right">
                    <span className="num text-[12px]" style={{ color: "var(--text-secondary)" }}>
                      {fmtVol(row.volume)}
                    </span>
                  </td>
                  {/* RVOL */}
                  <td className="px-2 text-right">
                    <span
                      className="num text-[12px]"
                      style={{ color: rvolHot ? "var(--success)" : "var(--text-muted)", fontWeight: rvolHot ? 700 : 500 }}
                    >
                      {row.rvol.toFixed(1)}x
                    </span>
                  </td>
                  {/* PDH */}
                  <td className="px-2 text-right">
                    <span className="num text-[11px]" style={{ color: "#F97316" }}>{row.pdh.toFixed(2)}</span>
                  </td>
                  {/* PDL */}
                  <td className="px-2 text-right">
                    <span className="num text-[11px]" style={{ color: "#F97316" }}>{row.pdl.toFixed(2)}</span>
                  </td>
                  {/* PMH */}
                  <td className="px-2 text-right">
                    <span className="num text-[11px]" style={{ color: "#FBBF24" }}>{row.pmh.toFixed(2)}</span>
                  </td>
                  {/* PML */}
                  <td className="px-2 text-right">
                    <span className="num text-[11px]" style={{ color: "#FBBF24" }}>{row.pml.toFixed(2)}</span>
                  </td>
                  {/* News Headline */}
                  <td className="px-2 max-w-[220px]">
                    {row.newsHeadline ? (
                      <span className="text-[11px] truncate block" style={{ color: "var(--text-secondary)" }}>
                        {row.newsHeadline}
                      </span>
                    ) : (
                      <span style={{ color: "var(--text-muted)" }}>—</span>
                    )}
                  </td>
                  {/* Breakout Status */}
                  <td className="px-2">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap"
                      style={{ color: boCfg.color, background: `${boCfg.color}18` }}
                    >
                      {boCfg.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
