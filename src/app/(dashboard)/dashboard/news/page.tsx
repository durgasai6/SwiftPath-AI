"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop";

const CATEGORIES = [
  "supply chain",
  "logistics",
  "port congestion",
  "semiconductor",
  "trade sanctions",
  "war"
];

export default function NewsPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("supply chain");
  const [input, setInput] = useState("supply chain");

  async function fetchNews(q: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/news?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setArticles(data.articles || []);
    } catch {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNews(query);
  }, [query]);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h2 className="text-3xl font-semibold text-white">
          Supply Chain News
        </h2>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setQuery(input)}
            placeholder="Search news..."
          />
          <Button onClick={() => setQuery(input)}>
            <Newspaper className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* CATEGORY FILTERS */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <Button
            key={c}
            variant="secondary"
            onClick={() => {
              setInput(c);
              setQuery(c);
            }}
          >
            {c}
          </Button>
        ))}
      </div>

      {/* NEWS */}
      {loading ? (
        <p className="text-muted">Loading news...</p>
      ) : articles.length === 0 ? (
        <p className="text-muted">No news found</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {articles.map((a, i) => (
            <Card key={i} className="overflow-hidden bg-white/5 border-white/10">

              {/* IMAGE */}
              <img
                src={a.image}
                alt={a.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                }}
              />

              <CardContent className="p-4 space-y-2">
                <div className="text-xs text-muted">
                  {a.source}
                </div>

                <p className="text-white font-medium leading-6">
                  {a.title}
                </p>

                <a
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 flex items-center gap-1 text-sm"
                >
                  Read <ExternalLink className="h-3 w-3" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}