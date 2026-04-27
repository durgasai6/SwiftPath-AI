import { NextResponse } from "next/server";

export const runtime = "nodejs";

// 🔥 fallback image (stable)
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop";

// 🔥 dynamic image based on query
function getImage(query: string) {
  const q = query.toLowerCase();

  if (q.includes("war")) {
    return "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop";
  }
  if (q.includes("port") || q.includes("logistics")) {
    return "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=1200&auto=format&fit=crop";
  }
  if (q.includes("semiconductor")) {
    return "https://images.unsplash.com/photo-1581090700227-1e8b0a3b2d64?q=80&w=1200&auto=format&fit=crop";
  }

  return FALLBACK_IMAGE;
}

// 🔥 GDELT (fast timeout)
async function fetchGdelt(query: string) {
  try {
    const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(
      query
    )}&mode=artlist&maxrecords=10&sort=datedesc&format=json`;

    const res = await fetch(url, {
      signal: AbortSignal.timeout(4000),
    });

    const data = await res.json();

    return (data.articles ?? []).map((a: any) => ({
      title: a.title,
      url: a.url,
      source: a.domain ?? "GDELT",
      date: a.seendate,
      image: a.socialimage || a.image || getImage(query),
    }));
  } catch {
    return [];
  }
}

// 🔥 Google News RSS (always works)
async function fetchGoogleNews(query: string) {
  try {
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(
      query
    )}`;

    const res = await fetch(url);
    const xml = await res.text();

    const items = xml.split("<item>").slice(1);

    return items.slice(0, 10).map((item) => {
      const title = item.match(/<title>(.*?)<\/title>/)?.[1] || "";
      const link = item.match(/<link>(.*?)<\/link>/)?.[1] || "";

      return {
        title,
        url: link,
        source: "Google News",
        image: getImage(query),
      };
    });
  } catch {
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "supply chain";

  let articles = await fetchGdelt(query);

  if (articles.length === 0) {
    articles = await fetchGoogleNews(query);
  }

  return NextResponse.json({ articles });
}