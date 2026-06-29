import { normalizeUrl } from "../utils/url.util";

export function createAudit(rawUrl: string){
  let normalizedUrl=normalizeUrl(rawUrl);
  return {
    id: "fake-audit-id",
    url: normalizedUrl,
    score: 85
  };
}