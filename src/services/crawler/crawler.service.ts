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
  }

  // 1. Instanciation
const crawlerService = new CrawlerService();

// 2. Appel de la méthode sur l'instance (Plus d'erreur !)
const links = crawlerService.extractLinks("https://client.com");
  
  console.log(links);
