"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HubWidgetGrid } from "@/components/hub/HubWidgetGrid";
import { CollapsibleNewsPanel } from "@/components/news/CollapsibleNewsPanel";

export default function HubPage() {
  const [newsCollapsed, setNewsCollapsed] = useState(false);

  return (
    <motion.div
      className="flex h-full w-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* ── Main: Hub Widget Grid ── */}
      <div className="flex-1 min-w-0 h-full overflow-hidden">
        <HubWidgetGrid />
      </div>

      {/* ── Right: Collapsible News Panel ── */}
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
    </motion.div>
  );
}
