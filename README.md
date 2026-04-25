# SwiftPath-AI

## 🧭 Project Overview

SwiftPath is a multi-agent AI system that monitors and scores supplier risk in real time using news sentiment, financial signals, weather disruptions, geopolitical events, and sanctions data. It provides explainable risk scores (0–100) per supplier via a clean Streamlit dashboard backed by a FastAPI REST API.

---

## 📁 Folder Structure

```
swiftpath/
│
├── agents/
│   ├── __init__.py
│   ├── news_agent.py          # Fetches & scores news sentiment
│   ├── weather_agent.py       # Checks weather disruptions by region
│   ├── geo_agent.py           # Geopolitical risk heuristics
│   ├── financial_agent.py     # Stock/financial signal via yfinance
│   └── sanctions_agent.py     # Checks against static sanctions list
│
├── engine/
│   ├── __init__.py
│   ├── risk_scorer.py         # Weighted aggregation → 0-100 score
│   └── recommendation.py     # LLM-based reasoning via Anthropic API
│
├── backend/
│   ├── __init__.py
│   ├── main.py                # FastAPI app entry point
│   ├── routes.py              # API route definitions
│   ├── models.py              # Pydantic models
│   └── database.py            # SQLite setup via SQLAlchemy
│
├── frontend/
│   └── app.py                 # Streamlit dashboard
│
├── data/
│   ├── sample_suppliers.csv   # Sample supplier upload file
│   ├── sanctions_list.csv     # Static sanctions reference data
│   └── swiftpath.db           # SQLite database (auto-created)
│
├── .env.example               # Environment variable template
├── requirements.txt           # Python dependencies
└── README.md
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Streamlit |
| Backend | FastAPI |
| Database | SQLite + SQLAlchemy |
| Sentiment Analysis | HuggingFace Transformers |
| Financial Data | yfinance (Yahoo Finance) |
| Weather Data | Open-Meteo API (free, no key) |
| News Data | NewsAPI (free tier) |
| LLM Reasoning | Anthropic Claude API |
| Language | Python 3.10+ |

---

## 🔑 Prerequisites

Before you begin, make sure you have the following installed:

- Python 3.10 or higher
- pip (Python package manager)
- Git
- A free NewsAPI key → https://newsapi.org
- An Anthropic API key → https://console.anthropic.com

---

## 🚀 Setup Instructions

### Step 1 — Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/swiftpath.git
cd swiftpath
```

### Step 2 — Create a Virtual Environment

```bash
# Create the virtual environment
python -m venv venv

# Activate it — Mac/Linux
source venv/bin/activate

# Activate it — Windows
venv\Scripts\activate
```

### Step 3 — Install Dependencies

```bash
pip install -r requirements.txt
```

Your `requirements.txt` will include:

```
fastapi
uvicorn
streamlit
sqlalchemy
pydantic
anthropic
transformers
torch
yfinance
requests
python-dotenv
pandas
httpx
```

### Step 4 — Configure Environment Variables

Copy the example env file and fill in your keys:

```bash
cp .env.example .env
```

Open `.env` and set the following:

```
ANTHROPIC_API_KEY=your_anthropic_key_here
NEWS_API_KEY=your_newsapi_key_here
```

### Step 5 — Initialize the Database

```bash
python -c "from backend.database import init_db; init_db()"
```

This creates `data/swiftpath.db` automatically with the required tables.

### Step 6 — Start the FastAPI Backend

Open a terminal and run:

```bash
uvicorn backend.main:app --reload --port 8000
```

The API will be live at: `http://localhost:8000`
Interactive API docs at: `http://localhost:8000/docs`

### Step 7 — Start the Streamlit Frontend

Open a second terminal (keep backend running) and run:

```bash
streamlit run frontend/app.py
```

The dashboard will open at: `http://localhost:8501`

---

## 📊 How to Use

1. Open the Streamlit dashboard at `http://localhost:8501`
2. Upload your supplier CSV file using the uploader in the sidebar
3. The CSV must follow this format:

```
supplier_name, country, industry, stock_ticker
Acme Corp, China, Electronics, ACME
Global Parts Ltd, Russia, Automotive,
sunrise_textiles, India, Apparel, SRT
```

4. Click **"Run Risk Analysis"**
5. The system will run all 5 agents per supplier in parallel
6. View the risk score (0–100), risk level badge (Low / Medium / High / Critical), and the AI-generated explanation per supplier
7. Use the filters to sort by risk level or country

---

## 🤖 Agent Descriptions

**News Agent** — Searches recent headlines for each supplier using NewsAPI and runs HuggingFace sentiment analysis (`distilbert-base-uncased-finetuned-sst-2-english`) to score news tone. Negative coverage increases risk.

**Weather Agent** — Calls Open-Meteo API using the supplier's country coordinates to check for severe weather conditions (storms, floods, extreme temperatures) that could disrupt supply chains.

**Geopolitical Agent** — Uses a rule-based scoring system based on country risk index data. Countries are pre-mapped to risk tiers (Low / Medium / High / Very High) based on known geopolitical instability indicators.

**Financial Agent** — Uses `yfinance` to pull the supplier's stock ticker data (if available). Checks for recent price drops, high volatility, and poor momentum as financial distress signals.

**Sanctions Agent** — Checks the supplier name and country against a locally stored `sanctions_list.csv` derived from publicly available OFAC and EU sanctions data. Returns a binary flag + partial match scoring.

---

## 🧮 Risk Scoring Logic

Each agent returns a sub-score between 0 and 100. The final risk score is a weighted average:

| Agent | Weight |
|---|---|
| News Sentiment | 25% |
| Financial Signals | 25% |
| Geopolitical Risk | 20% |
| Weather Disruption | 15% |
| Sanctions Check | 15% |

**Risk Level Thresholds:**

| Score | Level |
|---|---|
| 0–25 | 🟢 Low |
| 26–50 | 🟡 Medium |
| 51–75 | 🔴 High |
| 76–100 | 🚨 Critical |

---

## 💡 Recommendation Engine

After scoring, the `recommendation.py` module sends the full risk breakdown to Claude via the Anthropic API. Claude returns a 3–5 sentence plain-English explanation covering:

- The top risk drivers for that supplier
- What supply chain impact is likely
- A recommended action (e.g. "Diversify sourcing", "Increase inventory buffer", "Escalate for review")

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/suppliers/upload` | Upload supplier CSV |
| GET | `/suppliers/` | List all suppliers |
| GET | `/suppliers/{id}/risk` | Get risk score for a supplier |
| POST | `/suppliers/analyze` | Run full analysis on all suppliers |
| GET | `/health` | Health check |

---

## 🧪 Sample Data

A sample `data/sample_suppliers.csv` is included with 10 fictional suppliers across different countries and industries so you can test the system immediately without needing real data.

---

## 🛣️ Roadmap (Post-MVP)

- Real-time OFAC sanctions API integration
- Supplier historical risk trend charts
- Email/Slack alerting for critical suppliers
- Multi-user authentication
- Docker + deployment to AWS/GCP
- Scheduled background re-analysis (APScheduler)
- PDF risk report export

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 👤 Author

Built by [Your Name] · Powered by Anthropic Claude, HuggingFace, and open data sources.

---

> ⚡ SwiftPath — Know your supplier risks before they know you.
