/*
utils file contains small, reusable helper functions related to URLs
functions should: 
clean a string
validate a url
format a date 
normalieze a vlaue

For version 1 we need one main function: normalizeUrl()
=> recieves user input. 
=>remove extra spaces. 
=>if missing http:// or https:// add https://
=>check url validity
=>return clean url
=>throw an error if invalid
*/
export function normalizeUrl(url: string): string{
  let normalized_url: string=url.trim();
  if(normalized_url.length===0) throw new Error("Can't have an empty URL");
  if(!normalized_url.startsWith("https://") && !normalized_url.startsWith("http://")) {normalized_url="https://"+normalized_url}
  try{new URL(normalized_url);
     return normalized_url}
  catch{
    throw new Error("Invalid URL !");
  }

  }

  export function normalizeCrawlUrl(url: string): string {
  const parsedUrl = new URL(url);

  // 1. Hostnames are case-insensitive
  parsedUrl.hostname = parsedUrl.hostname.toLowerCase();

  // 2. Remove URL fragment (#section)
  parsedUrl.hash = "";

  // 3. Remove common tracking parameters
  parsedUrl.searchParams.delete("utm_source");
  parsedUrl.searchParams.delete("utm_medium");
  parsedUrl.searchParams.delete("utm_campaign");
  parsedUrl.searchParams.delete("utm_term");
  parsedUrl.searchParams.delete("utm_content");
  parsedUrl.searchParams.delete("fbclid");
  parsedUrl.searchParams.delete("gclid");

  // 4. Remove trailing slash (except homepage)
  if (
    parsedUrl.pathname.endsWith("/") &&
    parsedUrl.pathname !== "/"
  ) {
    parsedUrl.pathname = parsedUrl.pathname.slice(0, -1);
  }

  return parsedUrl.toString();
}

