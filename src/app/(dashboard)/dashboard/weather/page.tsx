    "use client";

import { useEffect, useState } from "react";
import { Cloud, CloudRain, RefreshCw, Sun, Wind, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function weatherIcon(code: number) {
  if (code >= 95) return Zap;
  if (code >= 60) return CloudRain;
  if (code >= 3) return Cloud;
  return Sun;
}

function weatherLabel(code: number) {
  if (code >= 95) return "Thunderstorm";
  if (code >= 80) return "Heavy rain";
  if (code >= 60) return "Rain";
  if (code >= 45) return "Fog";
  if (code >= 3) return "Cloudy";
  return "Clear";
}

export default function WeatherPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchWeather() {
    setLoading(true);
    try {
      const res = await fetch("/api/weather");
      const json = await res.json();
      setData(json);
    } catch { setData([]); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchWeather(); }, []);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="section-eyebrow">Climate Risk</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">Weather Risk Monitor</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
            Real-time 7-day weather forecasts for key supplier countries via Open-Meteo. Severe weather = supply chain disruption risk.
          </p>
        </div>
        <Button variant="secondary" onClick={fetchWeather} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </section>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(9)].map((_, i) => <div key={i} className="h-48 rounded-3xl border border-white/10 bg-white/5 animate-pulse" />)}
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.map((country) => (
              <Card key={country.country} className="border-white/10 bg-white/5">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{country.country}</CardTitle>
                    <Badge variant={country.status === "critical" ? "danger" : country.status === "warning" ? "warning" : "success"}>
                      Risk {country.riskScore}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-2">
                      <CloudRain className="h-4 w-4 mx-auto text-blue-400" />
                      <p className="mt-1 text-xs text-muted">Precip</p>
                      <p className="font-mono text-sm text-foreground">{country.maxPrecipMm}mm</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-2">
                      <Wind className="h-4 w-4 mx-auto text-gray-400" />
                      <p className="mt-1 text-xs text-muted">Wind</p>
                      <p className="font-mono text-sm text-foreground">{country.maxWindKmh}km/h</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-2">
                      <Zap className="h-4 w-4 mx-auto text-yellow-400" />
                      <p className="mt-1 text-xs text-muted">Severe days</p>
                      <p className="font-mono text-sm text-foreground">{country.severeWeatherDays}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {(country.forecast ?? []).map((day: any, i: number) => {
                      const Icon = weatherIcon(day.weatherCode);
                      return (
                        <div key={i} title={`${day.date}: ${weatherLabel(day.weatherCode)}, ${day.maxTempC}°C`}
                          className="flex-1 flex flex-col items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
                          <Icon className="h-3 w-3 text-muted" />
                          <p className="text-[10px] text-muted">{day.date?.slice(5)}</p>
                        </div>
                      );
                    })}
                  </div>
                  {country.severeWeatherDays > 0 && (
                    <p className="text-xs text-warning">⚠ {country.severeWeatherDays} severe weather day(s) — potential disruption</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}