LE TRADING PLATFORM
Full Product & Technical Specification
LE Trading Academy LLC  |  Confidential  |  2025

PROJECT OVERVIEW
This document defines the complete product specification for the LE Trading Platform — a professional-grade, real-time trading intelligence dashboard built for active day traders. The platform will be developed as a web application with a backend developer portal via WAP, powered by Polygon.io for market data, Benzinga for news, and supplementary APIs for options flow and Form 4 filings.
The platform is designed exclusively for LE Trading Academy members and must feel like a Bloomberg terminal built for retail active traders — clean, fast, dark-mode first, and purple-branded.


1. Technology Stack & API Infrastructure
The platform depends on the following APIs and services. The backend developer must provision, authenticate, and maintain these integrations.

1.1 Core Data APIs
API / Service	Purpose	Notes
Polygon.io	Real-time & historical market data	Primary data source — all price feeds, OHLCV, snapshots
Benzinga API	Live news feed	News headlines, full articles, ticker tagging
Options Flow Provider	Options volume & flow data	Show volume-weighted option activity by ticker
SEC EDGAR / Form 4 API	Insider buying & selling filings	Filter by market cap / stock quality
WAP Developer Portal	Backend management & deployment	Admin portal, user management, feature flags

1.2 Frontend & Design Requirements
    • Framework: React (Next.js preferred) or Vue.js
    • Theme: Dark mode first — deep purple (#4C1D95), violet (#7C3AED), white text, subtle gradients
    • Accent colors: Purple (#6B21A8), Violet (#7C3AED), Emerald for bullish, Red for bearish
    • Typography: Clean sans-serif (Inter or similar), data-dense but readable
    • Layout: Resizable panels, collapsible sidebars, full UHD-aware responsive grid
    • Charts: TradingView Lightweight Charts library or equivalent (fast, embeddable)
    • All pop-out chart modals must render with extended hours data by default


2. Hub Dashboard (Main Command Center)
The Hub is the primary landing view of the platform. It is the all-encompassing overview that gives the trader a complete picture of the market at a glance. It must be clean, well-organized, and live-updating. Think: one screen to rule them all.

2.1 Layout & Persistent Elements
    • Top bar (always visible): SPY, IWM, and VIX — live price, change %, and mini sparkline
    • Top bar also shows: current market session status (Pre-Market / Regular / After-Hours)
    • Collapsible left sidebar: Navigation to all platform sections
    • Collapsible right sidebar: Live Benzinga news feed (see Section 8)
    • Notification system: Alerts for breakouts, key level hits, and admin watchlist updates

2.2 Hub Dashboard Widgets (All Visible on One Screen)
The Hub should display condensed, glanceable versions of each major module below, with a click-through to the full section. Widgets include:
    • Top Movers Off the Open (condensed scanner — Section 3)
    • Pre-Market Top Gappers (condensed — Section 5)
    • Day 2 / Day 3 Watchlist (condensed — Section 7)
    • Sector Heat Map (condensed — Section 6)
    • Admin Watchlist — Top Stocks of the Day (Section 9)
    • Options Flow Highlight — top 5 most active tickers by options volume
    • SPY / IWM Trend Tracker — are we trending up or down?
    • Form 4 Insider Filing Highlights (condensed — Section 10)


3. Live Market Scanner — Off-the-Open Dashboard
This is the primary live trading scanner. It activates at market open (9:30 AM ET) and surfaces the stocks most likely to have significant range and directional movement based on news, volume, and key level analysis.

3.1 Scanner Logic & Ranking
Stocks are ranked and displayed using the following weighted criteria (highest priority at top):
    • Has news catalyst (via Benzinga) — news ticker must match stock ticker
    • Relative Volume (RVOL) — stocks with RVOL of 2x or higher are elevated
    • Gap status: is the stock gapping above the Previous Day High (PDH) or below the Previous Day Low (PDL)?
    • Outside day setup: today's range is larger than yesterday's range
    • Pre-market high / low breakout: has price exceeded the pre-market high or low?

3.2 Key Levels Marked on Each Stock
For every stock in the scanner, the following levels must be calculated and displayed (both numerically and visually on the pop-out chart):
    • PDH — Previous Day High
    • PDL — Previous Day Low
    • PMH — Pre-Market High (calculated from 4:00 AM – 9:30 AM ET data)
    • PML — Pre-Market Low (calculated from 4:00 AM – 9:30 AM ET data)
    • Bullish Breakout flag: current price > PDH (show green indicator)
    • Bearish Breakdown flag: current price < PDL (show red indicator)

3.3 Scanner Columns
Column	Data Source	Description
Ticker	Polygon.io	Stock symbol
Company Name	Polygon.io	Full company name
Price	Polygon.io	Live last price (real-time)
Change %	Polygon.io	% change from prior close
Volume	Polygon.io	Current day volume
RVOL	Polygon.io	Volume vs 20-day avg volume
PDH	Polygon.io	Previous day high
PDL	Polygon.io	Previous day low
PMH	Polygon.io	Pre-market high
PML	Polygon.io	Pre-market low
News Headline	Benzinga	Linked headline of top catalyst
Breakout Status	Calculated	Bullish / Bearish / Inside Day badge

3.4 Filters & Sorting
    • Filter by: Has News (toggle), Minimum RVOL (slider), Minimum Price (input), Market Cap range
    • Sort by: any column header (ascending / descending)
    • Color coding: Bullish breakout rows = green-tinted; Bearish = red-tinted; Inside day = neutral


4. Interactive Chart Pop-Out
Every stock listed anywhere in the platform (scanner, watchlists, heat map, Form 4 section, etc.) must be clickable. Clicking on any ticker launches a full chart pop-out modal overlay.

4.1 Chart Specifications
    • Default timeframe: 15-minute candles (user can toggle to 10-minute or 5-minute)
    • Extended hours data: Enabled by default — show pre-market and after-hours candles
    • Chart library: TradingView Lightweight Charts (or equivalent embeddable library)

4.2 EMA Overlays (Required)
8 EMA	Purple (#7C3AED) — bold line, 2px
20 EMA	Blue (#3B82F6) — solid line, 2px
200 EMA	Green (#10B981) — dashed line, 2px

4.3 Key Level Overlays (Required)
    • PDH — dashed orange horizontal line
    • PDL — dashed orange horizontal line
    • PMH — dashed yellow horizontal line
    • PML — dashed yellow horizontal line
    • All lines labeled with a small text badge on the right axis

4.4 Pop-Out UX
    • Opens as a centered modal overlay with a dark semi-transparent background
    • Pop-out is resizable and draggable
    • Header shows: ticker, company name, current price, change %, and news headline if available
    • One-click close button (top-right X)
    • Link to full-screen chart view (opens in new tab)
    • Feel: smooth animation on open/close, natural and fast — clicking a ticker feels instant


5. Pre-Market Dashboard
Active from 4:00 AM – 9:30 AM ET. This dashboard provides the automated pre-market watchlist that the trader uses to plan the trading day. It surfaces the most important stocks to watch before the open.

5.1 Top Gappers Scanner
A ranked list of all stocks gapping up or down in pre-market, with the following columns:
    • Ticker, Company Name, Prior Close, Pre-Market Price
    • Gap % (pre-market price vs prior day close)
    • Pre-Market Volume
    • News Headline (Benzinga) — what is driving the gap
    • Affected Tickers — if the news is sector-wide or mentions competitors, show related tickers
    • Float (shares outstanding, pulled from Polygon reference data)
    • Market Cap
    • Bullish / Bearish gap direction badge

5.2 Automated Pre-Market Watchlist
Below the gappers scanner, the platform auto-generates a curated watchlist of stocks most worth watching at the open. Inclusion criteria:
    • Gap of 3%+ in pre-market
    • Has confirmed news catalyst (Benzinga ticker match)
    • Pre-market volume above a configurable minimum threshold
    • Watchlist shows: ticker, gap %, news headline, PMH/PML, PDH/PDL
    • Admin can pin or override the watchlist (see Section 9)

5.3 Pre-Market SPY / IWM Levels
    • Persistent top strip showing SPY and IWM pre-market price, change %, and whether they are above or below key levels


6. Sector Heat Map
A visual representation of which market sectors are outperforming and underperforming in real time. Built to give traders an immediate understanding of money flows.

6.1 Heat Map Visualization
    • Sectors displayed as color-coded tiles — deep green = strongest, deep red = weakest
    • Tile size proportional to the sector's weight in the S&P 500
    • Sectors: Technology, Healthcare, Financials, Consumer Discretionary, Consumer Staples, Energy, Industrials, Materials, Utilities, Real Estate, Communication Services

6.2 Sector Drill-Down
    • Clicking a sector tile expands it to show individual stocks within that sector
    • Each stock shown with: ticker, price, change %, color-coded tile
    • Stocks are sortable by: % change, volume, RVOL, market cap
    • Clicking any stock opens the chart pop-out (Section 4)

6.3 Filters
    • Toggle: Show only S&P 500 stocks / Show all stocks
    • Minimum market cap filter
    • Minimum volume filter
    • Time range selector: Today, 1-week, 1-month (shows relative performance)


7. Day 2 / Day 3 Follow-Through Scanner
This automated scanner tracks stocks that made large moves (up or down) driven by news catalysts and monitors them over the following trading days to identify follow-through breakout setups.

7.1 How Stocks Enter the Day 2 List
A stock is automatically added to the Day 2 watchlist when:
    • It made a significant directional move (configurable threshold, e.g. 10%+) in the prior session
    • The move was accompanied by a confirmed Benzinga news catalyst
    • The stock is above average quality (price > $5, volume > 500K on move day)

7.2 Day 2 Watchlist Logic
    • Bullish Day 2 watch: stock broke above its PDH on the move day → watching for continuation above new PDH
    • Bearish Day 2 watch: stock broke below its PDL on the move day → watching for continuation below new PDL
    • If neither PDH nor PDL is breached by end of session → stock is flagged as Inside Day and moves to Day 3 watch

7.3 Day 3 Watchlist Logic
Stocks that did not print (failed to break PDH bullish or PDL bearish on Day 2) are automatically moved to the Day 3 watchlist with an Inside Day flag. These remain elevated at the top of the list until the breakout prints or the setup expires (configurable: 5 trading days max).

7.4 Scanner Columns
Column	Description	Notes
Ticker	Stock symbol	Clickable → chart pop-out
Move Day	Date of original catalyst move	
Move %	% change on catalyst day	
News Headline	Benzinga catalyst headline	
Direction	Bullish or Bearish	Color coded
PDH / PDL	Levels to watch for breakout	Highlighted on chart
Status	Day 2 / Day 3 / Inside Day	Badge indicator
Days Since Move	How many sessions ago the move occurred	


8. Live News Feed (Benzinga)
A real-time, filterable news feed powered by the Benzinga API. This is a collapsible right-side panel that can be toggled open/closed from any screen in the platform.

8.1 News Feed Specifications
    • Only show high-importance news items (filter by Benzinga importance score — medium and high priority only)
    • Each headline shows: ticker(s) affected, headline text, time stamp, source
    • Clicking a headline expands it to show the full article or a short summary
    • Clicking a ticker in any headline opens the chart pop-out immediately
    • Real-time updates — new items appear at the top with a brief highlight animation

8.2 News Filters
    • By ticker: type a ticker to see all news for that specific stock
    • By sector: filter to a specific market sector
    • By importance: toggle to show only high-priority news
    • Earnings filter: highlight earnings releases and guidance updates


9. Admin Watchlist — Top Stocks & Watches of the Day
This module allows the platform admin (Elly / LE Trading Academy) to manually publish a curated watchlist and top stock picks visible to all platform users. This is a high-visibility section displayed prominently on the Hub Dashboard.

9.1 Admin Functionality (via WAP Backend Portal)
    • Admin can add, remove, or reorder stocks in the Top Stocks of the Day list
    • Admin can add a short note or reasoning for each pick (optional, shown to users)
    • Admin can set a publish status: Draft (admin-only preview) vs Live (visible to all users)
    • Admin can pin a stock to the top of any other scanner or watchlist
    • Changes publish in real-time — no page refresh required for end users

9.2 User View
    • Clearly labeled section: 'Today's Top Watches — Updated by LE Trading'
    • Shows: ticker, company name, current price, change %, and admin note
    • Clicking any stock opens the chart pop-out
    • Ordering is set by the admin — not auto-sorted


10. Options Flow Dashboard
Real-time options flow data showing which stocks are seeing the heaviest options activity. Used to identify institutional conviction behind directional moves.

10.1 Display Logic
    • Show all unusual options activity — define as any options trade with volume significantly above open interest
    • Group by ticker — display total call volume vs total put volume for the session
    • Call/Put ratio displayed as a visual bar (green for bullish lean, red for bearish lean)
    • Sort by: total options volume (default), call volume, put volume, or call/put ratio

10.2 Options Flow Table Columns
Column	Description	Notes
Ticker	Stock symbol	Clickable → chart pop-out
Underlying Price	Live stock price	
Call Volume	Total calls traded today	
Put Volume	Total puts traded today	
Call/Put Ratio	Calls ÷ Puts	Color coded — >1 bullish, <1 bearish
Largest Strike	Most active single options contract	
Expiration Focus	Closest expiration with heaviest volume	
Sentiment	Bullish / Bearish / Neutral badge	AI-assisted or rule-based

10.3 SPY / IWM Options Flow Prominence
    • SPY and IWM options flow always shown at the very top of this section, pinned
    • Stocks whose options flow direction aligns with SPY direction are elevated in ranking
Example: If SPY call volume is dominant (bullish), stocks with high call volume appear at the top of the scanner as the highest-conviction trades.


11. Form 4 Insider Filings Section
A curated, auto-filtered view of SEC Form 4 insider buying and selling activity. This section focuses only on high-quality, meaningful filings — not noise from small or obscure companies.

11.1 Data Source
    • SEC EDGAR real-time Form 4 feed (or third-party API such as OpenInsider or similar)
    • Refresh every 15–30 minutes during market hours

11.2 Quality Filter (Critical)
The following rules must be applied automatically to filter out irrelevant filings:
    • Minimum stock price: $10 or higher
    • Minimum market cap: $500M or higher
    • Minimum transaction value: $100,000 or higher
    • Transaction type: Show purchases (buys) and significant sales separately
    • Exclude: 10b5-1 plan sales (or clearly label them), options exercises unless accompanied by a hold
    • Exclude: insider transactions from companies with average daily volume under 500,000 shares

11.3 Display Columns
Column	Description	Notes
Ticker	Stock symbol	Clickable → chart pop-out
Company Name	Full company name	
Insider Name	Person making the filing	
Title / Role	CEO, CFO, Director, etc.	
Transaction Type	Buy or Sell	Color coded
Shares	Number of shares transacted	
Price Per Share	Transaction price	
Total Value	Total $ value of transaction	
Shares Owned After	Total ownership post-trade	
Filing Date	Date SEC received the filing	

11.4 Sorting & Filtering
    • Default sort: largest transaction value first
    • Filter by: Buys only / Sells only / Both
    • Filter by: Transaction date range
    • Filter by: Minimum transaction value slider
    • Search by ticker or insider name


12. User Experience & Design Standards

12.1 Visual Design
    • Dark mode is the default and primary theme — no light mode needed at launch
    • Primary colors: Deep Purple (#4C1D95), Violet (#7C3AED), White (#FFFFFF)
    • Bullish / Up: Emerald green (#10B981)
    • Bearish / Down: Red (#EF4444)
    • Neutral / Flat: Slate gray (#94A3B8)
    • Backgrounds: Near-black (#0F0A1E for main), Dark purple (#1E1B4B for cards)
    • All data tables must have subtle alternating row shading for readability
    • Hover states on all interactive rows — subtle purple highlight

12.2 Performance Requirements
    • Real-time data feeds must update every 1–5 seconds during market hours
    • Chart pop-outs must open within 500ms of click
    • Scanner tables must handle 200+ rows without UI lag
    • WebSocket connections preferred over polling for live data
    • Loading states on all async data — skeleton screens, not blank areas

12.3 Navigation
    • Left sidebar navigation with icons + labels for each section
    • Sections: Hub | Live Scanner | Pre-Market | Sector Heat Map | Day 2/3 Watch | Options Flow | Form 4 | News | Admin
    • Active section highlighted with purple accent
    • Sidebar collapses to icon-only view on smaller screens


13. User Roles & Access

Role	Permissions
Member (Standard)	Read access to all dashboards, scanners, charts, news, options flow, and Form 4 section
Admin (Elly / LE Team)	All member access + ability to publish admin watchlist, manage user accounts, configure scanner thresholds, and manage WAP backend portal

Authentication: Standard username/password login with email verification. Admin role managed through WAP backend portal. Optional: Discord OAuth for community members.


14. Suggested Development Phases
The following phased roadmap is recommended to allow for iterative delivery and testing:

Phase 1 — Foundation (Weeks 1–3)
    • Polygon.io API integration (price feeds, OHLCV, snapshots)
    • Benzinga API integration (news feed)
    • WAP backend portal setup, authentication, user roles
    • Core dark-mode UI shell with navigation
    • Live Market Scanner (Section 3) — first fully functional module
    • Chart pop-out (Section 4) with EMAs and key levels

Phase 2 — Pre-Market & Watchlists (Weeks 4–5)
    • Pre-Market Dashboard (Section 5)
    • Day 2 / Day 3 Scanner (Section 7)
    • Admin Watchlist module (Section 9)
    • Hub Dashboard — initial version with widgets for Phase 1–2 modules

Phase 3 — Intelligence Layers (Weeks 6–8)
    • Sector Heat Map (Section 6)
    • Options Flow Dashboard (Section 10)
    • Form 4 Insider Filings Section (Section 11)
    • News Feed sidebar panel (Section 8)
    • Hub Dashboard — fully populated with all module widgets

Phase 4 — Polish & Optimization (Weeks 9–10)
    • Performance optimization: WebSocket tuning, query caching
    • Mobile / tablet responsive layout review
    • UX review, animation polish, loading state improvements
    • Beta testing with a subset of LE Trading Academy members
    • WAP portal admin tools finalization


15. Notification System
The platform must deliver timely, actionable alerts to users so they never miss a key breakout, news catalyst, or admin update — even when they are not actively looking at the platform. Notifications must work across browsers and devices.

15.1 Browser Push Notifications (Web Push API)
The platform must implement the Web Push API (PWA-compatible) so users can opt in to receive browser-level push notifications. These fire even when the user has the tab closed or minimized.
    • Users must be prompted to allow notifications on first login — prompt must be unobtrusive and clearly explain the value
    • Users can manage notification preferences from their account settings with granular toggles per category
    • Push notifications must work on Chrome, Firefox, Edge, and Safari (iOS 16.4+ supports Web Push)
    • Delivery must be near-instant — target under 2 seconds from trigger event to notification receipt
    • Each notification includes: ticker, short description of the trigger, and a direct deep link that opens the relevant chart pop-out or section when clicked

15.2 Notification Trigger Categories
The following events must be configurable as notification triggers. Users can toggle each on or off individually from their settings:
Trigger	Description	Default State
PDH Breakout (Bullish)	A scanner stock crosses above its Previous Day High	ON
PDL Breakdown (Bearish)	A scanner stock crosses below its Previous Day Low	ON
PMH Breakout	A stock crosses above its Pre-Market High after open	ON
PML Breakdown	A stock crosses below its Pre-Market Low after open	ON
High RVOL Alert	A stock hits configurable RVOL threshold (e.g., 5x+)	ON
Breaking News Alert	High-importance Benzinga headline hits for a scanned ticker	ON
Admin Watchlist Update	Elly / LE Team publishes or updates the Top Watches list	ON
Day 2 Breakout Alert	A Day 2 watch stock breaks its PDH or PDL	ON
Unusual Options Flow	A ticker exceeds configurable options volume threshold	OFF
Form 4 Filing Alert	New insider buy filing passes quality filters	OFF
Pre-Market Gap Alert	A stock gaps up or down more than configurable % (e.g., 10%+)	ON
SPY Key Level Hit	SPY crosses a user-defined price level	OFF

15.3 In-App Notification Center
In addition to browser push, the platform has a persistent in-app notification bell (top-right of nav bar) that stores a scrollable history of all alerts:
    • Unread count badge on the bell icon
    • Clicking the bell opens a slide-out panel showing all recent alerts, newest first
    • Each alert shows: ticker, trigger type, time, and a one-click link to the relevant chart or section
    • Alerts marked as read automatically after viewing, or via a 'Mark All Read' button
    • Notification history retained for 24 hours, then cleared

15.4 Alert Toast Banners (In-App)
When the user is actively on the platform, triggered alerts appear as non-intrusive toast banners in the bottom-right corner:
    • Toast shows: ticker, trigger description, live price at time of trigger
    • Toast auto-dismisses after 8 seconds or on user click
    • Clicking the toast opens the chart pop-out for that ticker instantly
    • Maximum 3 toasts stacked at once — older ones queue and appear as previous ones dismiss
    • Toast color coded: green for bullish triggers, red for bearish, purple for admin / news alerts

15.5 Notification Settings & User Controls
All notification preferences accessible from the user account settings page:
    • Master toggle: Enable / Disable all notifications
    • Per-category toggles (see Section 15.2 table above)
    • Quiet hours: User sets a time range where no push notifications fire (e.g., 6:00 PM – 8:00 AM ET)
    • Market hours only toggle: Suppress all alerts outside of 4:00 AM – 8:00 PM ET
    • Minimum price filter: Only notify on stocks above a user-defined price threshold
    • Watchlist-only mode: Only fire alerts for tickers on the admin watchlist

15.6 Technical Implementation Notes
    • Use the Web Push API with VAPID keys for browser push — requires a service worker registered on the domain
    • Push notification delivery managed server-side (Node.js + web-push library or equivalent)
    • Notification triggers evaluated server-side on each data tick — not client-side — to ensure reliability even with tab closed
    • Service worker must handle push events, notification click routing, and deep linking back into the platform
    • All push subscriptions stored in the WAP backend database per user — subscriptions refreshed on expiry
    • Graceful fallback: if browser push is not supported or permission is denied, in-app notifications and toasts still function fully


16. Open Questions for Developer
The following items require discussion and decisions before or during development:

Options Flow API	Which specific options flow data provider will be used? (e.g., Market Chameleon, Unusual Whales, Tradier, or other)
Form 4 Data	Will we use SEC EDGAR direct feed, OpenInsider, or another third-party Form 4 aggregator?
Chart Library	TradingView Lightweight Charts is recommended — confirm license / plan required for commercial use.
WebSocket Setup	Polygon.io WebSocket vs REST polling — developer to confirm architecture for real-time feed at scale.
Hosting	WAP backend portal deployment environment — cloud provider, CDN, redundancy plan?
RVOL Calculation	Confirm: RVOL = today's current volume ÷ average volume at this same time of day over 20 days. Requires intraday historical data from Polygon.
Pre-Market Hours	Confirm data availability from Polygon for 4:00 AM – 9:30 AM ET extended hours.
Member Auth	Will members log in directly on the platform or through Discord OAuth / existing LE Trading Academy login system?
Admin Notifications	Should admin watchlist updates trigger a push notification or in-app alert to members?

This document is the complete specification for Phase 1–4 of the LE Trading Platform.
Prepared by LE Trading Academy LLC  |  Confidential
Prepared by LE Trading Academy LLC  |  Confidential