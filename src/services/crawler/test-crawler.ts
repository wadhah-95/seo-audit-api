import { CrawlerService } from "./crawler.service";

async function testCrawler() {
  const crawler = new CrawlerService();

  const result = await crawler.crawlWebsite(
    "http://nodejs.org",
    3,
    500
  );

  console.log("\n===== CRAWLED PAGES =====");
  console.log(JSON.stringify(result.pages, null, 2));

  console.log("\n===== METRICS =====");
  console.log(JSON.stringify(result.metrics, null, 2));

  //console.log("\n===== ERRORS =====");
  //console.log(JSON.stringify(result.errors, null, 2));
}

testCrawler().catch((error) => {
  console.error("Crawler test failed:", error);
});