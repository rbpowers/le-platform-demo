"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ScanLine, Sunrise, Newspaper, ShieldCheck } from "lucide-react";

const TABS = [
  { label: "Hub",     href: "/hub",        icon: LayoutDashboard },
  { label: "Scanner", href: "/scanner",    icon: ScanLine        },
  { label: "Pre-Mkt", href: "/pre-market", icon: Sunrise         },
  { label: "News",    href: "/news",       icon: Newspaper       },
  { label: "Admin",   href: "/wap",        icon: ShieldCheck     },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex lg:hidden border-t"
      style={{ background: "var(--sidebar-bg)", borderColor: "var(--border)", height: "56px" }}
    >
      {TABS.map(({ label, href, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + "/");
        const color = isActive ? "var(--primary-bright)" : "var(--text-muted)";

        return (
          <Link
            key={href}
            href={href}
            className="relative flex flex-col items-center justify-center flex-1 gap-1 pt-1"
          >
            {isActive && (
              <div
                className="absolute top-0 w-8 h-0.5 rounded-full"
                style={{ background: "var(--primary-bright)" }}
              />
            )}
            <Icon size={19} style={{ color }} />
            <span className="text-[10px] font-semibold" style={{ color }}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
