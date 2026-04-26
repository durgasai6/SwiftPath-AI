# SwiftPath

SwiftPath is an AI-powered Supplier Risk Intelligence Platform built with Next.js 16, TypeScript, Tailwind CSS v4, shadcn-style UI components, Recharts, and a live multi-agent backend.

It now includes:

- Marketing landing page
- Login and signup flows
- Full dashboard shell with collapsible sidebar and command palette
- Dashboard, suppliers, alerts, agents, and reports pages
- Real `/api/analyze` backend route using:
  - GDELT for news discovery
  - Open-Meteo for weather risk
  - Groq for live web-backed geopolitical, financial, and compliance reasoning
- Persistent analysis history via `data/analysis-history.json`

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS v4
- Recharts
- Lucide React
- next-themes
- @tanstack/react-table
- Radix-based shadcn-style UI primitives
- Zod

## Routes

- `/` landing page
- `/login`
- `/signup`
- `/dashboard`
- `/dashboard/suppliers`
- `/dashboard/alerts`
- `/dashboard/agents`
- `/dashboard/reports`
- `/api/analyze`
- `/api/health`
- `/api/history`

## Project Structure

```text
src/
  app/
    (auth)/
      login/page.tsx
      signup/page.tsx
    (dashboard)/
      layout.tsx
      loading.tsx
      dashboard/
        page.tsx
        suppliers/page.tsx
        alerts/page.tsx
        agents/page.tsx
        reports/page.tsx
    api/
      analyze/route.ts
      health/route.ts
      history/route.ts
    globals.css
    layout.tsx
    page.tsx

  components/
    ui/
    agent-log.tsx
    auth-showcase.tsx
    command-palette.tsx
    dashboard-shell.tsx
    live-scan-card.tsx
    navbar.tsx
    risk-gauge.tsx
    risk-heatmap.tsx
    sidebar.tsx
    stat-card.tsx
    supplier-table.tsx
    theme-provider.tsx
    theme-toggle.tsx

  lib/
    csv.ts
    mock-data.ts
    utils.ts
    server/
      history-store.ts
      supplier-intelligence.ts

  types/
    index.ts
```

## Setup

1. Install dependencies

```bash
npm install
```

2. Create `.env.local`

```bash
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=groq/compound-mini
```

3. Start development

```bash
npm run dev
```

4. Production build

```bash
npm run build
npm start
```

## Live Backend

`/api/analyze` accepts supplier rows as JSON and runs a real multi-agent flow:

1. News Agent
   Pulls recent public coverage from GDELT.
2. Weather Agent
   Pulls forecast risk from Open-Meteo.
3. Groq Research Agent
   Uses web-backed reasoning for geopolitical, financial, and compliance scoring.
4. Aggregation
   Produces weighted supplier risk, recommendation, next actions, and citations.

If `GROQ_API_KEY` is missing, SwiftPath automatically falls back to a local scoring path instead of failing.

## Notes

- The dashboard includes a “Run Live AI Scan” card that exercises the real backend from the UI.
- The sample portfolio data is realistic but fictional.
- The root dashboard route was implemented at `/dashboard` because `/` is reserved for the landing page.

## Verification

The app has been verified with:

```bash
npm run build
```

## License

MIT

