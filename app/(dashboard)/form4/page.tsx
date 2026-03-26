"use client";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
export default function Form4Page() {
  return (
    <motion.div className="flex flex-col items-center justify-center h-full gap-4"
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: "rgba(251,191,36,0.12)" }}>
        <FileText size={28} style={{ color: "var(--warning)" }} />
      </div>
      <div className="text-center">
        <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>Form 4 — Insider Filings</h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          SEC EDGAR insider buy/sell feed with quality filters — arriving in Phase 3.
        </p>
      </div>
    </motion.div>
  );
}
