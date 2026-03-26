1. The "Command Center" Layout (Visual Hierarchy)
The layout should be a Fixed-Position Dashboard. Users should never have to scroll the main page; data should live in scrollable widgets.

Sidebar (Collapsed: 64px / Expanded: 200px):

Icons only by default to maximize "Data Real Estate."

Active state: #4C1D95 glow effect.

Main Grid (3-Column System):

Left Column (25% width): The "Live Scanner." Needs to be narrow and data-dense.

Center Column (50% width): The "Focus Area." This houses the Active Chart and the "Admin Pinned Watchlist" at the top.

Right Column (25% width): The "Intelligence Feed." Top half: Real-time Benzinga News. Bottom half: Options Flow / Form 4 Feed.

2. Chart Display Logic (The "When" and "Where")
The chart is the "Stage," and the scanners are the "Script."

Primary Chart: Lives in the Center Column. It should automatically sync to whatever ticker is clicked in the Live Scanner or Admin Watchlist.

Pop-out Mechanism: Every chart widget must have a "Maximize" icon. Clicking this should use window.open to launch a minimal Next.js route (/chart/[ticker]) that only renders the chart and EMAs—perfect for users with multi-monitor setups.

Multi-Chart Toggle: Add a toggle in the Center Column to switch from "Single Chart" to "2x2 Grid" mode.

3. Component-Specific Details
A. The Live Scanner (Section 3 Spec)
Row Height: 32px (Compact).

Visual Triggers: * If RVOL > 2.0: The RVOL text turns #10B981 (Emerald) and bold.

If Price > PDH: A small "PDH" badge appears next to the ticker in purple.

Interaction: Single-click ticker = Change Main Chart. Double-click = Open Ticker Research Modal.

B. The Admin Watchlist (Section 9 Spec)
Placement: Top of the Center Column, styled as "Horizontal Cards."

Details: Ticker, Current Price, and a "Thesis Snippet."

Urgency: If the Admin (You) marks a pick as "High Conviction" in the WAP, the card gets a pulsing purple border.

C. The Benzinga News Feed
Layout: Vertical list with time-stamps.

Highlighting: Tickers mentioned in headlines should be clickable "pills." Clicking a pill updates the Main Chart.

4. Color & Typography Palette (For Tailwind)
Backgrounds:

Level 0 (App Base): #050505

Level 1 (Widget Cards): #0F0F12

Level 2 (Hover States): #1A1A1F

Borders: 1px solid #262626

Typography:

Labels/UI: Inter (Semi-bold, 12px)

Price/Numbers: JetBrains Mono (Medium, 13px) — Critical for keeping numbers aligned in tables