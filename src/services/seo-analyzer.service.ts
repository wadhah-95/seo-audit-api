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
};

export function analyzeSeo(html: string): SeoAnalysis {
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
  };
}
export default analyzeSeo;