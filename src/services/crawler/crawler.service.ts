// src/services/crawler/crawler.service.ts

import { load } from 'cheerio';

import { fetchHtml } from '../fetch.service';
import { normalizeCrawlUrl } from '../../utils/url.util';


export type CrawlError={
  url: string,
  reason: string,
  statusCode?: number,
  errorType?: string,
}
export class CrawlPageError extends Error {

  statusCode?: number;

  errorType?: string;


  constructor(
    message: string,
    statusCode?: number,
    errorType?: string
  ) {

    super(message);

    this.statusCode = statusCode;
    this.errorType = errorType;

  }
}

export type CrawlMetrics = {
  pagesCrawled: number;
  crawlTimeMs: number; 
  averageTimePerPageMs: number;
  maxDepthReached: number; };

export type CrawlResult = {
  pages: CrawledPage[];
  metrics: CrawlMetrics;
  errors: CrawlError[];
};

export interface CrawledPage{
  url: string;
  depth: number;
}

export class CrawlerService {
 
  async extractLinks(url: string): Promise<string[]>{
    const result = await fetchHtml(url);

/*console.log(
  "HTML size:",
  result.html.length / 1024,
  "KB"
);*/
    if(!result.reachable){
  
    throw new CrawlPageError(
    result.error || "Unable to fetch page.",
    result.statusCode,
    result.errorType
);
}
    const html = result.html;

    const $ = load(html);

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
    
    result.html="";

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
          /\.(pdf|jpg|jpeg|png|gif|svg|webp|zip|rar|tar|gz|exe|dmg|iso|apk|mp4|mp3|woff|woff2|css|js|json|xml|rss|atom|map)$/i
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

async crawlWebsite(startUrl: string, maxDepth: number, maxPages: number): Promise<CrawlResult>{
  const crawlStartTime = Date.now();
  let maxDepthReached = 0;
  
  const normalizedStartUrl=normalizeCrawlUrl(startUrl);
  const queue: CrawledPage[]=[
    {
      url: normalizedStartUrl,
      depth: 0,
    }
  ];
  const MAX_QUEUE_SIZE = maxPages * 2;

  const visited= new Set<string>();
  const crawledPages: CrawledPage[]=[];
  const crawlErrors: CrawlError[] = [];

  while(queue.length>0){
    if(crawledPages.length>=maxPages){
      break;
    }
    const currentPage=queue.shift(); //FIFO
    if(!currentPage){
      break;
    }
    const{url, depth}=currentPage;
    maxDepthReached = Math.max(maxDepthReached, depth);
   

    if(visited.has(url)){
      continue;
    }
    visited.add(url);
    
    

  if (depth > maxDepth) {
  continue;
    }

    try{
      const internalLinks = await this.filterInternalLinks(url);

      crawledPages.push({
      url,
      depth,
      });

      const uniqueLinks= this.removeDuplicates(internalLinks);

      for(const link of uniqueLinks){

        if(queue.length >= MAX_QUEUE_SIZE){
    break;
  }

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
  //error handling
    catch (error) {

const err = error as CrawlPageError;

crawlErrors.push({

  url,

  reason: err.message,

  statusCode: err.statusCode,

  errorType: err.errorType,

});

continue;

}
  
/*console.log(
  "Queue:",
  queue.length,
  "Visited:",
  visited.size,
  "Pages:",
  crawledPages.length
);*/
}
 
  
  
  const crawlEndTime = Date.now();
  const crawlTimeMs = crawlEndTime - crawlStartTime;
  const pagesCrawled = crawledPages.length;
  const averageTimePerPageMs =
  pagesCrawled > 0
    ? Math.round(crawlTimeMs / pagesCrawled)
    : 0;
  
  
  return {
  pages: crawledPages,
  metrics: {
    pagesCrawled,
    crawlTimeMs,
    averageTimePerPageMs,
    maxDepthReached,
  },
  errors: crawlErrors,
};
}
  
}


