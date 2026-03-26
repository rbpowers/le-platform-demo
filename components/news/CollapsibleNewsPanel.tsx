"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NewsFeed } from "./NewsFeed";

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

export function CollapsibleNewsPanel({ collapsed, onToggle }: Props) {
  return (
    <div className="flex h-full w-full overflow-hidden" style={{ background: "var(--bg-card)" }}>
      {/* ── Expanded: full news feed ── */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            key="news-content"
            className="flex flex-col flex-1 min-w-0 h-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {/* Override the NewsFeed header to include the collapse button */}
            <div
              className="flex items-center justify-between px-3 h-9 shrink-0 border-b"
              style={{ borderColor: "var(--border)" }}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}>
                News
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                  style={{ background: "rgba(16,185,129,0.1)", color: "var(--success)" }}>
                  Benzinga
                </span>
                <button
                  onClick={onToggle}
                  title="Collapse news panel"
                  className="flex items-center justify-center w-5 h-5 rounded hover:opacity-70 transition-opacity"
                  style={{ color: "var(--text-muted)" }}
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
            {/* Feed — reuse NewsFeed but without its own header */}
            <NewsFeedBody />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Collapsed: 32 px strip with vertical "NEWS" label ── */}
      <AnimatePresence initial={false}>
        {collapsed && (
          <motion.div
            key="news-collapsed"
            className="flex flex-col items-center h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Toggle button at top */}
            <button
              onClick={onToggle}
              title="Expand news panel"
              className="flex items-center justify-center w-full shrink-0 hover:opacity-70 transition-opacity border-b"
              style={{ height: "36px", color: "var(--text-muted)", borderColor: "var(--border)" }}
            >
              <ChevronLeft size={13} />
            </button>

            {/* Vertical "NEWS" label */}
            <div className="flex flex-1 items-center justify-center">
              <span
                style={{
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                  textTransform: "uppercase",
                  letterSpacing: "0.25em",
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  userSelect: "none",
                }}
              >
                News
              </span>
            </div>

            {/* Benzinga dot at bottom */}
            <div className="flex items-center justify-center w-full shrink-0 mb-3">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--success)", boxShadow: "0 0 4px var(--success)" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Feed body without the header (header is owned by CollapsibleNewsPanel) ───
import { useTicker } from "@/lib/TickerContext";

interface NewsItem {
  id: number;
  time: string;
  headline: string;
  tickers: string[];
  category: "bullish" | "bearish" | "neutral";
}

const MOCK_NEWS: NewsItem[] = [
  { id: 1,  time: "09:47", headline: "{NVDA} announces expanded H200 allocation for hyperscalers",      tickers: ["NVDA"],       category: "bullish" },
  { id: 2,  time: "09:41", headline: "Fed minutes signal 'patient' approach — {SPY} {QQQ} react",       tickers: ["SPY","QQQ"],  category: "neutral" },
  { id: 3,  time: "09:35", headline: "{TSLA} deliveries miss consensus by ~12k units in Q1",             tickers: ["TSLA"],       category: "bearish" },
  { id: 4,  time: "09:28", headline: "{AMD} MI300X production ramp confirmed for H2",                    tickers: ["AMD"],        category: "bullish" },
  { id: 5,  time: "09:21", headline: "{MSTR} adds 2,500 BTC to treasury, total now 214k",               tickers: ["MSTR"],       category: "bullish" },
  { id: 6,  time: "09:15", headline: "{AAPL} EU hits with €1.8B fine over App Store practices",         tickers: ["AAPL"],       category: "bearish" },
  { id: 7,  time: "09:09", headline: "{PLTR} wins $400M DoD contract expansion",                        tickers: ["PLTR"],       category: "bullish" },
  { id: 8,  time: "08:58", headline: "{META} AI Studio rolling out to 3M creators",                     tickers: ["META"],       category: "bullish" },
  { id: 9,  time: "08:46", headline: "{SMCI} delays 10-K filing again — auditor change flagged",        tickers: ["SMCI"],       category: "bearish" },
  { id: 10, time: "08:32", headline: "{COIN} BTC custody volumes up 34% QoQ — mgmt commentary",        tickers: ["COIN"],       category: "bullish" },
  { id: 11, time: "08:21", headline: "{MSFT} Azure growth re-accelerates to 31% YoY in cloud",         tickers: ["MSFT"],       category: "bullish" },
  { id: 12, time: "07:55", headline: "Pre-market: {SPY} futures flat ahead of CPI print at 8:30",      tickers: ["SPY"],        category: "neutral" },
];

const DOT: Record<string, string> = {
  bullish: "var(--success)", bearish: "var(--danger)", neutral: "var(--text-muted)",
};

function parseHeadline(h: string, tickers: string[], open: (t: string) => void) {
  const parts: React.ReactNode[] = [];
  let rem = h;
  for (const t of tickers) {
    const token = `{${t}}`;
    const idx = rem.indexOf(token);
    if (idx === -1) continue;
    if (idx > 0) parts.push(rem.slice(0, idx));
    parts.push(
      <button key={t} onClick={(e) => { e.stopPropagation(); open(t); }}
        className="inline-flex items-center px-1.5 rounded font-semibold hover:opacity-75 transition-opacity"
        style={{ background: "rgba(124,58,237,0.2)", color: "var(--primary-bright)",
                 fontFamily: "var(--font-jetbrains-mono)", fontSize: "11px", lineHeight: "inherit" }}>
        {t}
      </button>
    );
    rem = rem.slice(idx + token.length);
  }
  if (rem) parts.push(rem);
  return parts;
}

function NewsFeedBody() {
  const { openChartModal } = useTicker();
  return (
    <>
      <div className="flex-1 overflow-y-auto">
        {MOCK_NEWS.map((item) => (
          <div key={item.id}
            className="flex gap-2.5 px-3 py-2.5 border-b transition-colors hover:bg-[var(--bg-hover)] cursor-default"
            style={{ borderColor: "var(--border)" }}>
            <div className="pt-1 shrink-0">
              <div className="w-1.5 h-1.5 rounded-full"
                style={{ background: DOT[item.category], boxShadow: `0 0 4px ${DOT[item.category]}` }} />
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
      <div className="flex items-center justify-center border-t shrink-0"
        style={{ borderColor: "var(--border)", height: "36px" }}>
        <span className="text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: "var(--text-muted)" }}>
          Options Flow — Phase 3
        </span>
      </div>
    </>
  );
}
