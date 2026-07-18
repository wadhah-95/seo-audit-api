/*
   Used for downloading website html 
   
   New notion: async /await: fetching a website takes time 
   async is used when an operation takes time: http request, db query, file reading ...
   so fetchHtml will be an async function

   */

import axios from "axios";
export type FetchHtmlResult = {
  html: string;
  statusCode: number;

  reachable: boolean;

  finalUrl: string;

  redirected: boolean;

  error?: string;

  errorType?: 
    | "TIMEOUT"
    | "DNS_ERROR"
    | "CONNECTION_ERROR"
    | "SSL_ERROR"
    | "UNKNOWN";
};

export async function fetchHtml(url: string): Promise<FetchHtmlResult> {

  try {

    const response = await axios.get(url, {
    timeout:10000,

    headers:{
      "User-Agent":"SEO-Audit-Bot/1.0"
    },

    maxContentLength: 2 * 1024 * 1024, // 2MB limit
    maxBodyLength: 2 * 1024 * 1024,

    validateStatus:()=>true,
});


    const finalUrl =
      response.request?.res?.responseUrl || url;


    return {

      html: response.data,

      statusCode: response.status,

      reachable:
        response.status >= 200 &&
        response.status < 300,

      finalUrl,

      redirected:
        finalUrl !== url,

    };


  } catch(error) {


    if (axios.isAxiosError(error)) {

      console.log("Axios code:", error.code);
      console.log("Axios message:", error.message);

      let errorType:
        FetchHtmlResult["errorType"] = "UNKNOWN";


      if(error.code === "ECONNABORTED"){
        errorType = "TIMEOUT";
      }

      else if(error.code === "ENOTFOUND"){
        errorType = "DNS_ERROR";
      }

      else if(error.code === "ECONNREFUSED"){
        errorType = "CONNECTION_ERROR";
      }

      else if(error.code === "CERT_HAS_EXPIRED"){
        errorType = "SSL_ERROR";
      }


      return {

        html: "",

        statusCode:
          error.response?.status ?? 0,

        reachable:false,

        finalUrl:url,

        redirected:false,

        error:error.message,

        errorType,

      };
    }


    return {

      html:"",

      statusCode:0,

      reachable:false,

      finalUrl:url,

      redirected:false,

      error:"Unknown error",

      errorType:"UNKNOWN",

    };

  }
}