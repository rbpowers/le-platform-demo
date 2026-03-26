# LE Trading Platform - Developer Guidelines

## Tech Stack
- **Framework**: Next.js 15+ (App Router), TypeScript
- **Styling**: Tailwind CSS
- **Database/Realtime**: Supabase
- **Charts**: Lightweight-Charts (TradingView)
- **State**: TanStack Query (React Query)
- **Icons**: Lucide-React

## Design System (Dark-Mode First)
- **Primary**: Deep Purple (#4C1D95)
- **Secondary**: Violet (#7C3AED)
- **Success**: Emerald (#10B981)
- **Danger**: Red (#EF4444)
- **Background**: High-contrast dark grays/blacks

## UI Architecture
1. **Root Layout**: Sidebar navigation + Top header (Status bar).
2. **Dashboard Shell**: Multi-column grid for widgets.
3. **Scanner Components**: Optimized for high-frequency row updates.
4. **Chart Portals**: Logic for "pop-out" window support.