/*
   Used for downloading website html 
   
   New notion: async /await: fetching a website takes time 
   async is used when an operation takes time: http request, db query, file reading ...
   so fetchHtml will be an async function

   */

import axios from "axios";

export async function fetchHtml(url: string){
  const response= await axios.get(url, {timeout: 10000});
   //axios returns: data, status... we need: response.data(html content), response.status(http status code)
  return {
    html: response.data,
    statusCode: response.status
  };
}