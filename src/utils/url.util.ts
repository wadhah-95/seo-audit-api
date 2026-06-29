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

