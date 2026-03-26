"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  ScanLine,
  Sunrise,
  BarChart3,
  RefreshCw,
  Waves,
  FileText,
  Newspaper,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// OVERVIEW.md §12.3: Hub | Live Scanner | Pre-Market | Sector Heat Map |
//                    Day 2/3 Watch | Options Flow | Form 4 | News | Admin
const NAV_ITEMS = [
  { label: "Hub",            href: "/hub",              icon: LayoutDashboard },
  { label: "Live Scanner",   href: "/scanner",          icon: ScanLine        },
  { label: "Pre-Market",     href: "/pre-market",       icon: Sunrise         },
  { label: "Sector Heat Map",href: "/sector-heat-map",  icon: BarChart3       },
  { label: "Day 2/3 Watch",  href: "/day2-watch",       icon: RefreshCw       },
  { label: "Options Flow",   href: "/options-flow",     icon: Waves           },
  { label: "Form 4",         href: "/form4",            icon: FileText        },
  { label: "News",           href: "/news",             icon: Newspaper       },
  { label: "Admin (WAP)",    href: "/wap",              icon: ShieldCheck     },
];

export function Sidebar() {
  const pathname  = usePathname();
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.aside
      animate={{ width: expanded ? 200 : 64 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="flex flex-col shrink-0 h-full border-r overflow-hidden"
      style={{ background: "var(--sidebar-bg)", borderColor: "var(--border)" }}
    >
      {/* Logo + collapse toggle */}
      <div
        className="flex items-center h-12 shrink-0 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="logo-row"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="flex items-center gap-3 flex-1 min-w-0 pl-4"
            >
              <div
                className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center"
                style={{ background: "var(--primary)", boxShadow: "0 0 12px var(--primary-glow)" }}
              >
                <span className="text-white text-[11px] font-black tracking-tight">LE</span>
              </div>
              <span className="text-[13px] font-bold whitespace-nowrap" style={{ color: "var(--text-primary)" }}>
                LE Platform
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center justify-center shrink-0 hover:opacity-70 transition-opacity"
          style={{ width: "64px", height: "48px", color: "var(--text-muted)" }}
          title={expanded ? "Collapse" : "Expand"}
        >
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.22 }}>
            <ChevronRight size={14} />
          </motion.div>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 flex flex-col gap-0.5 px-2 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: expanded ? 2 : 0, scale: expanded ? 1 : 1.06 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex items-center gap-3 rounded-lg cursor-pointer h-9 ${
                  expanded ? "px-3" : "px-0 justify-center"
                }`}
                style={{
                  color: isActive ? "#fff" : "var(--text-secondary)",
                  background: isActive ? "var(--primary)" : "transparent",
                  boxShadow: isActive ? "0 0 14px var(--primary-glow)" : "none",
                }}
                title={!expanded ? item.label : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: "var(--primary)" }}
                    transition={{ type: "spring", bounce: 0.18, duration: 0.3 }}
                  />
                )}
                <Icon size={16} className="relative z-10 shrink-0" />
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.span
                      key={`lbl-${item.href}`}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -4 }}
                      transition={{ duration: 0.11 }}
                      className="relative z-10 text-[12px] font-semibold whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </nav>

    </motion.aside>
  );
}
