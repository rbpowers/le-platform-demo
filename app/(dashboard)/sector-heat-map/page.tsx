"use client";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
export default function SectorHeatMapPage() {
  return (
    <motion.div className="flex flex-col items-center justify-center h-full gap-4"
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: "rgba(124,58,237,0.15)" }}>
        <BarChart3 size={28} style={{ color: "var(--primary-bright)" }} />
      </div>
      <div className="text-center">
        <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>Sector Heat Map</h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Color-coded sector tiles with drill-down — arriving in Phase 3.
        </p>
      </div>
    </motion.div>
  );
}
