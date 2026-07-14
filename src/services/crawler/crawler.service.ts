import axios from 'axios';
import { load } from 'cheerio';

export class CrawlerService {
  private maxDepth = 5;
  private visitedPages: Set<string> = new Set();
  private delay = 1000; // Delay of 1 second between requests

  async crawl(url: string, currentDepth = 0): Promise<void> {
    if (currentDepth > this.maxDepth) return;

    if (this.visitedPages.has(url)) return;
    this.visitedPages.add(url);

    try {
      const response = await axios.get(url);
      
      // Handle redirects
      if (response.status === 301 || response.status === 302) {
        const newUrl = response.headers.location;
        console.log(`Redirecting from ${url} to ${newUrl}`);
        return this.crawl(newUrl, currentDepth);
      }

      const $ = load(response.data);
      const links: string[] = [];

      $('a').each((_, elem) => {
        const href = $(elem).attr('href');
        if (href && this.isInternalLink(href, url)) {
          links.push(href);
        }
      });

      for (const link of links) {
        await this.crawl(link, currentDepth + 1);
      }

    } catch (error) {
      console.error(`Error crawling ${url}:`, error);
    } finally {
      // Add a delay before the next request
      await new Promise(resolve => setTimeout(resolve, this.delay));
    }
  }

  private isInternalLink(href: string, baseUrl: string): boolean {
    const resolvedUrl = new URL(href, baseUrl).href;
    return resolvedUrl.startsWith(baseUrl);
  }
}