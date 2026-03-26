"use client";

import { motion } from "framer-motion";
import { FullScannerTable } from "@/components/scanner/FullScannerTable";

export default function ScannerPage() {
  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <FullScannerTable />
    </motion.div>
  );
}
