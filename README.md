# SwiftPath AI

SwiftPath AI is an agentic supplier-risk intelligence MVP built for procurement and supply-chain teams. It shows how an industrial AI system can ingest a supplier portfolio, orchestrate multiple risk signals, escalate the highest-risk suppliers into deeper analysis, persist its audit trail, and generate leadership-facing outputs.

This version is tuned to present well in an `Agentic Ops` / `Industrial AI Deployment` setting. The app now includes a clearer demo flow, seeded portfolio workflow, an operational readiness view, fallback-safe analysis, and stronger product framing across the dashboard.

## What The MVP Demonstrates

- Portfolio ingest: load a demo portfolio or import suppliers from CSV.
- Agent orchestration: combine news, weather, financial, compliance, geopolitical, and operational signals.
- Risk prioritization: score suppliers into low, medium, high, and critical bands.
- Escalation path: use deterministic local scoring by default and switch to live reasoning when a Groq key is configured.
- Operational safeguards: persistent history, health endpoints, exports, and a readiness summary.
- Executive reporting: review scan history, alerts, recommendations, and downloadable reports.

## Why This Fits Agentic Ops

The product is not just "AI on a page." It shows the broader operating loop:

1. Input suppliers into a monitored portfolio.
2. Run baseline multi-signal analysis across the portfolio.
3. Escalate top-risk suppliers into deeper reasoning.
4. Persist the run for auditability and repeatability.
5. Surface actions, alerts, and reports for operators.

That gives you a clean story around orchestration, fallback behavior, observability, and deployment readiness.

## Main Screens

- `/` marketing landing page
- `/login` and `/signup` authentication flow
- `/dashboard` command center with live scan, trendline, risk distribution, and latest actions
- `/dashboard/suppliers` portfolio workspace with demo seed, CSV import, export, filters, and heatmap
- `/dashboard/alerts` alert queue generated from scan history
- `/dashboard/agents` agent activity and pipeline view
- `/dashboard/ops` agentic operations and deployment-readiness review
- `/dashboard/reports` report history and PDF export flow

## APIs

- `POST /api/analyze`
  Runs supplier intelligence on JSON or CSV input.
- `GET /api/history`
  Returns persisted analysis runs.
- `GET /api/health`
  Returns service health plus deployment posture.
- `GET /api/ops/summary`
  Returns readiness score, checks, and orchestration summary.
- `GET /api/suppliers`
  Returns stored supplier portfolio data.
- `POST /api/suppliers`
  Adds a supplier into the portfolio store.
- `GET /api/export?format=csv`
  Exports portfolio data as CSV.
- `POST /api/seed`
  Seeds the workspace with a realistic demo portfolio and a starter history entry.

## Architecture

### Frontend

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui-style component primitives
- Recharts for dashboard visualization

### Backend / Agent Layer

- Next.js route handlers for API endpoints
- Multi-signal supplier analysis pipeline in `src/lib/server/supplier-intelligence.ts`
- External signal usage:
  - GDELT for public news coverage
  - Open-Meteo for weather disruption context
  - Yahoo Finance for public ticker-based financial context
  - Local sanctions CSV for compliance checks
- Live reasoning path through Groq when configured
- Local deterministic fallback when no live key is present

### Persistence

- `data/suppliers.json` for supplier portfolio storage
- `data/analysis-history.json` for scan history and audit trail
- `data/sanctions_list.csv` for simple compliance matching

## Demo Flow

For a 5-7 minute classroom demo:

1. Open `/dashboard/suppliers`.
2. Click `Load Demo Portfolio`.
3. Show the supplier coverage, high-risk count, and heatmap.
4. Open `/dashboard`.
5. Click `Run Live AI Scan`.
6. Show the updated trendline, top at-risk suppliers, and scan history.
7. Open `/dashboard/ops`.
8. Explain the readiness checks, fallback posture, and orchestration stages.
9. Open `/dashboard/reports`.
10. Generate or download a report to show the final operator output.

That sequence makes the project feel like a real operations workflow rather than a static dashboard.

## Setup

### Prerequisites

- Node.js 20 or newer
- npm

### Install

```bash
npm install
```

### Environment

Create `.env.local`:

```bash
GROQ_API_KEY=your_key_here
GROQ_MODEL=groq/compound-mini
```

If `GROQ_API_KEY` is missing, the app still works using the local fallback path.

### Run

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

## Presentation-Friendly Features Added

- Shared supplier normalization so pages read from one consistent portfolio model
- Seeded demo portfolio instead of placeholder scan data
- Dedicated `Agentic Ops` page for readiness and deployment posture
- `ops/summary` API for professor-facing observability
- Improved dashboard mission brief and action framing
- Better supplier onboarding with sample CSV download, import, export, and refresh
- Stronger fallback messaging so the MVP still presents well without a live model key

## Verification

Verified successfully with:

```bash
npm run typecheck
npm run build
```

## Suggested Next Steps

If you want to push this from strong MVP to near-capstone quality, the next upgrades would be:

- role-based authentication and per-user data isolation
- queue-backed background scans
- real alert state transitions and acknowledgement workflow
- database-backed persistence instead of JSON files
- scheduled scan jobs and notification delivery
- evaluation dashboards for model quality, latency, and escalation accuracy

## Project Goal

SwiftPath AI is designed to answer a simple question:

`How do we make an AI system behave like an operations tool, not just a chatbot?`

This MVP answers that with portfolio ingest, multi-agent scoring, escalation, persistence, reporting, and readiness visibility in one coherent workflow.
