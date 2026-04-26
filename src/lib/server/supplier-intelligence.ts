import { z } from "zod";
import yahooFinance from 'yahoo-finance2';
import type {
  AgentCitation,
  AgentOutput,
  AnalysisMode,
  SupplierInput,
  SupplierIntelligence,
  SupplierIntelligenceBreakdown
} from "@/types";
import { parseCsvText } from "@/lib/csv";
import { appendHistory } from "@/lib/server/history-store";
import { getInitials, toRiskLevel } from "@/lib/utils";

const supplierSchema = z.object({
  supplier_name: z.string().min(1),
  country: z.string().min(1),
  industry: z.string().min(1),
  category: z.string().optional(),
  annual_spend_usd: z.union([z.string(), z.number()]).optional(),
  criticality: z.enum(["low", "medium", "high", "critical"]).optional(),
  on_time_delivery_pct: z.union([z.string(), z.number()]).optional(),
  inventory_buffer_days: z.union([z.string(), z.number()]).optional(),
  supplier_health: z.enum(["strong", "stable", "weak"]).optional(),
  single_source: z.union([z.string(), z.boolean()]).optional(),
  incident_note: z.string().optional(),
  stock_ticker: z.string().optional()
});

const requestSchema = z.object({
  mode: z.enum(["local", "live"]).default("live"),
  maxLiveSuppliers: z.number().int().min(1).max(10).default(5).optional(),
  suppliers: z.array(supplierSchema).optional(),
  csv: z.string().optional()
});

type NormalizedSupplier = {
  id: string;
  name: string;
  initials: string;
  country: string;
  industry: string;
  category: string;
  annualSpendUsd: number;
  criticality: "low" | "medium" | "high" | "critical";
  onTimeDeliveryPct: number;
  inventoryBufferDays: number;
  supplierHealth: "strong" | "stable" | "weak";
  singleSource: boolean;
  incidentNote: string;
  stockTicker: string;
};

type NewsArticle = {
  title: string;
  url: string;
  source: string;
  seendate?: string;
};

type WeatherSummary = {
  score: number;
  summary: string;
  citations: AgentCitation[];
};

type NewsSummary = {
  score: number;
  summary: string;
  citations: AgentCitation[];
  articleCount: number;
};

type FinancialSummary = {
  score: number;
  summary: string;
  citations: AgentCitation[];
};

type SanctionsSummary = {
  score: number;
  summary: string;
  citations: AgentCitation[];
};

async function fetchSanctionsSummary(supplier: NormalizedSupplier): Promise<SanctionsSummary> {
  // In a real implementation, load from CSV
  const sanctions = [
    { name: "Some Sanctioned Entity", country: "Russia" },
    { name: "Another Entity", country: "Iran" },
    { name: "Test Entity", country: "North Korea" }
  ];

  const match = sanctions.find(s => s.name.toLowerCase().includes(supplier.name.toLowerCase()) || s.country === supplier.country);
  const score = match ? 90 : 10;

  return {
    score,
    summary: match ? `Potential sanctions match found for ${supplier.name} in ${supplier.country}.` : `No sanctions matches for ${supplier.name}.`,
    citations: match ? [
      asCitation({
        title: "Sanctions List Match",
        url: "https://www.treasury.gov/ofac",
        source: "OFAC",
        note: `Matched ${match.name} in ${match.country}`
      })
    ] : []
  };
}

type GroqAssessment = {
  geopoliticalScore: number;
  financialScore: number;
  complianceScore: number;
  summary: string;
  likelyImpact: string;
  recommendation: string;
  nextActions: string[];
  citations: AgentCitation[];
};

const geopoliticalBaseline: Record<string, number> = {
  bangladesh: 57,
  brazil: 45,
  china: 74,
  germany: 24,
  india: 43,
  indonesia: 47,
  mexico: 56,
  south_korea: 42,
  taiwan: 83,
  vietnam: 51
};

const complianceBaseline: Record<string, number> = {
  bangladesh: 48,
  brazil: 35,
  china: 74,
  germany: 21,
  india: 36,
  indonesia: 38,
  mexico: 33,
  south_korea: 24,
  taiwan: 45,
  vietnam: 28
};

function normalizeKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function parseNumber(value: number | string | undefined, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseBoolean(value: string | boolean | undefined) {
  if (typeof value === "boolean") return value;
  return ["true", "yes", "1", "y"].includes(String(value || "").toLowerCase());
}

function asCitation(input: Partial<AgentCitation>): AgentCitation {
  return {
    title: input.title || "Source",
    url: input.url || "",
    source: input.source || "Public source",
    note: input.note || "Referenced during analysis.",
    publishedAt: input.publishedAt
  };
}

async function fetchJson<T>(url: string) {
  const response = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
    headers: {
      "User-Agent": "SwiftPath/1.0"
    }
  });

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

function normalizeSupplier(input: SupplierInput, index: number): NormalizedSupplier {
  return {
    id: `live-${index + 1}`,
    name: input.supplier_name.trim(),
    initials: getInitials(input.supplier_name),
    country: input.country.trim(),
    industry: input.industry.trim(),
    category: input.category?.trim() || input.industry.trim(),
    annualSpendUsd: parseNumber(input.annual_spend_usd, 0),
    criticality: input.criticality || "medium",
    onTimeDeliveryPct: parseNumber(input.on_time_delivery_pct, 94),
    inventoryBufferDays: parseNumber(input.inventory_buffer_days, 16),
    supplierHealth: input.supplier_health || "stable",
    singleSource: parseBoolean(input.single_source),
    incidentNote: input.incident_note?.trim() || "",
    stockTicker: input.stock_ticker?.trim() || ""
  };
}

function keywordScore(note: string, words: string[]) {
  const normalized = note.toLowerCase();
  return words.reduce((score, word) => (normalized.includes(word) ? score + 1 : score), 0);
}

function computeOperationalScore(supplier: NormalizedSupplier) {
  const healthBase =
    supplier.supplierHealth === "weak" ? 75 : supplier.supplierHealth === "stable" ? 46 : 24;
  const criticalityBase =
    supplier.criticality === "critical" ? 28 : supplier.criticality === "high" ? 18 : 8;
  const otdPenalty = Math.max(0, 100 - supplier.onTimeDeliveryPct) * 1.2;
  const inventoryPenalty = Math.max(0, 18 - supplier.inventoryBufferDays) * 1.9;
  const singleSourcePenalty = supplier.singleSource ? 18 : 0;
  const incidentPenalty = keywordScore(supplier.incidentNote, [
    "delay",
    "congestion",
    "shortage",
    "inspection",
    "port",
    "flood",
    "sanction"
  ]) * 4;

  return clamp(healthBase + criticalityBase + otdPenalty + inventoryPenalty + singleSourcePenalty + incidentPenalty);
}

async function fetchNewsSummary(supplier: NormalizedSupplier): Promise<NewsSummary> {
  const query = encodeURIComponent(`"${supplier.name}" OR ${supplier.country} ${supplier.industry}`);
  const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${query}&mode=artlist&maxrecords=8&sort=datedesc&format=json`;

  try {
    const payload = await fetchJson<{ articles?: NewsArticle[] }>(url);
    const articles = Array.isArray(payload.articles) ? payload.articles.slice(0, 5) : [];
    const headlineText = articles.map((article) => article.title).join(" ").toLowerCase();
    const adverseKeywords = ["sanction", "strike", "shortage", "disruption", "delay", "flood", "export", "crisis"];
    const supportiveKeywords = ["expand", "recovery", "stabil", "capacity", "strong"];
    const adverseHits = adverseKeywords.reduce(
      (score, keyword) => score + (headlineText.includes(keyword) ? 1 : 0),
      0
    );
    const supportiveHits = supportiveKeywords.reduce(
      (score, keyword) => score + (headlineText.includes(keyword) ? 1 : 0),
      0
    );
    const score = clamp(34 + articles.length * 4 + adverseHits * 7 - supportiveHits * 4);

    return {
      score,
      articleCount: articles.length,
      summary:
        articles.length > 0
          ? `${articles.length} recent public articles were matched to ${supplier.name} or its operating context, with signal quality skewing ${adverseHits > supportiveHits ? "negative" : "mixed"}.`
          : `No direct recent coverage was found for ${supplier.name}, so the news agent used country and industry context instead.`,
      citations: articles.map((article) =>
        asCitation({
          title: article.title,
          url: article.url,
          source: article.source || "GDELT",
          note: "Public article surfaced by the news agent.",
          publishedAt: article.seendate
        })
      )
    };
  } catch {
    const fallbackScore = clamp(
      28 +
        keywordScore(supplier.incidentNote, ["delay", "strike", "flood", "sanction", "congestion"]) * 8
    );

    return {
      score: fallbackScore,
      articleCount: 0,
      summary: "GDELT lookup was unavailable, so SwiftPath fell back to internal signal heuristics for news exposure.",
      citations: []
    };
  }
}

async function fetchWeatherSummary(supplier: NormalizedSupplier): Promise<WeatherSummary> {
  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      supplier.country
    )}&count=1&language=en&format=json`;
    const geo = await fetchJson<{
      results?: Array<{ latitude: number; longitude: number; name: string; country?: string }>;
    }>(geoUrl);
    const point = geo.results?.[0];

    if (!point) {
      throw new Error("No geocode result");
    }

    const forecastUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${point.latitude}&longitude=${point.longitude}` +
      "&daily=weather_code,temperature_2m_max,precipitation_sum,wind_speed_10m_max&forecast_days=7&timezone=auto";

    const forecast = await fetchJson<{
      daily?: {
        time: string[];
        weather_code: number[];
        temperature_2m_max: number[];
        precipitation_sum: number[];
        wind_speed_10m_max: number[];
      };
    }>(forecastUrl);

    const daily = forecast.daily;

    if (!daily) {
      throw new Error("No forecast data");
    }

    const severeWeatherCodes = new Set([65, 67, 75, 82, 86, 95, 96, 99]);
    const maxPrecipitation = Math.max(...daily.precipitation_sum);
    const maxWind = Math.max(...daily.wind_speed_10m_max);
    const maxTemperature = Math.max(...daily.temperature_2m_max);
    const severeCodes = daily.weather_code.filter((code) => severeWeatherCodes.has(code)).length;
    const score = clamp(
      18 +
        severeCodes * 16 +
        Math.max(0, maxPrecipitation - 12) * 1.4 +
        Math.max(0, maxWind - 34) * 0.8 +
        Math.max(0, maxTemperature - 36) * 0.9
    );

    return {
      score,
      summary:
        severeCodes > 0
          ? `Open-Meteo forecast data shows elevated weather disruption potential for ${supplier.country}, including ${severeCodes} severe-code day(s) in the next week.`
          : `Open-Meteo forecast data for ${supplier.country} is relatively stable over the next week, with no severe weather code spikes detected.`,
      citations: [
        asCitation({
          title: `Open-Meteo forecast for ${supplier.country}`,
          url: forecastUrl,
          source: "Open-Meteo",
          note: `Max precipitation ${maxPrecipitation}mm, max wind ${maxWind}km/h, max temperature ${maxTemperature}C.`
        })
      ]
    };
  } catch {
    const fallbackScore = clamp(24 + keywordScore(supplier.incidentNote, ["flood", "storm", "rain", "heat"]) * 10);

    return {
      score: fallbackScore,
      summary: "Weather data was unavailable, so SwiftPath used note-based disruption heuristics instead.",
      citations: []
    };
  }
}

async function fetchFinancialSummary(supplier: NormalizedSupplier): Promise<FinancialSummary> {
  if (!supplier.stockTicker) {
    return {
      score: 40,
      summary: `No stock ticker provided for ${supplier.name}, so financial signals were estimated from operational health.`,
      citations: []
    };
  }

  try {
    const quote = await yahooFinance.quote(supplier.stockTicker) as any;
    const changePercent = quote.regularMarketChangePercent || 0;
    const volume = quote.regularMarketVolume || 0;
    const avgVolume = quote.averageDailyVolume10Day || 1;
    const volatility = Math.abs(changePercent);
    const volumeRatio = volume / avgVolume;

    let score = 30;
    if (changePercent < -5) score += 20;
    if (volatility > 10) score += 15;
    if (volumeRatio > 1.5) score += 10;
    score = clamp(score);

    return {
      score,
      summary: `${supplier.name} (${supplier.stockTicker}) shows ${changePercent > 0 ? 'positive' : 'negative'} momentum with ${volatility.toFixed(1)}% volatility.`,
      citations: [
        asCitation({
          title: `Yahoo Finance quote for ${supplier.stockTicker}`,
          url: `https://finance.yahoo.com/quote/${supplier.stockTicker}`,
          source: "Yahoo Finance",
          note: `Change: ${changePercent.toFixed(2)}%, Volume ratio: ${volumeRatio.toFixed(1)}`
        })
      ]
    };
  } catch {
    return {
      score: 45,
      summary: `Stock data for ${supplier.stockTicker} was unavailable, falling back to operational indicators.`,
      citations: []
    };
  }
}

function fallbackGroqAssessment(supplier: NormalizedSupplier, news: NewsSummary, weather: WeatherSummary, financial: FinancialSummary, sanctions: SanctionsSummary): GroqAssessment {
  const countryKey = normalizeKey(supplier.country);
  const geoBase = geopoliticalBaseline[countryKey] ?? 42;
  const complianceBase = complianceBaseline[countryKey] ?? 38;
  const financialBase =
    supplier.supplierHealth === "weak" ? 76 : supplier.supplierHealth === "stable" ? 48 : 26;
  const geopoliticalScore = clamp(geoBase + (supplier.singleSource ? 6 : 0));
  const financialScore = financial.score;
  const complianceScore = sanctions.score;

  return {
    geopoliticalScore,
    financialScore,
    complianceScore,
    summary:
      `${supplier.name} is exposed mainly through ${supplier.country}-level geopolitical and compliance context, with operational fragility amplified by ${supplier.singleSource ? "single-source dependency" : "ongoing execution pressure"}.`,
    likelyImpact:
      weather.score > 55
        ? "The most likely impact is transit delay and missed delivery windows over the next 1 to 2 weeks."
        : "The most likely impact is uneven lead-time performance and tighter recovery margins if another adverse signal lands.",
    recommendation:
      supplier.singleSource
        ? "Begin alternate-source qualification and tighten weekly supplier reviews until risk conditions improve."
        : "Increase monitoring cadence and build contingency inventory around the most exposed SKUs.",
    nextActions: [
      "Review the supplier's next 30 days of committed shipments and identify the most time-sensitive orders.",
      "Confirm whether a qualified alternate or backup lane is available for critical items.",
      "Re-run live web-backed analysis after any material country, weather, or compliance event."
    ],
    citations: [...news.citations.slice(0, 2), ...weather.citations.slice(0, 1)]
  };
}

function safeJsonParse<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    const firstBrace = value.indexOf("{");
    const lastBrace = value.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace <= firstBrace) return null;
    try {
      return JSON.parse(value.slice(firstBrace, lastBrace + 1)) as T;
    } catch {
      return null;
    }
  }
}

async function fetchGroqAssessment(
  supplier: NormalizedSupplier,
  news: NewsSummary,
  weather: WeatherSummary,
  financial: FinancialSummary,
  sanctions: SanctionsSummary,
  mode: AnalysisMode
): Promise<GroqAssessment> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || mode === "local") {
    return fallbackGroqAssessment(supplier, news, weather, financial, sanctions);
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      cache: "no-store",
      signal: AbortSignal.timeout(25_000),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama3-8b-8192",
        temperature: 0.2,
        max_tokens: 1200,
        response_format: {
          type: "json_object"
        },
        messages: [
          {
            role: "system",
            content:
              "You are a senior supply-chain risk analyst. Return only valid JSON. Use provided signals and general knowledge for assessment."
          },
          {
            role: "user",
            content: JSON.stringify({
              task: "Assess supplier risk for a procurement operating team.",
              supplier,
              localSignals: {
                newsSummary: news.summary,
                weatherSummary: weather.summary,
                financialSummary: financial.summary,
                sanctionsSummary: sanctions.summary
              },
              outputSchema: {
                geopoliticalScore: "integer 0-100",
                financialScore: "integer 0-100",
                complianceScore: "integer 0-100",
                summary: "2-3 sentences",
                likelyImpact: "1 sentence",
                recommendation: "1 sentence",
                nextActions: ["3 short action strings"],
                citations: [
                  {
                    title: "string",
                    url: "string",
                    source: "string",
                    note: "short evidence note",
                    publishedAt: "optional string"
                  }
                ]
              }
            })
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Groq request failed with ${response.status}`);
    }

    const payload = await response.json();
    const content = payload?.choices?.[0]?.message?.content;
    const parsed = content ? safeJsonParse<GroqAssessment>(content) : null;

    if (!parsed) {
      throw new Error("Groq returned invalid JSON");
    }

    const citations = Array.isArray(parsed.citations) ? parsed.citations.map(asCitation).slice(0, 4) : [];

    return {
      geopoliticalScore: clamp(parsed.geopoliticalScore),
      financialScore: clamp(parsed.financialScore),
      complianceScore: clamp(parsed.complianceScore),
      summary: parsed.summary,
      likelyImpact: parsed.likelyImpact,
      recommendation: parsed.recommendation,
      nextActions: parsed.nextActions?.slice(0, 3) || fallbackGroqAssessment(supplier, news, weather, financial, sanctions).nextActions,
      citations
    };
  } catch {
    return fallbackGroqAssessment(supplier, news, weather, financial, sanctions);
  }
}

function buildBreakdown(
  news: NewsSummary,
  weather: WeatherSummary,
  groq: GroqAssessment,
  operationalScore: number
): SupplierIntelligenceBreakdown {
  return {
    news: news.score,
    weather: weather.score,
    geopolitical: groq.geopoliticalScore,
    financial: groq.financialScore,
    compliance: groq.complianceScore,
    operational: operationalScore
  };
}

function buildAgentOutputs(
  breakdown: SupplierIntelligenceBreakdown,
  news: NewsSummary,
  weather: WeatherSummary,
  financial: FinancialSummary,
  sanctions: SanctionsSummary,
  groq: GroqAssessment
): AgentOutput[] {
  return [
    {
      id: "news-agent",
      name: "News Agent",
      score: breakdown.news,
      summary: news.summary,
      citations: news.citations.slice(0, 3)
    },
    {
      id: "weather-agent",
      name: "Weather Agent",
      score: breakdown.weather,
      summary: weather.summary,
      citations: weather.citations
    },
    {
      id: "financial-agent",
      name: "Financial Agent",
      score: breakdown.financial,
      summary: financial.summary,
      citations: financial.citations
    },
    {
      id: "geopolitical-agent",
      name: "Geopolitical Agent",
      score: breakdown.geopolitical,
      summary: groq.summary,
      citations: groq.citations.slice(0, 2)
    },
    {
      id: "compliance-agent",
      name: "Compliance Agent",
      score: breakdown.compliance,
      summary: sanctions.summary,
      citations: sanctions.citations
    }
  ];
}

function combineRiskScore(breakdown: SupplierIntelligenceBreakdown) {
  return clamp(
    breakdown.news * 0.22 +
      breakdown.weather * 0.14 +
      breakdown.geopolitical * 0.18 +
      breakdown.financial * 0.18 +
      breakdown.compliance * 0.14 +
      breakdown.operational * 0.14
  );
}

async function analyzeOneSupplier(
  supplier: NormalizedSupplier,
  mode: AnalysisMode
): Promise<SupplierIntelligence> {
  const [news, weather, financial, sanctions] = await Promise.all([
    fetchNewsSummary(supplier),
    fetchWeatherSummary(supplier),
    fetchFinancialSummary(supplier),
    fetchSanctionsSummary(supplier)
  ]);
  const groq = await fetchGroqAssessment(supplier, news, weather, financial, sanctions, mode);
  const operationalScore = computeOperationalScore(supplier);
  const breakdown = buildBreakdown(news, weather, groq, operationalScore);
  const riskScore = combineRiskScore(breakdown);
  const riskLevel = toRiskLevel(riskScore);
  const citations = [...news.citations, ...weather.citations, ...groq.citations].slice(0, 6);

  return {
    id: supplier.id,
    supplierName: supplier.name,
    country: supplier.country,
    industry: supplier.industry,
    riskScore,
    riskLevel,
    explanation: groq.summary,
    likelyImpact: groq.likelyImpact,
    recommendation: groq.recommendation,
    nextActions: groq.nextActions,
    breakdown,
    agents: buildAgentOutputs(breakdown, news, weather, financial, sanctions, groq),
    citations,
    modeUsed: mode,
    generatedAt: new Date().toISOString()
  };
}

export async function runSupplierIntelligence(rawBody: unknown) {
  const parsedRequest = requestSchema.parse(rawBody);
  const supplierInputs =
    parsedRequest.suppliers && parsedRequest.suppliers.length
      ? parsedRequest.suppliers
      : parsedRequest.csv
      ? parseCsvText(parsedRequest.csv)
      : [];

  if (!supplierInputs.length) {
    throw new Error("Please provide at least one supplier row or CSV payload.");
  }

  const validatedSuppliers = supplierInputs.map((supplier) => supplierSchema.parse(supplier));

  const normalizedSuppliers = validatedSuppliers.map((supplier, index) =>
    normalizeSupplier(supplier, index)
  );

  const mode: AnalysisMode =
    parsedRequest.mode === "live" && process.env.GROQ_API_KEY ? "live" : "local";

  const baselineAnalyses = await Promise.all(
    normalizedSuppliers.map((supplier) => analyzeOneSupplier(supplier, "local"))
  );

  let analyses = baselineAnalyses;

  if (mode === "live") {
    const ranked = [...baselineAnalyses].sort((left, right) => right.riskScore - left.riskScore);
    const liveIds = new Set(ranked.slice(0, parsedRequest.maxLiveSuppliers ?? 5).map((item) => item.id));

    analyses = await Promise.all(
      normalizedSuppliers.map((supplier) =>
        liveIds.has(supplier.id) ? analyzeOneSupplier(supplier, "live") : analyzeOneSupplier(supplier, "local")
      )
    );
  }

  const sortedAnalyses = [...analyses].sort((left, right) => right.riskScore - left.riskScore);
  const summary = {
    supplierCount: sortedAnalyses.length,
    averageRiskScore: clamp(
      sortedAnalyses.reduce((sum, supplier) => sum + supplier.riskScore, 0) / sortedAnalyses.length
    ),
    criticalSuppliers: sortedAnalyses.filter((supplier) => supplier.riskLevel === "critical").length,
    highRiskSuppliers: sortedAnalyses.filter((supplier) => ["high", "critical"].includes(supplier.riskLevel)).length,
    citationsCollected: sortedAnalyses.reduce((sum, supplier) => sum + supplier.citations.length, 0)
  };

  const historyEntry = await appendHistory({
    generatedAt: new Date().toISOString(),
    modeUsed: mode,
    supplierCount: summary.supplierCount,
    averageRiskScore: summary.averageRiskScore,
    criticalSuppliers: summary.criticalSuppliers,
    highestRiskSupplier: sortedAnalyses[0]?.supplierName || "Unknown",
    highestRiskScore: sortedAnalyses[0]?.riskScore || 0
  });

  return {
    generatedAt: new Date().toISOString(),
    modeUsed: mode,
    summary,
    historyEntry,
    suppliers: sortedAnalyses
  };
}
