import { NextResponse } from "next/server";

export const runtime = "nodejs";

const SUPPLIER_COUNTRIES = [
  { name: "China", lat: 35.86, lon: 104.19 },
  { name: "Taiwan", lat: 23.69, lon: 120.96 },
  { name: "India", lat: 20.59, lon: 78.96 },
  { name: "Vietnam", lat: 14.05, lon: 108.27 },
  { name: "Bangladesh", lat: 23.68, lon: 90.35 },
  { name: "Indonesia", lat: -0.78, lon: 113.92 },
  { name: "Mexico", lat: 23.63, lon: -102.55 },
  { name: "Germany", lat: 51.16, lon: 10.45 },
  { name: "South Korea", lat: 35.90, lon: 127.76 },
  { name: "Brazil", lat: -14.23, lon: -51.92 }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const countryName = searchParams.get("country");

  const targets = countryName
    ? SUPPLIER_COUNTRIES.filter(c => c.name.toLowerCase().includes(countryName.toLowerCase()))
    : SUPPLIER_COUNTRIES;

  const results = await Promise.all(
    targets.map(async (c) => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&daily=weather_code,temperature_2m_max,precipitation_sum,wind_speed_10m_max&forecast_days=7&timezone=auto`;
        const res = await fetch(url, { signal: AbortSignal.timeout(8_000) });
        const data = await res.json() as any;
        const daily = data.daily ?? {};
        const severeCount = (daily.weather_code ?? []).filter((code: number) => [65,67,75,82,86,95,96,99].includes(code)).length;
        const maxPrecip = Math.max(...(daily.precipitation_sum ?? [0]));
        const maxWind = Math.max(...(daily.wind_speed_10m_max ?? [0]));
        const maxTemp = Math.max(...(daily.temperature_2m_max ?? [0]));
        const riskScore = Math.min(100, Math.round(18 + severeCount * 16 + Math.max(0, maxPrecip - 12) * 1.4 + Math.max(0, maxWind - 34) * 0.8));
        return {
          country: c.name,
          lat: c.lat,
          lon: c.lon,
          riskScore,
          severeWeatherDays: severeCount,
          maxPrecipMm: Math.round(maxPrecip),
          maxWindKmh: Math.round(maxWind),
          maxTempC: Math.round(maxTemp),
          forecast: (daily.time ?? []).map((date: string, i: number) => ({
            date,
            weatherCode: daily.weather_code?.[i] ?? 0,
            precipMm: daily.precipitation_sum?.[i] ?? 0,
            windKmh: daily.wind_speed_10m_max?.[i] ?? 0,
            maxTempC: daily.temperature_2m_max?.[i] ?? 0
          })),
          status: riskScore >= 60 ? "critical" : riskScore >= 35 ? "warning" : "ok"
        };
      } catch {
        return { country: c.name, lat: c.lat, lon: c.lon, riskScore: 0, error: true, status: "unknown", forecast: [] };
      }
    })
  );

  return NextResponse.json(results);
}