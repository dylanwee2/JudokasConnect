import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeAndCacheIJFNews() {
  const { data: html } = await axios.get("https://www.ijf.org/news");
  const $ = cheerio.load(html);
  const articles = [];

  $(".hero-widget .hero-window .hero-slider a.hero").each((_, el) => {
    const link = $(el);
    const href = link.attr("href");
    const url = href?.startsWith("http") ? href : `https://www.ijf.org${href}`;


    const title = link.find(".texts .title").text().trim();e
    const style = link.attr("style") || "";
    const imgMatch = style.match(/background-image:\s*url\((.*?)\)/i);
    const urlToImage = imgMatch ? imgMatch[1].replace(/['"]/g, "") : null;
    const description = "";

    if (title) {
      articles.push({ title, description, url, urlToImage });
    }
  });

  return articles;
}
