import { SeoAnalysis } from "./seo-analyzer.service";
import { SiteFilesResult } from "./site-files.service";

export type Recommendation={
  type: string;
  severity: "High" | "Medium" | "Low";
  message: string;
  recommendation: string;
};

export type PageStatus= {
  reachable: boolean,
  statusCode: number,
  error?: string,
}

export function generateRecommendations(analysis: SeoAnalysis, siteFiles: SiteFilesResult, pageStatus: PageStatus): Recommendation[]{
  const recommendations: Recommendation[]=[];

  if (!pageStatus.reachable) {
  recommendations.push({
    type: "page_not_reachable",
    severity: "High",
    message:
      pageStatus.statusCode === 0
        ? "The page could not be reached."
        : `The page returned HTTP status code ${pageStatus.statusCode}.`,
    recommendation:
      pageStatus.statusCode === 0
        ? "Check that the domain exists, the server is online, and the page is publicly accessible."
        : "Make sure the page is publicly accessible and returns a successful 2xx HTTP status code.",
  });

  return recommendations;
}
  
  if (analysis.hasTitle===false) {
    recommendations.push({
      type: "missing_title",
      severity: "High",
      message: "The page is missing a title tag !",
      recommendation: "Add a unique title tag between 50 and 60 characters",
    })
  }

    
  else if(analysis.titleLength<50 || analysis.titleLength>60){
    recommendations.push({
      type: "title_length_out_of_bounds",
      severity: "Medium",
      message: "The title's length is too short or too long !",
      recommendation: "Title's length should be between 50 and 60 characters",
    })
  }
  if(analysis.hasMetaDescription===false){
    recommendations.push({
      type: "missing_meta_description",
      severity: "High",
      message: "The page is missing a meta description tag !",
      recommendation: "Add a meta description tag between 150 and 160 characters",
    });
  }
  else if(analysis.metaDescriptionLength<150 || analysis.metaDescriptionLength>160){
    recommendations.push({
      type: "Meta_description_length_out_of_bounds",
      severity: "Medium",
      message: "The meta description's length is too short or too long !",
      recommendation: "Meta description's length should be between 150 and 160 characters",
    });
  }
  if(analysis.h1Count!==1){
    recommendations.push({
      type: "h1_count_out_of_bounds",
      severity: "High",
      message: "H1 tags missing or too many !",
      recommendation: "There should be one h1 tag per webpage",
    });
  }
  if(analysis.h2Count<2 || analysis.h2Count>5){
    recommendations.push({
      type: "h2_count_out_of_bounds",
      severity: "Low",
      message: "H2 tags missing or too many !",
      recommendation: "There should be 2 to 5 h2 tags per webpage",
    });
  }
  if(analysis.imagesWithoutAlt>0){
    recommendations.push({
      type: "Images_without_alt",
      severity: "Medium",
      message: "There are images without ALT description !",
      recommendation: "Add alt description to all images in webpage",
    });
  }
  if(analysis.hasCanonical===false){
    recommendations.push({
      type: "Missing_Canonical_tag",
      severity: "High",
      message: "There is no canonical tag in webpage !",
      recommendation: "Add a canonical tag to webpage"
    })
  }
  if (analysis.hasViewport===false){
    recommendations.push({
      type: "Missing_viewport_tag",
      severity: "High",
      message: "There is no viewport tag in webpage !",
      recommendation: "Add a viewport tag to webpage",
    });
  }
  if (!siteFiles.robotsTxt.exists) {
  recommendations.push({
    type: "missing_robots_txt",
    severity: "Low",
    message: "The website does not expose a robots.txt file.",
    recommendation:
      "Add a robots.txt file to guide search engine crawlers and define crawl rules.",
  });
}

if (!siteFiles.sitemapXml.exists) {
  recommendations.push({
    type: "missing_sitemap_xml",
    severity: "Medium",
    message: "The website does not expose a sitemap.xml file.",
    recommendation:
      "Add a sitemap.xml file to help search engines discover important pages.",
  });
}
if(analysis.totalLinks===0){
  recommendations.push({
    type: "missing_links",
    severity: "Medium",
    message: "No links found in webpage !",
    recommendation: "Add useful internal links to help users and search engines discover related pages."
  });
}

  if (analysis.internalLinksCount === 0 && analysis.totalLinks > 0) {
  recommendations.push({
    type: "no_internal_links",
    severity: "Medium",
    message: "The page does not contain any internal links.",
    recommendation:
      "Add relevant internal links to other pages on the same website to improve navigation and crawlability.",
  });
}

if (analysis.linksWithoutText > 0) {
  recommendations.push({
    type: "links_without_text",
    severity: "Low",
    message: "Some links have no visible text.",
    recommendation: "Add descriptive anchor text to help users and search engines understand the destination of each link.",
  });
}

if (analysis.totalLinks > 150) {
  recommendations.push({
    type: "too_many_links",
    severity: "Low",
    message: "The page contains a large number of links.",
    recommendation: "Review the links and keep only those that are useful, relevant, and helpful for users.",
  });
}

if (
  analysis.externalLinksCount > analysis.internalLinksCount &&
  analysis.totalLinks > 10
) {
  recommendations.push({
    type: "more_external_than_internal_links",
    severity: "Low",
    message: "The page contains more external links than internal links.",
    recommendation: "Consider adding more relevant internal links to important pages on your own website.",
  });
}

  return recommendations;
}