import { Sidebar } from "@/components/layout/Sidebar";
import { TopStatusBar } from "@/components/layout/TopStatusBar";
import { ChartModal } from "@/components/chart/ChartModal";
import { TickerProvider } from "@/lib/TickerContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <TickerProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <Sidebar />
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
      {/* Chart modal rendered at layout level — available on all dashboard pages */}
      <ChartModal />
    </TickerProvider>
  );
}
