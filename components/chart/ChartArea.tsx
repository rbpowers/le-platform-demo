"use client";

import { useState } from "react";
import { LayoutGrid, Maximize, LayoutDashboard } from "lucide-react";
import { ChartViewport } from "./ChartViewport";
import { HubWidgetGrid } from "@/components/hub/HubWidgetGrid";
import { useTicker } from "@/lib/TickerContext";

const QUAD_TICKERS = ["NVDA", "TSLA", "AMD", "SPY"];

type Mode = "single" | "quad" | "widgets";

const MODES: { id: Mode; icon: React.ElementType; label: string; title: string }[] = [
  { id: "single",  icon: Maximize,       label: "1×1",     title: "Single chart"  },
  { id: "quad",    icon: LayoutGrid,      label: "2×2",     title: "2×2 grid"      },
  { id: "widgets", icon: LayoutDashboard, label: "Widgets", title: "Hub widgets"   },
];

export function ChartArea() {
  const { activeTicker } = useTicker();
  const [mode, setMode] = useState<Mode>("single");

  return (
    <div className="flex flex-col h-full gap-0">
      {/* Mode toggle bar */}
      <div
        className="flex items-center justify-end gap-1 px-2 shrink-0"
        style={{ height: "30px" }}
      >
        {MODES.map(({ id, icon: Icon, label, title }) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            title={title}
            className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold transition-colors"
            style={{
              background: mode === id ? "rgba(76,29,149,0.25)" : "transparent",
              color: mode === id ? "var(--primary-bright)" : "var(--text-muted)",
              border: `1px solid ${mode === id ? "var(--primary)" : "transparent"}`,
            }}
          >
            <Icon size={11} />
            {label}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="flex-1 min-h-0">
        {mode === "single" && <ChartViewport ticker={activeTicker} />}
        {mode === "quad" && (
          <div className="grid grid-cols-2 grid-rows-2 h-full gap-1.5">
            {QUAD_TICKERS.map((t) => (
              <ChartViewport key={t} ticker={t} compact />
            ))}
          </div>
        )}
        {mode === "widgets" && <HubWidgetGrid />}
      </div>
    </div>
  );
}
