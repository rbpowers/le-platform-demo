"use client";

import { useState, useEffect, useRef } from "react";
import { Wifi, WifiOff, Loader2, Clock, Search, X } from "lucide-react";
import type { ConnectionStatus, MarketSession, MarketTicker } from "@/lib/types";

// ─── Market session ────────────────────────────────────────────────────────────
function getSession(etDate: Date): MarketSession {
  const h = etDate.getHours();
  const m = etDate.getMinutes();
  const t = h * 60 + m;
  if (t >= 4 * 60 && t < 9 * 60 + 30)  return "pre-market";
  if (t >= 9 * 60 + 30 && t < 16 * 60) return "regular";
  if (t >= 16 * 60 && t < 20 * 60)     return "after-hours";
  return "closed";
}

const SESSION_CONFIG: Record<MarketSession, { label: string; color: string; bg: string }> = {
  "regular":     { label: "Market Open",   color: "#10B981", bg: "rgba(16,185,129,0.12)" },
  "pre-market":  { label: "Pre-Market",    color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
  "after-hours": { label: "After-Hours",   color: "#7C3AED", bg: "rgba(124,58,237,0.15)" },
  "closed":      { label: "Market Closed", color: "#7C6FA8", bg: "rgba(124,111,168,0.1)" },
};

// ─── Sparkline SVG ─────────────────────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;
  const W = 44, H = 18;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * W;
      const y = H - ((v - min) / range) * (H - 2) - 1;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={W} height={H} style={{ display: "block" }}>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── Market ticker pill ────────────────────────────────────────────────────────
function MarketPill({ t }: { t: MarketTicker }) {
  const up = t.changePct >= 0;
  const color = t.symbol === "VIX"
    ? (t.changePct >= 0 ? "var(--danger)" : "var(--success)")  // VIX inverse
    : (up ? "var(--success)" : "var(--danger)");

  return (
    <div
      className="flex items-center gap-2 px-2.5 py-1 rounded-lg border"
      style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.03)" }}
    >
      <div className="flex flex-col">
        <span className="text-[10px] font-bold tracking-wide" style={{ color: "var(--text-muted)" }}>
          {t.symbol}
        </span>
        <span className="num text-[12px] font-semibold leading-none" style={{ color: "var(--text-primary)" }}>
          {t.price.toFixed(2)}
        </span>
      </div>
      <Sparkline data={t.history} color={color} />
      <span className="num text-[11px] font-semibold" style={{ color }}>
        {up ? "+" : ""}{t.changePct.toFixed(2)}%
      </span>
    </div>
  );
}

// ─── WS connection badge ───────────────────────────────────────────────────────
function ConnectionPill({ status }: { status: ConnectionStatus }) {
  const cfg = {
    connected:    { Icon: Wifi,     label: "Live",       color: "var(--success)", bg: "rgba(16,185,129,0.1)"  },
    connecting:   { Icon: Loader2,  label: "Connecting", color: "var(--warning)", bg: "rgba(245,158,11,0.1)"  },
    disconnected: { Icon: WifiOff,  label: "Offline",    color: "var(--danger)",  bg: "rgba(239,68,68,0.1)"   },
  }[status];
  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      <cfg.Icon size={11} className={status === "connecting" ? "animate-spin" : ""} />
      {cfg.label}
    </div>
  );
}

// ─── Seed sparkline history ────────────────────────────────────────────────────
const SEED_TICKERS: Omit<MarketTicker, "history">[] = [
  { symbol: "SPY", price: 523.88, change: 1.05,   changePct: 0.20 },
  { symbol: "IWM", price: 208.42, change: 0.64,   changePct: 0.31 },
  { symbol: "VIX", price: 14.82,  change: -0.33,  changePct: -2.18 },
];

function seedHistory(base: number, n = 20): number[] {
  let v = base * 0.995;
  return Array.from({ length: n }, () => {
    v += (Math.random() - 0.48) * base * 0.002;
    return parseFloat(v.toFixed(2));
  });
}

// ─── Component ────────────────────────────────────────────────────────────────
export function TopStatusBar() {
  const [time, setTime] = useState("");
  const [session, setSession] = useState<MarketSession>("regular");
  const [wsStatus] = useState<ConnectionStatus>("connecting");
  // Initialize with a flat (deterministic) history so server HTML and client
  // hydration produce identical output. Random history is seeded after mount.
  const [marketTickers, setMarketTickers] = useState<MarketTicker[]>(
    SEED_TICKERS.map((t) => ({ ...t, history: Array<number>(20).fill(t.price) }))
  );
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Seed sparkline history on the client only (avoids SSR/hydration mismatch)
  useEffect(() => {
    setMarketTickers(SEED_TICKERS.map((t) => ({ ...t, history: seedHistory(t.price) })));
  }, []);

  // Clock + session
  useEffect(() => {
    const tick = () => {
      const etStr = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
      const etDate = new Date(etStr);
      setTime(
        etDate.toLocaleTimeString("en-US", {
          hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
        })
      );
      setSession(getSession(etDate));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Market ticker simulation
  useEffect(() => {
    const id = setInterval(() => {
      setMarketTickers((prev) =>
        prev.map((t) => {
          const delta = (Math.random() - 0.489) * t.price * 0.0012;
          const newPrice = parseFloat((t.price + delta).toFixed(2));
          const base = t.price - t.change;
          const newChange = parseFloat((newPrice - base).toFixed(2));
          const newPct = parseFloat(((newChange / base) * 100).toFixed(2));
          const newHistory = [...t.history.slice(1), newPrice];
          return { ...t, price: newPrice, change: newChange, changePct: newPct, history: newHistory };
        })
      );
    }, 1800);
    return () => clearInterval(id);
  }, []);

  const sessionCfg = SESSION_CONFIG[session];

  return (
    <header
      className="flex items-center justify-between px-4 shrink-0 border-b z-10 gap-4"
      style={{ height: "48px", background: "var(--sidebar-bg)", borderColor: "var(--border)" }}
    >
      {/* Left: session + market tickers */}
      <div className="flex items-center gap-3">
        {/* Session badge */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0"
          style={{ color: sessionCfg.color, background: sessionCfg.bg }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: sessionCfg.color, boxShadow: `0 0 5px ${sessionCfg.color}` }}
          />
          {sessionCfg.label}
        </div>

        {/* SPY / IWM / VIX */}
        {marketTickers.map((t) => <MarketPill key={t.symbol} t={t} />)}
      </div>

      {/* Right: WS + clock + search */}
      <div className="flex items-center gap-3 shrink-0">
        <ConnectionPill status={wsStatus} />

        <div className="flex items-center gap-1.5 num text-[11px]" style={{ color: "var(--text-muted)" }}>
          <Clock size={11} />
          {time} ET
        </div>

        {/* Quick search */}
        <div
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-all"
          style={{
            background: focused ? "var(--bg-card)" : "var(--bg-base)",
            borderColor: focused ? "var(--primary-bright)" : "var(--border)",
            width: focused ? "200px" : "164px",
          }}
        >
          <Search size={12} style={{ color: "var(--text-muted)" }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value.toUpperCase())}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search ticker…"
            maxLength={6}
            className="flex-1 bg-transparent outline-none num text-[12px] placeholder:text-[var(--text-muted)]"
            style={{ color: "var(--text-primary)" }}
          />
          {query && (
            <button onClick={() => { setQuery(""); inputRef.current?.focus(); }}>
              <X size={11} style={{ color: "var(--text-muted)" }} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
