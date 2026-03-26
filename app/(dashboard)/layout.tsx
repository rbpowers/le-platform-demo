import { Sidebar } from "@/components/layout/Sidebar";
import { TopStatusBar } from "@/components/layout/TopStatusBar";
import { ChartModal } from "@/components/chart/ChartModal";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { TickerProvider } from "@/lib/TickerContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <TickerProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        {/* Sidebar — desktop only */}
        <div className="hidden lg:flex h-full">
          <Sidebar />
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <TopStatusBar />
          <main
            className="flex-1 overflow-hidden"
            style={{ background: "var(--bg-base)" }}
          >
            {children}
          </main>
        </div>
      </div>

      {/* Chart modal — desktop only (mobile uses /chart/[ticker] page) */}
      <div className="hidden lg:block">
        <ChartModal />
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav />
    </TickerProvider>
  );
}
