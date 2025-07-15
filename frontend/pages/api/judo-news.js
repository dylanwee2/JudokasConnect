import { scrapeAndCacheIJFNews } from "./judo-scrape.js";

export default async function handler(req, res) {
  try {
    const freshNews = await scrapeAndCacheIJFNews();
    return res.status(200).json(freshNews);
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Failed to load Judo news." });
  }
}