"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface TickerContextValue {
  activeTicker: string;
  setActiveTicker: (ticker: string) => void;
  /** Opens the chart modal and syncs activeTicker */
  chartModalOpen: boolean;
  openChartModal: (ticker: string) => void;
  closeChartModal: () => void;
}

const TickerContext = createContext<TickerContextValue>({
  activeTicker: "NVDA",
  setActiveTicker: () => {},
  chartModalOpen: false,
  openChartModal: () => {},
  closeChartModal: () => {},
});

export function TickerProvider({ children }: { children: React.ReactNode }) {
  const [activeTicker, setTicker]  = useState("NVDA");
  const [chartModalOpen, setModal] = useState(false);

  const setActiveTicker = useCallback((t: string) => setTicker(t.toUpperCase()), []);

  const openChartModal = useCallback((t: string) => {
    setTicker(t.toUpperCase());
    setModal(true);
  }, []);

  const closeChartModal = useCallback(() => setModal(false), []);

  return (
    <TickerContext.Provider
      value={{ activeTicker, setActiveTicker, chartModalOpen, openChartModal, closeChartModal }}
    >
      {children}
    </TickerContext.Provider>
  );
}

export function useTicker() {
  return useContext(TickerContext);
}
