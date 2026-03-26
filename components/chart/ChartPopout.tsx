"use client";

/**
 * Full-screen chart for the /chart/[ticker] pop-out window.
 * No sidebar, no nav — just the chart and EMA toolbar.
 * Wraps ChartViewport with a minimal chrome and a fake TickerProvider
 * so useTicker() doesn't throw outside of the dashboard layout.
 */

import { TickerProvider } from "@/lib/TickerContext";
import { ChartViewport } from "./ChartViewport";

interface Props {
  ticker: string;
}

export function ChartPopout({ ticker }: Props) {
  return (
    <TickerProvider>
      <div
        className="flex flex-col w-screen h-screen"
        style={{ background: "var(--bg-base)" }}
      >
        {/* Minimal title bar */}
        <div
          className="flex items-center justify-between px-4 shrink-0 border-b"
          style={{
            height: "40px",
            background: "var(--bg-card)",
            borderColor: "var(--border)",
          }}
        >
          <span className="num font-bold text-sm" style={{ color: "var(--primary-bright)" }}>
            {ticker}
          </span>
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            LE Trading Platform — Chart View
          </span>
        </div>

        {/* Full chart */}
        <div className="flex-1 p-2 min-h-0">
          <ChartViewport ticker={ticker} />
        </div>
      </div>
    </TickerProvider>
  );
}
