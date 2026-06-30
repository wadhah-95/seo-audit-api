import { normalizeUrl } from "../utils/url.util";
import { fetchHtml } from "./fetch.service";

export async function createAudit(rawUrl: string){
  let normalizedUrl=normalizeUrl(rawUrl);
  const fetchedPage=await fetchHtml(normalizedUrl)
  return {
    id: "fake-audit-id",
    url: normalizedUrl,
    score: 85,
    htmlLength: fetchedPage.html.length,
    statusCode: fetchedPage.statusCode,
  };
}