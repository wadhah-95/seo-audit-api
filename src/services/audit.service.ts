import { normalizeUrl } from "../utils/url.util";
import { fetchHtml } from "./fetch.service";
import { analyzeSeo } from "./seo-analyzer.service";
import {generateRecommendations} from "./recommendation.service";
import { calculateScore } from "./scoring.service";
import { AuditScalarFieldEnum } from "../generated/prisma/internal/prismaNamespace";
import prisma from "../lib/prisma";

export async function createAudit(rawUrl: string){
  let normalizedUrl=normalizeUrl(rawUrl);
  const fetchedPage=await fetchHtml(normalizedUrl);
  const analysis=analyzeSeo(fetchedPage.html);
  const recommendations=generateRecommendations(analysis);
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
  }
  })
  return savedAudit;
}

export async function getAllAudits(){
  const audits=await prisma.audit.findMany({
    orderBy: {createdAt: 'desc'},
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

  

