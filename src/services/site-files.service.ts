import axios from "axios";

export type SiteFileCheck={
  url: string,
  exists: boolean,
  statusCode: number | null,
};
export type SiteFilesResult = {
  robotsTxt: SiteFileCheck;
  sitemapXml: SiteFileCheck;
};

async function checkFile(url: string): Promise<SiteFileCheck>{
  try{
    const response= await axios.get(url, 
      {
        timeout: 10000,  
        validateStatus: () => true,

      });
    return {
      url,  
      exists: response.status >= 200 && response.status < 300,
      statusCode: response.status,
    };
  }
  catch(error){
    return{url,
    exists: false,
    statusCode: null,

  };
}
}

export async function checkSiteFiles(url: string){
  const parsedUrl=new URL(url);
  const originUrl=parsedUrl.origin;
  const robotsUrl=originUrl+"/robots.txt";
  const sitemapUrl= originUrl+"/sitemap.xml";
  const [robotsTxt, sitemapXml]= await Promise.all([
    checkFile(robotsUrl), checkFile(sitemapUrl)
  ]);
  return{
    robotsTxt,
    sitemapXml,
  };


}