import { normalizeUrl } from "../utils/url.util";
import { fetchHtml } from "./fetch.service";
import { analyzeSeo } from "./seo-analyzer.service";

export async function createAudit(rawUrl: string){
  let normalizedUrl=normalizeUrl(rawUrl);
  const fetchedPage=await fetchHtml(normalizedUrl);
  const analysis=analyzeSeo(fetchedPage.html);
  console.log("NEW createAudit service is running");
  return {
    id: "fake-audit-id",
    url: normalizedUrl,
    score: 85,
    htmlLength: fetchedPage.html.length,
    statusCode: fetchedPage.statusCode,
    analysis,
  };
}