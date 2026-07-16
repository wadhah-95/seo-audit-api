// src/services/crawler/crawler.service.ts
import axios from 'axios';
import { load } from 'cheerio';

import { fetchHtml } from '../fetch.service';
import { normalizeCrawlUrl } from '../../utils/url.util';

export interface CrawledPage{
  url: string;
  depth: number;
}

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

async crawlWebsite(startUrl: string, maxDepth: number, maxPages: number): Promise<CrawledPage[]>{
  const normalizedStartUrl=normalizeCrawlUrl(startUrl);
  const queue: CrawledPage[]=[
    {
      url: normalizedStartUrl,
      depth: 0,
    }
  ];
  const visited= new Set<string>();
  const crawledPages: CrawledPage[]=[];

  while(queue.length>0){
    if(crawledPages.length>=maxPages){
      break;
    }
    const currentPage=queue.shift(); //FIFO
    if(!currentPage){
      break;
    }
    const{url, depth}=currentPage;

    if(visited.has(url)){
      continue;
    }
    visited.add(url);
    

  if (depth >= maxDepth) {
  continue;
    }

    try{
      const internalLinks=await this.filterInternalLinks(url);
      crawledPages.push({
      url,
      depth,
      });
      const uniqueLinks= this.removeDuplicates(internalLinks);

      for(const link of uniqueLinks){
        const normalizedLink=normalizeCrawlUrl(link);
        if(visited.has(normalizedLink)){
          continue;
        }

        if (
          queue.some(
            page => page.url === normalizedLink
          )
        ) {
          continue;
        }

        queue.push({
          url: normalizedLink,
          depth: depth+1
        });
      }
      
    }
    catch {
      continue;
      }
  }
  return crawledPages;
}
  
}


