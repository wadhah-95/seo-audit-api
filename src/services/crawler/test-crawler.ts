// src/services/crawler/test-crawler.ts

import { CrawlerService } from "./crawler.service";

async function testCrawler() {
  const crawler = new CrawlerService();

  const result = await crawler.crawlWebsite(
  "https://nodejs.org",
  2,
  20
);

const depthExample = result.filter(
  page => page.depth <= 2
);

console.log({
  totalPages: result.length,
  maxDepthReached: Math.max(
    ...result.map(page => page.depth)
  ),
  pages: result.slice(0,5)
});
  
}

testCrawler()
  .catch((error) => {
    console.error("Crawler test failed:");
    console.error(error);
  });