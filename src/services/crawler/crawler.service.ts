// src/services/crawler/crawler.service.ts
import axios from 'axios';
import { load } from 'cheerio';
import { normalizeUrl } from '../../utils/url.util';
import { fetchHtml } from '../fetch.service';

export class CrawlerService {
 
  async extractLinks(url: string): Promise<string[]>{
    const result=await fetchHtml(url);
    if(!result.reachable){
      throw new Error(result.error || "Unable to fetch page. ");
    }
    const $=load(result.html);
    const links: string[]=[];

     $("a[href]").each((_, element) => {
      const href = $(element).attr("href");

      if (!href) return;

      try {
        const absoluteUrl = new URL(href, url).href;
        links.push(absoluteUrl);
      } catch {
      }
    });

    return links;
  }
  async filterInternalLinks(url: string): Promise<string[]> {
  const extractedLinks = await this.extractLinks(url);
  const internalLinks: string[] = [];

  const rootHostname = new URL(url).hostname;

  for (const link of extractedLinks) {
    try {
      const parsedUrl = new URL(link);

      // Ignore external domains
      if (parsedUrl.hostname !== rootHostname) {
        continue;
      }

      // Ignore mailto, tel and javascript links
      if (
        parsedUrl.protocol === "mailto:" ||
        parsedUrl.protocol === "tel:" ||
        parsedUrl.protocol === "javascript:"
      ) {
        continue;
      }

      // Ignore non-HTML resources
      if (
        parsedUrl.pathname.match(
          /\.(pdf|jpg|jpeg|png|gif|svg|webp|zip|rar|mp4|mp3|avi|mov|webm)$/i
        )
      ) {
        continue;
      }

      internalLinks.push(parsedUrl.href);
    } catch {
      // Ignore malformed URLs
      continue;
    }
  }

  return internalLinks;
}

private removeDuplicates(links: string[]): string[]{
  return [...new Set(links)];
}

}


