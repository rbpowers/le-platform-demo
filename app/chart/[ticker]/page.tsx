/**
 * Pop-out chart route: /chart/[ticker]
 * Opened via window.open() from ChartViewport's maximize button.
 * Renders a minimal full-screen chart with no sidebar or header.
 */
import { ChartPopout } from "@/components/chart/ChartPopout";

interface Props {
  params: Promise<{ ticker: string }>;
}

export default async function ChartPopoutPage({ params }: Props) {
  const { ticker } = await params;
  return <ChartPopout ticker={ticker.toUpperCase()} />;
}
