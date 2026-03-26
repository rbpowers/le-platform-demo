"use client";

import { useEffect, useRef, useState } from "react";
import {
  createChart,
  type IChartApi,
  type ISeriesApi,
  type CandlestickData,
  type UTCTimestamp,
  ColorType,
  CrosshairMode,
  LineStyle,
  CandlestickSeries,
  LineSeries,
} from "lightweight-charts";
import { Maximize2 } from "lucide-react";
import { useTicker } from "@/lib/TickerContext";

// ─── EMA spec per OVERVIEW.md §4.2 ────────────────────────────────────────────
const EMA_CONFIG = [
  { period: 8,   color: "#7C3AED", lineWidth: 2 as const, label: "8"   },
  { period: 20,  color: "#3B82F6", lineWidth: 2 as const, label: "20"  },
  { period: 200, color: "#10B981", lineWidth: 2 as const, label: "200" },
];

function calcEMA(
  data: CandlestickData<UTCTimestamp>[],
  period: number
): { time: UTCTimestamp; value: number }[] {
  const k = 2 / (period + 1);
  const result: { time: UTCTimestamp; value: number }[] = [];
  let ema = 0;
  data.forEach((d, i) => {
    ema = i === 0 ? d.close : d.close * k + ema * (1 - k);
    if (i >= period - 1)
      result.push({ time: d.time, value: parseFloat(ema.toFixed(2)) });
  });
  return result;
}

// ─── Deterministic OHLC generator ────────────────────────────────────────────
function generateMockOHLC(ticker: string): CandlestickData<UTCTimestamp>[] {
  let seed = 0;
  for (let i = 0; i < ticker.length; i++) seed = (seed * 31 + ticker.charCodeAt(i)) % 9973;
  const data: CandlestickData<UTCTimestamp>[] = [];
  let price = 50 + (seed % 900);
  const now = new Date();

  for (let i = 119; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    const ts = (d.getTime() / 1000) as UTCTimestamp;
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const open  = price;
    const move  = ((seed % 1000) / 1000 - 0.47) * price * 0.025;
    const close = parseFloat((open + move).toFixed(2));
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const high  = parseFloat((Math.max(open, close) + (seed % 100) / 100 * price * 0.008).toFixed(2));
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const low   = parseFloat((Math.min(open, close) - (seed % 100) / 100 * price * 0.008).toFixed(2));
    data.push({ time: ts, open, high, low, close });
    price = close;
  }
  return data;
}

// ─── Extract key levels from mock OHLC ────────────────────────────────────────
function extractKeyLevels(data: CandlestickData<UTCTimestamp>[]) {
  if (data.length < 2) return null;
  const prev = data[data.length - 2];
  const pdh  = prev.high;
  const pdl  = prev.low;
  const pmh  = parseFloat((prev.close * 1.008).toFixed(2));
  const pml  = parseFloat((prev.close * 0.992).toFixed(2));
  return { pdh, pdl, pmh, pml };
}

interface ChartViewportProps {
  ticker?: string;
  compact?: boolean;
}

export function ChartViewport({ ticker: tickerProp, compact = false }: ChartViewportProps) {
  const { activeTicker } = useTicker();
  const ticker = tickerProp ?? activeTicker;

  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef     = useRef<IChartApi | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const emaRefs      = useRef<Record<number, ISeriesApi<"Line", any>>>({});
  const [toggledEMAs, setToggledEMAs] = useState<Set<number>>(new Set([8, 20, 200]));

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width:  containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      layout: {
        background: { type: ColorType.Solid, color: "#0F0A1E" },
        textColor: "#7C6FA8",
      },
      grid: {
        vertLines: { color: "#1E1B4B" },
        horzLines: { color: "#1E1B4B" },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: "#7C3AED", labelBackgroundColor: "#4C1D95" },
        horzLine: { color: "#7C3AED", labelBackgroundColor: "#4C1D95" },
      },
      rightPriceScale: { borderColor: "#2D2462" },
      timeScale:       { borderColor: "#2D2462", timeVisible: true },
    });
    chartRef.current = chart;

    const candles = chart.addSeries(CandlestickSeries, {
      upColor:         "#10B981",
      downColor:       "#EF4444",
      borderUpColor:   "#10B981",
      borderDownColor: "#EF4444",
      wickUpColor:     "#10B981",
      wickDownColor:   "#EF4444",
    });

    const ohlc = generateMockOHLC(ticker);
    candles.setData(ohlc);

    // ── Key level lines (§4.3) ────────────────────────────────────────────────
    const levels = extractKeyLevels(ohlc);
    if (levels) {
      const { pdh, pdl, pmh, pml } = levels;
      // PDH / PDL — dashed orange
      candles.createPriceLine({ price: pdh, color: "#F97316", lineWidth: 1, lineStyle: LineStyle.Dashed, axisLabelVisible: true, title: "PDH" });
      candles.createPriceLine({ price: pdl, color: "#F97316", lineWidth: 1, lineStyle: LineStyle.Dashed, axisLabelVisible: true, title: "PDL" });
      // PMH / PML — dashed yellow
      candles.createPriceLine({ price: pmh, color: "#FBBF24", lineWidth: 1, lineStyle: LineStyle.Dashed, axisLabelVisible: true, title: "PMH" });
      candles.createPriceLine({ price: pml, color: "#FBBF24", lineWidth: 1, lineStyle: LineStyle.Dashed, axisLabelVisible: true, title: "PML" });
    }

    // ── EMA overlays (§4.2) ───────────────────────────────────────────────────
    emaRefs.current = {};
    EMA_CONFIG.forEach(({ period, color, lineWidth }) => {
      const line = chart.addSeries(LineSeries, {
        color,
        lineWidth,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      line.setData(calcEMA(ohlc, period));
      emaRefs.current[period] = line;
      line.applyOptions({ visible: toggledEMAs.has(period) });
    });

    chart.timeScale().fitContent();

    const ro = new ResizeObserver(() => {
      if (containerRef.current) {
        chart.applyOptions({
          width:  containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    });
    ro.observe(containerRef.current);

    return () => { ro.disconnect(); chart.remove(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticker]);

  useEffect(() => {
    Object.entries(emaRefs.current).forEach(([p, s]) =>
      s?.applyOptions({ visible: toggledEMAs.has(parseInt(p)) })
    );
  }, [toggledEMAs]);

  const toggleEMA = (period: number) =>
    setToggledEMAs((prev) => {
      const next = new Set(prev);
      next.has(period) ? next.delete(period) : next.add(period);
      return next;
    });

  const openFullscreen = () =>
    window.open(`/chart/${ticker}`, `chart-${ticker}`, "width=1280,height=860,menubar=no,toolbar=no");

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "#0F0A1E", border: "1px solid var(--border)", borderRadius: "0.5rem" }}
    >
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-3 shrink-0 border-b"
        style={{ borderColor: "var(--border)", height: compact ? "30px" : "36px" }}
      >
        <div className="flex items-center gap-2">
          <span className="num font-bold text-[13px]" style={{ color: "var(--primary-bright)" }}>
            {ticker}
          </span>
          {!compact && (
            <div className="flex items-center gap-1">
              {EMA_CONFIG.map(({ period, color, label }) => {
                const active = toggledEMAs.has(period);
                return (
                  <button
                    key={period}
                    onClick={() => toggleEMA(period)}
                    className="px-1.5 py-0.5 rounded border text-[10px] font-bold transition-all"
                    style={{
                      color,
                      borderColor: color,
                      background: active ? `${color}22` : "transparent",
                      opacity: active ? 1 : 0.3,
                    }}
                  >
                    EMA{label}
                  </button>
                );
              })}
              {/* Key level legend */}
              <div className="flex items-center gap-2 ml-2 pl-2 border-l" style={{ borderColor: "var(--border)" }}>
                <span className="text-[10px]" style={{ color: "#F97316" }}>— PDH/PDL</span>
                <span className="text-[10px]" style={{ color: "#FBBF24" }}>— PMH/PML</span>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={openFullscreen}
          title="Full-screen chart"
          className="flex items-center justify-center w-5 h-5 rounded hover:opacity-70 transition-opacity"
          style={{ color: "var(--text-muted)" }}
        >
          <Maximize2 size={11} />
        </button>
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="flex-1 w-full min-h-0" />
    </div>
  );
}
