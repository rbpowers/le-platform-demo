"use client";

import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, ChevronRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useTicker } from "@/lib/TickerContext";

// ─── Widget shell ──────────────────────────────────────────────────────────────
function Widget({
  title,
  sub,
  accent,
  href,
  children,
}: {
  title: string;
  sub?: string;
  accent?: string;
  href?: string;
  children: React.ReactNode;
}) {
  const accentColor = accent ?? "var(--primary-bright)";
  return (
    <div
      className="flex flex-col h-full overflow-hidden rounded-xl border"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      {/* top accent bar */}
      <div style={{ height: "2px", background: accentColor, opacity: 0.7, flexShrink: 0 }} />

      {/* header */}
      <div
        className="flex items-center justify-between px-4 shrink-0"
        style={{ height: "36px", borderBottom: "1px solid var(--border)", background: "rgba(0,0,0,0.18)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--text-primary)" }}>
            {title}
          </span>
          {sub && (
            <span
              className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
              style={{ background: "rgba(124,58,237,0.18)", color: accentColor }}
            >
              {sub}
            </span>
          )}
        </div>
        {href && (
          <Link href={href} className="flex items-center gap-0.5 hover:opacity-70 transition-opacity">
            <span className="text-[9px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>View all</span>
            <ChevronRight size={10} style={{ color: "var(--text-muted)" }} />
          </Link>
        )}
      </div>

      {/* body */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

// ─── Reusable ticker row ───────────────────────────────────────────────────────
function TickerRow({
  rank,
  ticker,
  sub,
  value,
  pct,
  badge,
  badgeColor,
  onClick,
}: {
  rank?: number;
  ticker: string;
  sub?: string;
  value?: string;
  pct: number;
  badge?: string;
  badgeColor?: string;
  onClick: () => void;
}) {
  const up = pct >= 0;
  const color = up ? "var(--success)" : "var(--danger)";

  return (
    <button
      onClick={onClick}
      className="flex items-center w-full px-4 transition-colors"
      style={{ height: "44px", borderBottom: "1px solid rgba(45,36,98,0.5)" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {rank !== undefined && (
        <span className="num text-[10px] w-4 shrink-0 mr-2" style={{ color: "var(--text-muted)" }}>
          {rank}
        </span>
      )}

      <div className="flex flex-col flex-1 min-w-0 items-start">
        <span className="num text-[13px] font-bold leading-none" style={{ color: "var(--text-primary)" }}>
          {ticker}
        </span>
        {sub && (
          <span className="text-[10px] mt-0.5 truncate max-w-full" style={{ color: "var(--text-muted)" }}>
            {sub}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {badge && (
          <span
            className="text-[9px] font-bold px-1.5 py-0.5 rounded"
            style={{ background: badgeColor ?? "rgba(124,58,237,0.18)", color: badgeColor ? "white" : "var(--primary-bright)" }}
          >
            {badge}
          </span>
        )}
        {value && (
          <span className="num text-[12px]" style={{ color: "var(--text-secondary)", minWidth: "56px", textAlign: "right" }}>
            {value}
          </span>
        )}
        <div className="flex items-center gap-0.5" style={{ minWidth: "62px", justifyContent: "flex-end" }}>
          {up ? <ArrowUpRight size={12} style={{ color }} /> : <ArrowDownRight size={12} style={{ color }} />}
          <span className="num text-[13px] font-bold" style={{ color }}>
            {up ? "+" : ""}{pct.toFixed(2)}%
          </span>
        </div>
      </div>
    </button>
  );
}

// ─── 1. Top Movers Off the Open ────────────────────────────────────────────────
const TOP_MOVERS = [
  { ticker: "NVDA", price: 875.42, changePct:  4.81 },
  { ticker: "PLTR", price:  24.87, changePct:  6.14 },
  { ticker: "AMD",  price: 172.33, changePct:  2.72 },
  { ticker: "TSLA", price: 243.11, changePct: -3.41 },
  { ticker: "AAPL", price: 196.44, changePct: -1.08 },
];

function TopMovers() {
  const { openChartModal } = useTicker();
  return (
    <Widget title="Top Movers" sub="Off Open" accent="var(--success)" href="/scanner">
      <div className="flex flex-col h-full">
        {TOP_MOVERS.map((m, i) => (
          <TickerRow
            key={m.ticker}
            rank={i + 1}
            ticker={m.ticker}
            value={`$${m.price.toFixed(2)}`}
            pct={m.changePct}
            onClick={() => openChartModal(m.ticker)}
          />
        ))}
      </div>
    </Widget>
  );
}

// ─── 2. Pre-Market Gappers ─────────────────────────────────────────────────────
const PM_GAPPERS = [
  { ticker: "SMCI", gapPct:  12.4, catalyst: "Earnings beat"   },
  { ticker: "MSTR", gapPct:   7.2, catalyst: "BTC +4%"         },
  { ticker: "COIN", gapPct:   5.9, catalyst: "Vol surge"        },
  { ticker: "RIVN", gapPct:  -6.1, catalyst: "Delivery miss"   },
  { ticker: "PARA", gapPct:  -4.3, catalyst: "Downgrade"        },
];

function PreMarketGappers() {
  const { openChartModal } = useTicker();
  return (
    <Widget title="Pre-Market" sub="Gappers" accent="#F59E0B" href="/pre-market">
      <div className="flex flex-col h-full">
        {PM_GAPPERS.map((g, i) => (
          <TickerRow
            key={g.ticker}
            rank={i + 1}
            ticker={g.ticker}
            sub={g.catalyst}
            pct={g.gapPct}
            onClick={() => openChartModal(g.ticker)}
          />
        ))}
      </div>
    </Widget>
  );
}

// ─── 3. Day 2/3 Watchlist ─────────────────────────────────────────────────────
const DAY23 = [
  { ticker: "NVDA", day: 2, thesis: "Held $860 — continuation setup",       pct:  2.14 },
  { ticker: "PLTR", day: 3, thesis: "Building flag pattern above $24",       pct:  1.88 },
  { ticker: "SMCI", day: 2, thesis: "Earnings gap fill in progress",         pct: -1.45 },
  { ticker: "AMD",  day: 3, thesis: "Inside day after MI300X ramp news",     pct:  0.61 },
  { ticker: "RIVN", day: 2, thesis: "Post-delivery miss — watching PDL",     pct: -3.20 },
];

const DAY_BADGE: Record<number, { bg: string; color: string }> = {
  2: { bg: "rgba(245,158,11,0.2)",  color: "#F59E0B" },
  3: { bg: "rgba(239,68,68,0.18)", color: "#EF4444"  },
};

function Day23Watch() {
  const { openChartModal } = useTicker();
  return (
    <Widget title="Day 2/3" sub="Watch" accent="#F59E0B" href="/day2-watch">
      <div className="flex flex-col h-full">
        {DAY23.map((d) => (
          <TickerRow
            key={d.ticker}
            ticker={d.ticker}
            sub={d.thesis}
            pct={d.pct}
            badge={`D${d.day}`}
            badgeColor={DAY_BADGE[d.day].bg}
            onClick={() => openChartModal(d.ticker)}
          />
        ))}
      </div>
    </Widget>
  );
}

// ─── 4. Sector Heat Map ────────────────────────────────────────────────────────
const SECTORS = [
  { etf: "XLK",  name: "Tech",      pct:  1.42 },
  { etf: "XLF",  name: "Fin",       pct:  0.81 },
  { etf: "XLE",  name: "Energy",    pct: -0.54 },
  { etf: "XLV",  name: "Health",    pct:  0.23 },
  { etf: "XLI",  name: "Indust",    pct:  0.65 },
  { etf: "XLY",  name: "Discret",   pct:  1.18 },
  { etf: "XLP",  name: "Staples",   pct: -0.11 },
  { etf: "XLU",  name: "Utils",     pct: -0.78 },
  { etf: "XLB",  name: "Materials", pct:  0.34 },
  { etf: "XLRE", name: "Real Est",  pct: -0.42 },
  { etf: "XLC",  name: "Comm",      pct:  0.97 },
];

function heatBg(pct: number) {
  const t = Math.min(Math.abs(pct) / 2, 1);
  return pct >= 0
    ? `rgba(16,185,129,${0.1 + t * 0.65})`
    : `rgba(239,68,68,${0.1 + t * 0.65})`;
}

function SectorHeatMap() {
  return (
    <Widget title="Sectors" sub="Heat" accent="var(--primary-bright)" href="/sector-heat-map">
      <div className="grid grid-cols-4 gap-1.5 p-3 h-full content-start">
        {SECTORS.map((s) => {
          const up = s.pct >= 0;
          return (
            <div
              key={s.etf}
              className="flex flex-col items-center justify-center rounded-lg py-2 px-1 cursor-pointer transition-opacity hover:opacity-80"
              style={{ background: heatBg(s.pct) }}
            >
              <span className="num text-[10px] font-bold" style={{ color: "var(--text-primary)" }}>{s.etf}</span>
              <span className="num text-[11px] font-bold mt-0.5" style={{ color: up ? "var(--success)" : "var(--danger)" }}>
                {up ? "+" : ""}{s.pct.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </Widget>
  );
}

// ─── 5. Admin Watchlist ────────────────────────────────────────────────────────
const ADMIN_WATCH = [
  { ticker: "NVDA", price: 875.42, changePct:  2.14, note: "AI compute supercycle — HC",  hc: true  },
  { ticker: "AMD",  price: 172.33, changePct:  2.72, note: "MI300X ramp confirmed",        hc: true  },
  { ticker: "MSTR", price: 1640.5, changePct:  5.69, note: "BTC proxy, watch $1600",       hc: false },
  { ticker: "PLTR", price:  24.87, changePct:  6.14, note: "AIP + gov contract momentum",  hc: false },
  { ticker: "SPY",  price: 523.88, changePct:  0.20, note: "521 key support level",         hc: false },
];

function AdminWatchlist() {
  const { openChartModal } = useTicker();
  return (
    <Widget title="Admin Watchlist" sub="Today's Watches" accent="var(--primary-bright)" href="/wap">
      <div className="flex flex-col h-full">
        {ADMIN_WATCH.map((w) => (
          <TickerRow
            key={w.ticker}
            ticker={w.ticker}
            sub={w.note}
            value={`$${w.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            pct={w.changePct}
            badge={w.hc ? "HC" : undefined}
            onClick={() => openChartModal(w.ticker)}
          />
        ))}
      </div>
    </Widget>
  );
}

// ─── 6. Options Flow ──────────────────────────────────────────────────────────
const OPTIONS_FLOW = [
  { ticker: "NVDA", type: "CALL", strike: 900,  expiry: "Mar 21", notional: "$4.2M", bull: true  },
  { ticker: "SPY",  type: "PUT",  strike: 510,  expiry: "Mar 21", notional: "$3.1M", bull: false },
  { ticker: "AMD",  type: "CALL", strike: 180,  expiry: "Apr 18", notional: "$2.7M", bull: true  },
  { ticker: "TSLA", type: "PUT",  strike: 230,  expiry: "Mar 28", notional: "$1.9M", bull: false },
  { ticker: "AAPL", type: "CALL", strike: 200,  expiry: "Apr 18", notional: "$1.4M", bull: true  },
];

function OptionsFlow() {
  const { openChartModal } = useTicker();
  return (
    <Widget title="Options Flow" sub="Unusual" accent="#F59E0B" href="/options-flow">
      <div className="flex flex-col h-full">
        {OPTIONS_FLOW.map((o, i) => {
          const color = o.bull ? "var(--success)" : "var(--danger)";
          const badgeBg = o.bull ? "rgba(16,185,129,0.18)" : "rgba(239,68,68,0.18)";
          return (
            <button
              key={i}
              onClick={() => openChartModal(o.ticker)}
              className="flex items-center w-full px-4 transition-colors"
              style={{ height: "44px", borderBottom: "1px solid rgba(45,36,98,0.5)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span
                className="num text-[10px] font-bold px-1.5 py-1 rounded shrink-0 mr-3"
                style={{ background: badgeBg, color, minWidth: "38px", textAlign: "center" }}
              >
                {o.type}
              </span>
              <span className="num text-[13px] font-bold flex-1 text-left" style={{ color: "var(--text-primary)" }}>
                {o.ticker}
              </span>
              <div className="flex items-center gap-3 shrink-0">
                <span className="num text-[11px]" style={{ color: "var(--text-muted)" }}>
                  ${o.strike} · {o.expiry}
                </span>
                <span className="num text-[13px] font-bold" style={{ color }}>
                  {o.notional}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </Widget>
  );
}

// ─── 7. SPY / IWM Trend Tracker ───────────────────────────────────────────────
const TREND_DATA = [
  { symbol: "SPY", price: 523.88, vwap: 521.44, aboveVwap: true,  vwapDelta:  0.47, sessionPct:  0.20 },
  { symbol: "IWM", price: 208.42, vwap: 207.10, aboveVwap: true,  vwapDelta:  0.64, sessionPct:  0.31 },
  { symbol: "QQQ", price: 448.31, vwap: 446.80, aboveVwap: true,  vwapDelta:  0.34, sessionPct:  0.44 },
  { symbol: "VIX", price:  14.82, vwap:  15.11, aboveVwap: false, vwapDelta: -1.92, sessionPct: -2.18 },
];

function SpyIwmTracker() {
  const { openChartModal } = useTicker();
  return (
    <Widget title="SPY / IWM" sub="Trend" accent="var(--success)" href="/hub">
      <div className="flex flex-col h-full">
        {TREND_DATA.map((s) => {
          const sessionUp = s.sessionPct >= 0;
          const sessionColor = s.symbol === "VIX"
            ? (s.sessionPct >= 0 ? "var(--danger)" : "var(--success)")
            : (sessionUp ? "var(--success)" : "var(--danger)");
          const TrendIcon = s.aboveVwap ? TrendingUp : TrendingDown;
          const trendColor = s.symbol === "VIX"
            ? (s.aboveVwap ? "var(--danger)" : "var(--success)")
            : (s.aboveVwap ? "var(--success)" : "var(--danger)");

          return (
            <button
              key={s.symbol}
              onClick={() => openChartModal(s.symbol)}
              className="flex items-center w-full px-4 transition-colors"
              style={{ height: "44px", borderBottom: "1px solid rgba(45,36,98,0.5)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <TrendIcon size={14} style={{ color: trendColor, marginRight: "10px", flexShrink: 0 }} />
              <span className="num text-[13px] font-bold" style={{ color: "var(--text-primary)", minWidth: "38px" }}>
                {s.symbol}
              </span>
              <span className="num text-[12px] flex-1 text-left" style={{ color: "var(--text-secondary)" }}>
                ${s.price.toFixed(2)}
              </span>
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1">
                  <span className="text-[9px] uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>VWAP</span>
                  <span className="num text-[11px] font-bold" style={{ color: trendColor }}>
                    {s.aboveVwap ? "▲" : "▼"} {Math.abs(s.vwapDelta).toFixed(2)}%
                  </span>
                </div>
                <span className="num text-[13px] font-bold" style={{ color: sessionColor, minWidth: "52px", textAlign: "right" }}>
                  {s.sessionPct >= 0 ? "+" : ""}{s.sessionPct.toFixed(2)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </Widget>
  );
}

// ─── 8. Form 4 Highlights ─────────────────────────────────────────────────────
const FORM4 = [
  { ticker: "NVDA", insider: "Jensen Huang",  role: "CEO",  type: "BUY",  shares: "50K",  value: "$43.7M" },
  { ticker: "PLTR", insider: "Alex Karp",      role: "CEO",  type: "SELL", shares: "120K", value: "$3.0M"  },
  { ticker: "MSTR", insider: "M. Saylor",      role: "Exec", type: "BUY",  shares: "2.5K", value: "$4.1M"  },
  { ticker: "AMD",  insider: "Lisa Su",        role: "CEO",  type: "SELL", shares: "30K",  value: "$5.2M"  },
  { ticker: "TSLA", insider: "Elon Musk",      role: "CEO",  type: "BUY",  shares: "175K", value: "$42.5M" },
];

function Form4Highlights() {
  const { openChartModal } = useTicker();
  return (
    <Widget title="Form 4" sub="Insider" accent="var(--primary-bright)" href="/form4">
      <div className="flex flex-col h-full">
        {FORM4.map((f, i) => {
          const isBuy = f.type === "BUY";
          const color = isBuy ? "var(--success)" : "var(--danger)";
          const bg    = isBuy ? "rgba(16,185,129,0.18)" : "rgba(239,68,68,0.18)";
          return (
            <button
              key={i}
              onClick={() => openChartModal(f.ticker)}
              className="flex items-center w-full px-4 transition-colors"
              style={{ height: "44px", borderBottom: "1px solid rgba(45,36,98,0.5)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span
                className="num text-[10px] font-bold px-1.5 py-1 rounded shrink-0 mr-3"
                style={{ background: bg, color, minWidth: "34px", textAlign: "center" }}
              >
                {f.type}
              </span>
              <span className="num text-[13px] font-bold shrink-0 mr-2" style={{ color: "var(--text-primary)", minWidth: "38px" }}>
                {f.ticker}
              </span>
              <span className="text-[11px] truncate flex-1 text-left" style={{ color: "var(--text-muted)" }}>
                {f.insider} · {f.role}
              </span>
              <span className="num text-[13px] font-bold shrink-0" style={{ color }}>
                {f.value}
              </span>
            </button>
          );
        })}
      </div>
    </Widget>
  );
}

// ─── Grid ──────────────────────────────────────────────────────────────────────
export function HubWidgetGrid() {
  return (
    <div className="grid grid-cols-4 grid-rows-2 h-full gap-3 p-3">
      <TopMovers />
      <PreMarketGappers />
      <Day23Watch />
      <SectorHeatMap />
      <AdminWatchlist />
      <OptionsFlow />
      <SpyIwmTracker />
      <Form4Highlights />
    </div>
  );
}
