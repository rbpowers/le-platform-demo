import { Sidebar } from "@/components/layout/Sidebar";
import { TopStatusBar } from "@/components/layout/TopStatusBar";
import { ShieldCheck } from "lucide-react";

export default function WapLayout({ children }: { children: React.ReactNode }) {
  // Phase 1: UI-only guard. Replace with Supabase Auth session check.
  const isAuthorized = true;

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: "var(--background)" }}>
        <div className="text-center space-y-3">
          <p className="text-sm" style={{ color: "var(--danger)" }}>Access denied. Admin only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <TopStatusBar />
        {/* WAP indicator strip */}
        <div
          className="flex items-center gap-2 px-5 py-1.5 shrink-0"
          style={{ background: "rgba(76,29,149,0.15)", borderBottom: "1px solid rgba(124,58,237,0.2)" }}
        >
          <ShieldCheck size={13} style={{ color: "var(--primary-bright)" }} />
          <span className="text-xs font-semibold" style={{ color: "var(--primary-bright)" }}>
            Admin Portal (WAP) — Protected
          </span>
        </div>
        <main className="flex-1 overflow-auto p-6" style={{ background: "var(--background)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
