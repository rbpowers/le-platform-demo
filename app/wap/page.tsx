"use client";

import { motion } from "framer-motion";
import { WatchlistForm } from "@/components/admin/WatchlistForm";
import { ShieldCheck } from "lucide-react";

export default function WapPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 max-w-2xl"
    >
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(76,29,149,0.2)" }}
        >
          <ShieldCheck size={18} style={{ color: "var(--primary-bright)" }} />
        </div>
        <div>
          <h1 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
            Admin Portal
          </h1>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Manage global watchlist and platform configuration.
          </p>
        </div>
      </div>

      <div
        className="h-px w-full"
        style={{ background: "var(--border)" }}
      />

      {/* Watchlist section */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
          Global Watchlist
        </h2>
        <WatchlistForm />
      </section>
    </motion.div>
  );
}
