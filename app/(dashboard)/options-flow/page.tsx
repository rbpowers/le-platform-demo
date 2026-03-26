"use client";

import { motion } from "framer-motion";
import { Waves } from "lucide-react";

export default function OptionsFlowPage() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full gap-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: "rgba(16,185,129,0.1)" }}
      >
        <Waves size={28} style={{ color: "var(--success)" }} />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
          Options Flow
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Unusual options activity and dark pool prints — coming in Phase 2.
        </p>
      </div>
    </motion.div>
  );
}
