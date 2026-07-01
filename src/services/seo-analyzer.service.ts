import * as cheerio from "cheerio";

export type SeoAnalysis = {
  title: string;
  titleLength: number;
  hasTitle: boolean;

  metaDescription: string;
  metaDescriptionLength: number;
  hasMetaDescription: boolean;

  h1Count: number;
  h2Count: number;

  imageCount: number;
  imagesWithoutAlt: number;

  hasCanonical: boolean;
  hasViewport: boolean;
  
  totalLinks: number;
  internalLinksCount: number;
  externalLinksCount: number;
  linksWithoutText: number;
};

export function analyzeSeo(html: string, pageUrl: string): SeoAnalysis {
  const $ = cheerio.load(html);

  const title = $("title").first().text().trim();
  const titleLength = title.length;
  const hasTitle = titleLength > 0;

  const metaDescription = $("meta[name='description']")
    .first()
    .attr("content")?.trim() ?? "";

  const metaDescriptionLength = metaDescription.length;
  const hasMetaDescription = metaDescriptionLength > 0;

  const h1Count = $("h1").length;
  const h2Count = $("h2").length;

  const images = $("img");
  const imageCount = images.length;

  let imagesWithoutAlt = 0;

  images.each((_, element) => {
    const alt = $(element).attr("alt");

    if (!alt || alt.trim().length === 0) {
      imagesWithoutAlt++;
    }
  });

  const hasCanonical = $("link[rel='canonical']").length > 0;
  const hasViewport = $("meta[name='viewport']").length > 0;

  const links = $("a");
  const totalLinks=links.length;
  let internalLinksCount=0;
  let externalLinksCount=0;
  let linksWithoutText=0;
  const pageUrlObject=new URL(pageUrl);

  links.each((_, element) => {
  const href = $(element).attr("href");
  const text = $(element).text().trim();
  
  if(text.length===0){
    linksWithoutText++;
  }
  if(!href) {
    return
  };
  
  try{
    const linkUrl=new URL(href, pageUrl);
    if(linkUrl.hostname===pageUrlObject.hostname){
      internalLinksCount++;
    }
    else{
      externalLinksCount++;
    }
  }
  catch{
    return;
  }

  
});

  return {
    title,
    titleLength,
    hasTitle,

    metaDescription,
    metaDescriptionLength,
    hasMetaDescription,

    h1Count,
    h2Count,

    imageCount,
    imagesWithoutAlt,

    hasCanonical,
    hasViewport,
    totalLinks,
    internalLinksCount,
    externalLinksCount,
    linksWithoutText,
  };
}
export default analyzeSeo;