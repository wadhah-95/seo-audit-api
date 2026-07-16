import { normalizeUrl } from "../utils/url.util";
import { fetchHtml } from "./fetch.service";
import { analyzeSeo } from "./seo-analyzer.service";
import {generateRecommendations} from "./recommendation.service";
import { calculateScore } from "./scoring.service";
import { AuditScalarFieldEnum } from "../generated/prisma/internal/prismaNamespace";
import prisma from "../lib/prisma";
import { SiteFilesResult, checkSiteFiles } from "./site-files.service";
import type { PageStatus } from "./recommendation.service";
import type { FetchHtmlResult } from "./fetch.service";
import { CrawlerService } from "./crawler/crawler.service";

export async function createAudit(rawUrl: string){
  let normalizedUrl=normalizeUrl(rawUrl);
  const siteFiles=await checkSiteFiles(normalizedUrl);
  const fetchedPage=await fetchHtml(normalizedUrl);
  const analysis=analyzeSeo(fetchedPage.html, normalizedUrl);
  const recommendations=generateRecommendations(analysis, siteFiles,{
    reachable: fetchedPage.reachable,
    statusCode: fetchedPage.statusCode,
    error: fetchedPage.error,
  });
  const score=calculateScore(recommendations);
  //console.log("NEW createAudit service is running");
  const savedAudit=await prisma.audit.create({
    data: {
    url: normalizedUrl,
    score,
    htmlLength: fetchedPage.html.length,
    statusCode: fetchedPage.statusCode,
    analysis,
    recommendations,
    siteFiles,
    reachable: fetchedPage.reachable,
  }
  })
  return savedAudit;
}

export async function getAllAudits() {
  const audits = await prisma.audit.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
    select: {
      id: true,
      url: true,
      score: true,
      statusCode: true,
      reachable: true,
      createdAt: true,
    },
  });

  return audits;
}
export default getAllAudits();

export async function getAuditById(id: number){
  const audit=await prisma.audit.findUnique({
    where: {id: id},
  });
  return audit;
}

export async function createWebsiteAudit(
  startUrl: string,
  maxDepth: number,
  maxPages: number
){
  const crawler=new CrawlerService();

  const crawledPages=await crawler.crawlWebsite(
    startUrl,
    maxDepth,
    maxPages
  );
   const audits = [];


  for (const page of crawledPages) {

    try {

      const audit = await createAudit(page.url);

      audits.push(audit);

    } catch(error) {

      console.log(
        `Failed auditing ${page.url}`,
        error
      );

    }

  }


  return audits;
}

  

