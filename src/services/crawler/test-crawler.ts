// test-crawler.ts
import { CrawlerService } from "./crawler.service";

async function runTest() {
  const crawlerService = new CrawlerService();
  try {
    await crawlerService.crawl('https://example.com', 0);
    console.log('Crawling completed successfully.');
  } catch (error) {
    console.error('Error during crawling:', error);
  }
}

runTest().catch(console.error);
