"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const COLLAPSED_W = 32; // px width of a collapsed side panel

interface ResizablePanelsProps {
  children: [React.ReactNode, React.ReactNode, React.ReactNode];
  /** Initial widths as percentages — must sum to 100 */
  initialWidths?: [number, number, number];
  /** Minimum widths as percentages for each column */
  minWidths?: [number, number, number];
  /** When true, right panel collapses to a 32 px strip and divider 1 is hidden */
  rightCollapsed?: boolean;
}

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

export function ResizablePanels({
  children,
  initialWidths = [25, 50, 25],
  minWidths = [12, 28, 12],
  rightCollapsed = false,
}: ResizablePanelsProps) {
  const [widths, setWidths]       = useState<[number, number, number]>(initialWidths);
  const [activeHandle, setActive] = useState<0 | 1 | null>(null);
  const containerRef  = useRef<HTMLDivElement>(null);
  const dragging      = useRef<0 | 1 | null>(null);
  const dragStartX    = useRef(0);
  const dragStartW    = useRef<[number, number, number]>([...initialWidths]);
  const isDragging    = useRef(false);

  const startDrag = useCallback((divider: 0 | 1, e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current   = divider;
    dragStartX.current = e.clientX;
    dragStartW.current = [...widths] as [number, number, number];
    isDragging.current = true;
    setActive(divider);
    document.body.style.cursor     = "col-resize";
    document.body.style.userSelect = "none";
  }, [widths]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dragging.current === null || !containerRef.current) return;
      const cw       = containerRef.current.offsetWidth;
      const dPct     = ((e.clientX - dragStartX.current) / cw) * 100;
      const s        = dragStartW.current;
      let next: [number, number, number];

      if (dragging.current === 0) {
        const newLeft   = clamp(s[0] + dPct, minWidths[0], 100 - minWidths[1] - s[2]);
        const newCenter = s[0] + s[1] - newLeft;
        next = [newLeft, newCenter, s[2]];
      } else {
        const newRight  = clamp(s[2] - dPct, minWidths[2], 100 - s[0] - minWidths[1]);
        const newCenter = s[1] + s[2] - newRight;
        next = [s[0], newCenter, newRight];
      }
      setWidths(next);
    };

    const onUp = () => {
      if (!isDragging.current) return;
      dragging.current   = null;
      isDragging.current = false;
      setActive(null);
      document.body.style.cursor     = "";
      document.body.style.userSelect = "";
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
    };
  }, [minWidths]);

  // ── Collapsed layout: left% | divider0 | flex:1 | (no divider1) | 32px ──────
  if (rightCollapsed) {
    return (
      <div ref={containerRef} className="flex h-full w-full overflow-hidden">
        <div className="h-full overflow-hidden shrink-0"
          style={{ width: `${widths[0]}%`, transition: "width 0.2s ease" }}>
          {children[0]}
        </div>
        <Divider
          active={activeHandle === 0}
          onMouseDown={(e) => startDrag(0, e)}
          onMouseEnter={() => !isDragging.current && setActive(0)}
          onMouseLeave={() => !isDragging.current && setActive(null)}
        />
        <div className="h-full overflow-hidden flex-1 min-w-0">
          {children[1]}
        </div>
        {/* Collapsed right strip — no divider, no resize */}
        <div className="h-full shrink-0 overflow-hidden"
          style={{ width: `${COLLAPSED_W}px`, transition: "width 0.25s ease" }}>
          {children[2]}
        </div>
      </div>
    );
  }

  // ── Normal 3-column layout ────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="flex h-full w-full overflow-hidden">
      <div className="h-full overflow-hidden shrink-0"
        style={{ width: `${widths[0]}%`, transition: "width 0.2s ease" }}>
        {children[0]}
      </div>

      <Divider
        active={activeHandle === 0}
        onMouseDown={(e) => startDrag(0, e)}
        onMouseEnter={() => !isDragging.current && setActive(0)}
        onMouseLeave={() => !isDragging.current && setActive(null)}
      />

      <div className="h-full overflow-hidden shrink-0"
        style={{ width: `${widths[1]}%`, transition: "width 0.2s ease" }}>
        {children[1]}
      </div>

      <Divider
        active={activeHandle === 1}
        onMouseDown={(e) => startDrag(1, e)}
        onMouseEnter={() => !isDragging.current && setActive(1)}
        onMouseLeave={() => !isDragging.current && setActive(null)}
      />

      <div className="h-full overflow-hidden flex-1"
        style={{ width: `${widths[2]}%`, transition: "width 0.2s ease" }}>
        {children[2]}
      </div>
    </div>
  );
}

function Divider({
  active, onMouseDown, onMouseEnter, onMouseLeave,
}: {
  active: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      className="relative h-full shrink-0 flex items-center justify-center"
      style={{
        width: "5px",
        cursor: "col-resize",
        background: active ? "rgba(124,58,237,0.25)" : "var(--border)",
        transition: "background 0.15s",
        zIndex: 10,
      }}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div style={{
        width: "1px", height: "40px", borderRadius: "1px",
        background: active ? "var(--primary-bright)" : "var(--border-bright)",
        boxShadow: active ? "0 0 6px var(--primary-glow)" : "none",
        opacity: active ? 1 : 0.4,
        transition: "background 0.15s, box-shadow 0.15s, opacity 0.15s",
      }} />
    </div>
  );
}
