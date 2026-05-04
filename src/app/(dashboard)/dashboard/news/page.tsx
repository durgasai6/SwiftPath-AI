"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1485217988980-11786ced9454?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop"
];

const CATEGORIES = [
  "supply chain",
  "logistics",
  "port congestion",
  "semiconductor",
  "trade sanctions",
  "war"
];

function getArticleImage(article: any, index: number) {
  if (!article?.image || article.image === FALLBACK_IMAGE) {
    return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  }

  return article.image;
}

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
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="section-eyebrow">News Monitor</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">Supply Chain News</h2>
        </div>

        <div className="flex w-full gap-2 md:max-w-md">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setQuery(input)}
            placeholder="Search news..."
            className="flex-1"
          />
          <Button onClick={() => setQuery(input)}>
            <Newspaper className="h-4 w-4" />
          </Button>
        </div>
      </div>

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

      {loading ? (
        <p className="text-muted">Loading news...</p>
      ) : articles.length === 0 ? (
        <p className="text-muted">No news found</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {articles.map((a, i) => (
            <Card key={i} className="flex h-full flex-col overflow-hidden border-white/10 bg-white/5">
              <img
                src={getArticleImage(a, i)}
                alt={a.title}
                className="w-full h-48 object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];
                }}
              />

              <CardContent className="flex flex-1 flex-col gap-2 p-4">
                <div className="text-xs text-muted">{a.source}</div>

                <p className="line-clamp-3 font-medium leading-6 text-foreground">{a.title}</p>

                <a
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto flex items-center gap-1 pt-2 text-sm text-blue-400"
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
