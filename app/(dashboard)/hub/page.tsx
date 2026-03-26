"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HubWidgetGrid } from "@/components/hub/HubWidgetGrid";
import { CollapsibleNewsPanel } from "@/components/news/CollapsibleNewsPanel";

export default function HubPage() {
  const [newsCollapsed, setNewsCollapsed] = useState(false);

  return (
    <motion.div
      className="h-full w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* ── Desktop: widgets + collapsible news side panel ── */}
      <div className="hidden lg:flex h-full overflow-hidden">
        <div className="flex-1 min-w-0 h-full overflow-hidden">
          <HubWidgetGrid />
        </div>
        <motion.div
          className="h-full shrink-0 overflow-hidden"
          animate={{ width: newsCollapsed ? 32 : 280 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
          style={{ borderLeft: "1px solid var(--border)" }}
        >
          <CollapsibleNewsPanel
            collapsed={newsCollapsed}
            onToggle={() => setNewsCollapsed((v) => !v)}
          />
        </motion.div>
      </div>

      {/* ── Mobile: stacked widgets, scrollable, no news panel (use News tab) ── */}
      <div
        className="lg:hidden h-full overflow-y-auto pb-16"
        style={{ background: "var(--bg-base)" }}
      >
        <HubWidgetGrid />
      </div>
    </motion.div>
  );
}
