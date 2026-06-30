import { normalizeUrl } from "../utils/url.util";
import { fetchHtml } from "./fetch.service";
import { analyzeSeo } from "./seo-analyzer.service";
import {generateRecommendations} from "./recommendation.service";
import { calculateScore } from "./scoring.service";

export async function createAudit(rawUrl: string){
  let normalizedUrl=normalizeUrl(rawUrl);
  const fetchedPage=await fetchHtml(normalizedUrl);
  const analysis=analyzeSeo(fetchedPage.html);
  const recommendations=generateRecommendations(analysis);
  const score=calculateScore(recommendations);
  //console.log("NEW createAudit service is running");
  return {
    id: "fake-audit-id",
    url: normalizedUrl,
    score,
    htmlLength: fetchedPage.html.length,
    statusCode: fetchedPage.statusCode,
    analysis,
    recommendations,
  };
}