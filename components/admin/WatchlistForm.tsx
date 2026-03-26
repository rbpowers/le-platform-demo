"use client";

import { useState } from "react";
import { Pin, Loader2, CheckCircle2, XCircle } from "lucide-react";

interface PinnedTicker {
  ticker: string;
  pinnedAt: string;
}

export function WatchlistForm() {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [pinned, setPinned] = useState<PinnedTicker[]>([
    { ticker: "NVDA", pinnedAt: new Date().toISOString() },
    { ticker: "SPY", pinnedAt: new Date().toISOString() },
  ]);

  const handlePin = async (e: React.FormEvent) => {
    e.preventDefault();
    const ticker = input.trim().toUpperCase();
    if (!ticker || pinned.some((p) => p.ticker === ticker)) return;

    setStatus("loading");
    // Placeholder: replace with Supabase upsert
    await new Promise((r) => setTimeout(r, 800));

    setPinned((prev) => [{ ticker, pinnedAt: new Date().toISOString() }, ...prev]);
    setInput("");
    setStatus("success");
    setTimeout(() => setStatus("idle"), 2000);
  };

  const handleUnpin = (ticker: string) => {
    setPinned((prev) => prev.filter((p) => p.ticker !== ticker));
  };

  return (
    <div className="max-w-lg space-y-6">
      {/* Form */}
      <form onSubmit={handlePin} className="space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Pin Ticker to Global Watchlist
        </label>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            placeholder="e.g. AAPL"
            maxLength={6}
            className="flex-1 px-3 py-2 rounded-lg text-sm font-mono outline-none border transition-colors"
            style={{
              background: "var(--surface-elevated)",
              color: "var(--text-primary)",
              borderColor: "var(--border-bright)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--primary-bright)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border-bright)")}
          />
          <button
            type="submit"
            disabled={status === "loading" || !input.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
            style={{ background: "var(--primary)", color: "#fff" }}
          >
            {status === "loading" ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Pin size={14} />
            )}
            Pin
          </button>
        </div>
        {status === "success" && (
          <p className="flex items-center gap-1.5 text-xs" style={{ color: "var(--success)" }}>
            <CheckCircle2 size={12} /> Ticker pinned to watchlist.
          </p>
        )}
        {status === "error" && (
          <p className="flex items-center gap-1.5 text-xs" style={{ color: "var(--danger)" }}>
            <XCircle size={12} /> Failed to pin ticker.
          </p>
        )}
      </form>

      {/* Pinned list */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Pinned ({pinned.length})
        </p>
        {pinned.length === 0 && (
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>No tickers pinned yet.</p>
        )}
        {pinned.map((p) => (
          <div
            key={p.ticker}
            className="flex items-center justify-between px-3 py-2 rounded-lg border"
            style={{ background: "var(--surface-elevated)", borderColor: "var(--border)" }}
          >
            <div className="flex items-center gap-3">
              <Pin size={13} style={{ color: "var(--primary-bright)" }} />
              <span className="font-mono font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                {p.ticker}
              </span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {new Date(p.pinnedAt).toLocaleDateString()}
              </span>
            </div>
            <button
              onClick={() => handleUnpin(p.ticker)}
              className="text-xs px-2 py-0.5 rounded"
              style={{ color: "var(--danger)", background: "rgba(239,68,68,0.08)" }}
            >
              Unpin
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
