"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, GripHorizontal } from "lucide-react";
import { useTicker } from "@/lib/TickerContext";
import { ChartViewport } from "./ChartViewport";

// ─── Mock ticker metadata ──────────────────────────────────────────────────────
const COMPANY_MAP: Record<string, { name: string; price: number; changePct: number }> = {
  NVDA: { name: "NVIDIA Corporation",      price: 875.42, changePct: 2.14  },
  TSLA: { name: "Tesla Inc",               price: 248.15, changePct: -2.63 },
  AMD:  { name: "Advanced Micro Devices",  price: 172.33, changePct: 2.72  },
  SPY:  { name: "SPDR S&P 500 ETF",        price: 523.88, changePct: 0.20  },
  AAPL: { name: "Apple Inc",               price: 212.67, changePct: -0.41 },
  META: { name: "Meta Platforms",          price: 507.21, changePct: 1.90  },
  QQQ:  { name: "Invesco QQQ Trust",       price: 447.60, changePct: 0.49  },
  MSFT: { name: "Microsoft Corp",          price: 420.10, changePct: -0.76 },
  MSTR: { name: "MicroStrategy Inc",       price: 1640.5, changePct: 5.69  },
  PLTR: { name: "Palantir Technologies",   price: 24.87,  changePct: 6.14  },
  COIN: { name: "Coinbase Global",         price: 198.33, changePct: -3.67 },
  SMCI: { name: "Super Micro Computer",    price: 88.21,  changePct: 4.88  },
};

const NEWS_MAP: Record<string, string> = {
  NVDA: "H200 allocation expands for hyperscalers",
  TSLA: "Q1 deliveries miss consensus by ~12k units",
  AMD:  "MI300X production ramp confirmed for H2",
  MSTR: "Adds 2,500 BTC to treasury, total now 214k",
  PLTR: "Wins $400M DoD contract expansion",
};

const DEFAULT_W = 880;
const DEFAULT_H = 560;

export function ChartModal() {
  const { activeTicker, chartModalOpen, closeChartModal } = useTicker();

  // ── Position (drag) ──────────────────────────────────────────────────────────
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragOrigin = useRef({ mx: 0, my: 0, ox: 0, oy: 0 });

  const onDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragOrigin.current = { mx: e.clientX, my: e.clientY, ox: pos.x, oy: pos.y };

    const onMove = (ev: MouseEvent) => {
      setPos({
        x: dragOrigin.current.ox + ev.clientX - dragOrigin.current.mx,
        y: dragOrigin.current.oy + ev.clientY - dragOrigin.current.my,
      });
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [pos]);

  // ── Size (resize) ────────────────────────────────────────────────────────────
  const [size, setSize] = useState({ w: DEFAULT_W, h: DEFAULT_H });
  const resizeOrigin = useRef({ mx: 0, my: 0, ow: 0, oh: 0 });

  const onResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    resizeOrigin.current = { mx: e.clientX, my: e.clientY, ow: size.w, oh: size.h };

    const onMove = (ev: MouseEvent) => {
      setSize({
        w: Math.max(520, resizeOrigin.current.ow + ev.clientX - resizeOrigin.current.mx),
        h: Math.max(360, resizeOrigin.current.oh + ev.clientY - resizeOrigin.current.my),
      });
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [size]);

  // Reset position when modal opens
  useEffect(() => {
    if (chartModalOpen) {
      setPos({ x: 0, y: 0 });
      setSize({ w: DEFAULT_W, h: DEFAULT_H });
    }
  }, [chartModalOpen]);

  // Escape key to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeChartModal(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeChartModal]);

  const meta      = COMPANY_MAP[activeTicker] ?? { name: activeTicker, price: 0, changePct: 0 };
  const news      = NEWS_MAP[activeTicker] ?? null;
  const up        = meta.changePct >= 0;
  const priceColor = up ? "var(--success)" : "var(--danger)";

  return (
    <AnimatePresence>
      {chartModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40"
            style={{ background: "rgba(5,3,15,0.72)", backdropFilter: "blur(2px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={closeChartModal}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            className="fixed z-50 flex flex-col rounded-xl overflow-hidden"
            style={{
              width: size.w,
              height: size.h,
              left: "50%",
              top: "50%",
              x: pos.x - size.w / 2,
              y: pos.y - size.h / 2,
              border: "1px solid var(--border-bright)",
              background: "var(--bg-base)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,58,237,0.2)",
            }}
            initial={{ opacity: 0, scale: 0.93, y: -24 - size.h / 2 }}
            animate={{ opacity: 1, scale: 1,    y: pos.y - size.h / 2 }}
            exit={{ opacity: 0, scale: 0.93 }}
            transition={{ type: "spring", stiffness: 340, damping: 30, mass: 0.8 }}
          >
            {/* ── Header / Drag handle ── */}
            <div
              className="flex items-center gap-3 px-4 shrink-0 border-b select-none cursor-grab active:cursor-grabbing"
              style={{ height: "52px", borderColor: "var(--border)", background: "var(--bg-card)" }}
              onMouseDown={onDragStart}
            >
              <GripHorizontal size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />

              {/* Ticker + company */}
              <div className="flex items-baseline gap-2 flex-1 min-w-0">
                <span className="num font-bold text-[15px]" style={{ color: "var(--primary-bright)" }}>
                  {activeTicker}
                </span>
                <span className="text-[12px] truncate" style={{ color: "var(--text-muted)" }}>
                  {meta.name}
                </span>
              </div>

              {/* Price + change */}
              <div className="flex items-baseline gap-2 shrink-0">
                <span className="num font-bold text-[15px]" style={{ color: "var(--text-primary)" }}>
                  {meta.price > 0 ? `$${meta.price.toFixed(2)}` : "—"}
                </span>
                <span className="num text-[12px] font-semibold" style={{ color: priceColor }}>
                  {up ? "+" : ""}{meta.changePct.toFixed(2)}%
                </span>
              </div>

              {/* News headline */}
              {news && (
                <div
                  className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md border max-w-[260px]"
                  style={{ borderColor: "rgba(124,58,237,0.25)", background: "rgba(124,58,237,0.08)" }}
                >
                  <span
                    className="text-[10px] truncate"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {news}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0 ml-1" onMouseDown={(e) => e.stopPropagation()}>
                <a
                  href={`/chart/${activeTicker}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Full-screen chart"
                  className="flex items-center justify-center w-7 h-7 rounded-lg hover:opacity-70 transition-opacity"
                  style={{ color: "var(--text-muted)" }}
                >
                  <ExternalLink size={13} />
                </a>
                <button
                  onClick={closeChartModal}
                  title="Close (Esc)"
                  className="flex items-center justify-center w-7 h-7 rounded-lg hover:opacity-70 transition-opacity"
                  style={{ color: "var(--text-muted)" }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* ── Chart ── */}
            <div className="flex-1 min-h-0 p-1.5">
              <ChartViewport ticker={activeTicker} />
            </div>

            {/* ── Resize handle ── */}
            <div
              className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
              style={{ touchAction: "none" }}
              onMouseDown={onResizeStart}
            >
              <svg
                width="12" height="12"
                viewBox="0 0 12 12"
                style={{ position: "absolute", bottom: 3, right: 3, opacity: 0.4 }}
              >
                <path d="M 2 10 L 10 2 M 5 10 L 10 5 M 8 10 L 10 8"
                  stroke="var(--text-muted)" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
