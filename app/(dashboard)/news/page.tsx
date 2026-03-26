"use client";
import { motion } from "framer-motion";
import { NewsFeed } from "@/components/news/NewsFeed";
export default function NewsPage() {
  return (
    <motion.div className="h-full max-w-2xl mx-auto pb-16 lg:pb-0 overflow-y-auto"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
      <NewsFeed />
    </motion.div>
  );
}
