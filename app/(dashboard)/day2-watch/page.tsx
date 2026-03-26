"use client";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
export default function Day2WatchPage() {
  return (
    <motion.div className="flex flex-col items-center justify-center h-full gap-4"
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: "rgba(16,185,129,0.12)" }}>
        <RefreshCw size={28} style={{ color: "var(--success)" }} />
      </div>
      <div className="text-center">
        <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>Day 2 / Day 3 Watch</h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Automated follow-through scanner with Inside Day detection — arriving in Phase 2.
        </p>
      </div>
    </motion.div>
  );
}
