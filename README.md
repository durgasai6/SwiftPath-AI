# SwiftPath-AI: AI-Powered Supplier Risk Intelligence Platform

SwiftPath-AI is a cutting-edge, AI-driven platform designed to revolutionize supplier risk management for supply chain teams. Built with Next.js 16, TypeScript, and modern web technologies, it leverages multi-agent AI systems to provide real-time, proactive risk detection and mitigation strategies, ensuring operational continuity and cost savings.

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

## Project Overview

SwiftPath-AI empowers procurement and supply chain professionals to "Know Before It Breaks" by detecting supplier risks early across multiple dimensions: geopolitical events, financial instability, compliance issues, weather disruptions, and logistical challenges. Unlike traditional reactive systems that rely on manual monitoring or delayed reports, SwiftPath-AI uses autonomous AI agents to continuously scan global signals and provide actionable insights.

### Key Capabilities
- **Multi-Agent AI Monitoring**: Specialized agents for news, weather, financial, and compliance analysis work in parallel
- **Real-Time Risk Scoring**: Dynamic risk assessment with explainable scoring bands (Low, Medium, High, Critical)
- **Autonomous Recommendations**: AI-generated mitigation strategies, from alternate sourcing to compliance reviews
- **Interactive Dashboard**: Comprehensive portfolio view with heatmaps, alerts, and trend analysis
- **Persistent Intelligence**: Historical analysis tracking and automated report generation
- **Seamless Integration**: CSV upload, API endpoints, and export capabilities

## Novel and Innovative Features

Compared to existing supplier risk management systems (which often rely on manual data entry, quarterly reports, or siloed tools), SwiftPath-AI introduces groundbreaking capabilities:

### 1. **Autonomous Multi-Agent Architecture**
   - **Novelty**: First-to-market multi-agent system where specialized AI agents (News, Weather, Financial, Compliance) operate independently and collaboratively
   - **Advantage**: Eliminates human bottlenecks; agents scan 24/7 without fatigue or oversight gaps
   - **Impact**: Reduces risk detection time from weeks to minutes

### 2. **Real-Time Web-Backed Reasoning**
   - **Novelty**: Integrates live web data with Groq AI for contextual geopolitical and financial analysis
   - **Advantage**: Goes beyond static databases; understands current events and their supply chain implications
   - **Impact**: Provides nuanced risk assessments that traditional rule-based systems miss

### 3. **Explainable AI Recommendations**
   - **Novelty**: Not just alerts, but specific, prioritized action items with business context
   - **Advantage**: Procurement teams get clear next steps instead of vague warnings
   - **Impact**: Accelerates decision-making and reduces operational disruption costs

### 4. **Unified Risk Heatmap Visualization**
   - **Novelty**: Interactive geospatial and temporal risk mapping with drill-down capabilities
   - **Advantage**: Visual correlation of multiple risk factors across global supplier networks
   - **Impact**: Enables strategic portfolio optimization and contingency planning

### 5. **Zero-Configuration Onboarding**
   - **Novelty**: Upload CSV and get instant AI-powered analysis without complex setup
   - **Advantage**: Democratizes advanced risk intelligence for organizations of all sizes
   - **Impact**: Lowers adoption barriers and accelerates ROI

## MVP Highlights and Competitive Advantages

SwiftPath-AI's Minimum Viable Product delivers enterprise-grade features that surpass current market offerings:

### Core MVP Features
- **Authentication System**: Secure login/signup with user management
- **Supplier Portfolio Management**: Upload, view, and manage supplier databases
- **Live AI Scan Engine**: One-click risk analysis for entire portfolios
- **Risk Dashboard**: Real-time metrics, charts, and status indicators
- **Alert Management**: Prioritized risk notifications with resolution tracking
- **Report Generation**: Automated PDF/CSV exports with executive summaries
- **Agent Monitoring**: Live view of AI agent activities and health status

### Competitive Advantages Over Present Systems
- **Speed**: Real-time vs. quarterly/batch processing
- **Accuracy**: AI contextual analysis vs. rule-based scoring
- **Actionability**: Specific recommendations vs. generic alerts
- **Scalability**: Handles thousands of suppliers simultaneously
- **Cost-Effectiveness**: Zero infrastructure setup, pay-as-you-grow model
- **User Experience**: Intuitive dashboard vs. complex enterprise software

## Technology Stack

- **Frontend**: Next.js 16 App Router, TypeScript, Tailwind CSS v4
- **UI Components**: Radix-based shadcn/ui primitives, Recharts for data visualization
- **AI/ML**: Groq API for web-backed reasoning, Google Generative AI integration
- **Data Sources**: GDELT (news), Open-Meteo (weather), Yahoo Finance (financial), Custom sanctions database
- **Backend**: Next.js API routes with Node.js runtime
- **Data Management**: JSON-based persistence, CSV processing
- **Authentication**: Custom user store with session management

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

## API Endpoints

- `POST /api/analyze` - Run supplier risk analysis
- `GET /api/health` - System health check
- `GET/POST /api/history` - Analysis history management
- `POST /api/login` - User authentication
- `POST /api/signup` - User registration
- `GET /api/suppliers` - Supplier data retrieval
- `GET /api/news` - News intelligence
- `GET /api/weather` - Weather risk data
- `GET /api/reports/download` - Report generation

## Project Structure

```
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
        agents/
          page.tsx
        alerts/
          page.tsx
        news/
          page.tsx
        profile/
          page.tsx
        reports/
          heatmaps.tsx
          page.tsx
        settings/
          page.tsx
        suppliers/
          page.tsx
        weather/
          page.tsx
    api/
      analyze/
        route.ts
      export/
        route.ts
      health/
        route.ts
      history/
        route.ts
      login/
        route.ts
      logout/
        route.ts
      me/
        route.ts
      news/
        route.ts
      reports/
        download/
          route.ts
      seed/
        route.ts
      signup/
        route.ts
      suppliers/
        route.ts
      weather/
        route.ts
    globals.css
    layout.tsx
    page.tsx

  components/
    agent-log.tsx
    auth-showcase.tsx
    command-palette.tsx
    dashboard-shell.tsx
    live-scan-card.tsx
    logo.tsx
    navbar.tsx
    risk-gauge.tsx
    risk-heatmap-advanced.tsx
    risk-heatmap.tsx
    sidebar.tsx
    stat-card.tsx
    supplier-table.tsx
    theme-provider.tsx
    theme-toggle.tsx
    ui/
      avatar.tsx
      badge.tsx
      button.tsx
      card.tsx
      checkbox.tsx
      command.tsx
      dialog.tsx
      dropdown-menu.tsx
      input.tsx
      label.tsx
      scroll-area.tsx
      select.tsx
      separator.tsx
      skeleton.tsx
      tabs.tsx
      tooltip.tsx

  lib/
    csv.ts
    mock-data.ts
    pdf-generator.ts
    sample-suppliers.ts
    utils.ts
    server/
      auth-store.ts
      history-store.ts
      supplier-intelligence.ts
      user-store.ts

  types/
    index.ts

data/
  analysis-history.json
  sanctions_list.csv
  suppliers.json
  users.json

public/
  sample-suppliers.csv
```

## Setup and Installation

1. **Prerequisites**
   - Node.js >= 20
   - npm or yarn

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create `.env.local`:
   ```bash
   GROQ_API_KEY=your_groq_api_key_here
   GROQ_MODEL=groq/compound-mini
   ```

4. **Development Server**
   ```bash
   npm run dev
   ```

5. **Production Build**
   ```bash
   npm run build
   npm start
   ```

## Usage

1. **Sign Up/Login**: Create an account or log in
2. **Upload Suppliers**: Import CSV or use sample data
3. **Run Live Scan**: Trigger AI analysis for risk assessment
4. **Monitor Dashboard**: View risk metrics, heatmaps, and alerts
5. **Generate Reports**: Export insights and recommendations

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

## Architecture and Data Flow

1. **Input Processing**: CSV/JSON supplier data normalized and validated
2. **Agent Orchestration**: Parallel execution of specialized AI agents
3. **Signal Aggregation**: Weighted scoring from multiple data sources
4. **Risk Calculation**: Contextual analysis using Groq AI
5. **Recommendation Engine**: Actionable mitigation strategies
6. **Persistence**: Analysis history and alert tracking
7. **Visualization**: Interactive dashboard with real-time updates

## Future Roadmap

- Advanced ML models for predictive risk forecasting
- Integration with ERP systems (SAP, Oracle)
- Mobile application for field teams
- Blockchain-based supplier verification
- Multi-language support and global expansion

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

MIT License - see LICENSE file for details

## Contributing

Contributions welcome! Please read our contributing guidelines and code of conduct.

## Contact

For questions or support, please reach out to the development team.

