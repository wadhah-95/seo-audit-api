/*
   Used for downloading website html 
   
   New notion: async /await: fetching a website takes time 
   async is used when an operation takes time: http request, db query, file reading ...
   so fetchHtml will be an async function

   */

import axios from "axios";

const MAX_REDIRECTS = 5;

//redirect handling
const REDIRECT_STATUS_CODES = new Set([
  301,
  302,
  303,
  307,
  308,
]);

export type RedirectInfo = {
  from: string;
  to: string;
  statusCode: number;
};

export type FetchHtmlResult = {
  html: string;
  statusCode: number;

  reachable: boolean;

  finalUrl: string;

  //redirected: boolean;

  redirectCount: number;

  redirectChain: RedirectInfo[];

  error?: string;

  errorType?: 
    | "TIMEOUT"
    | "DNS_ERROR"
    | "CONNECTION_ERROR"
    | "SSL_ERROR"
    | "UNKNOWN";
};

export async function fetchHtml(
  url: string
): Promise<FetchHtmlResult> {

  let currentUrl = url;
  let redirectChain: RedirectInfo[] = [];
  let visitedRedirects = new Set<string>(); //Store redirects to avoid redirect looping
 
  


  try {

    while (true) {
      if (visitedRedirects.has(currentUrl)) {
  return {
    html: "",
    statusCode: 0,
    reachable: false,
    finalUrl: currentUrl,
    redirectCount: redirectChain.length,
    redirectChain,
    error: "Redirect loop detected",
    errorType: "UNKNOWN",
  };
}

visitedRedirects.add(currentUrl);

      const response = await axios.get(currentUrl, {

        timeout: 10000,

        // disable axios automatic redirects
        maxRedirects: 0,

        headers: {
          "User-Agent": "SEO-Audit-Bot/1.0"
        },

        maxContentLength: 2 * 1024 * 1024,
        maxBodyLength: 2 * 1024 * 1024,

        // Allow 3xx responses
        validateStatus: () => true,

      });


      
      if (REDIRECT_STATUS_CODES.has(response.status)) {


        const location = response.headers.location;


        if (!location) {

          return {
            html: "",
            statusCode: response.status,
            reachable: false,
            finalUrl: currentUrl,
            redirectCount: redirectChain.length,
            redirectChain,
            error: "Redirect without location header",
            errorType: "UNKNOWN",
          };

        }


        const nextUrl = new URL(
          location,
          currentUrl
        ).href;


        redirectChain.push({

          from: currentUrl,

          to: nextUrl,

          statusCode: response.status,

        });


        if (redirectChain.length > MAX_REDIRECTS) {

          return {

            html: "",

            statusCode: response.status,

            reachable: false,

            finalUrl: currentUrl,

            redirectCount: redirectChain.length,

            redirectChain,

            error: "Too many redirects",

            errorType: "UNKNOWN",

          };

        }


        currentUrl = nextUrl;

        continue;

      }


      /*
        Normal response
      */

      return {

        html:
          typeof response.data === "string"
            ? response.data
            : "",

        statusCode: response.status,

        reachable:
          response.status >= 200 &&
          response.status < 300,

        finalUrl: currentUrl,

        redirectCount: redirectChain.length,

        redirectChain,

      };


    }


  } catch(error) {


    if (axios.isAxiosError(error)) {


      console.log("Axios code:", error.code);
      console.log("Axios message:", error.message);


      let errorType:
        FetchHtmlResult["errorType"] = "UNKNOWN";


      if(error.code === "ECONNABORTED") {

        errorType = "TIMEOUT";

      }

      else if(error.code === "ENOTFOUND") {

        errorType = "DNS_ERROR";

      }

      else if(error.code === "ECONNREFUSED") {

        errorType = "CONNECTION_ERROR";

      }

      else if(error.code === "CERT_HAS_EXPIRED") {

        errorType = "SSL_ERROR";

      }


      return {

        html: "",

        statusCode:
          error.response?.status ?? 0,

        reachable: false,

        finalUrl: currentUrl,

        redirectCount: redirectChain.length,

        redirectChain,

        error: error.message,

        errorType,

      };

    }


    return {

      html: "",

      statusCode: 0,

      reachable: false,

      finalUrl: currentUrl,

      redirectCount: redirectChain.length,

      redirectChain,

      error: "Unknown error",

      errorType: "UNKNOWN",

    };

  }
}


