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
  error?: string;
};

export async function fetchHtml(url: string): Promise<FetchHtmlResult> {
  try{
  const response = await axios.get(url, {
    timeout: 10000,
    headers: {
      "User-Agent": "SEO-Audit-Bot/1.0",
    },
    validateStatus: () => true, //do not throw error for 403/404/405
  });

  return {
    html: response.data,
    statusCode: response.status,
    reachable: response.status >= 200 && response.status < 300,
  };
}catch (error) {
    if (error instanceof Error) {
      return {
        html: "",
        statusCode: 0,
        reachable: false,
        error: error.message,
      };
    }

    return {
      html: "",
      statusCode: 0,
      reachable: false,
      error: "Unknown network error",
    };
  }
}