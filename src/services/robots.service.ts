import axios from "axios";


export type RobotsRule = {
  userAgent: string;
  disallow: string[];
  allow: string[];
  crawlDelay?: number;
};


export type RobotsResult = {
  exists: boolean;
  url: string;
  rules: RobotsRule[];
};



export async function fetchRobots(
  websiteUrl: string
): Promise<RobotsResult> {


  const origin = new URL(websiteUrl).origin;

  const robotsUrl = `${origin}/robots.txt`;


  try {

    const response = await axios.get(
      robotsUrl,
      {
        timeout: 5000,
        headers:{
          "User-Agent":"SEO-Audit-Bot/1.0"
        },
        validateStatus:()=>true
      }
    );


    if(response.status !== 200){

      return {
        exists:false,
        url:robotsUrl,
        rules:[]
      };

    }


    const rules = parseRobots(response.data);


    return {
      exists:true,
      url:robotsUrl,
      rules
    };


  } catch(error){

    return {
      exists:false,
      url:robotsUrl,
      rules:[]
    };

  }

}

function parseRobots(
  content:string
): RobotsRule[] {


  const lines = content
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0);



  let currentAgent = "";

  const rules: RobotsRule[] = [];


  for(const line of lines){

    


    if(line.startsWith("#")){
      continue;
    }


    const [key,value] =
      line.split(":")
      .map(x=>x.trim());

  if(key.toLowerCase() === "crawl-delay"){

  const delay = Number(value);

  if(!isNaN(delay) && rules.length > 0){
    rules[rules.length-1].crawlDelay = delay;
  }

}


    if(key.toLowerCase() === "user-agent"){

      currentAgent = value;


      rules.push({

        userAgent:value,

        disallow:[],

        allow:[],
        crawlDelay: undefined

      });


    }


    if(key.toLowerCase() === "disallow"){

      rules[rules.length-1]
      ?.disallow.push(value);

    }


    if(key.toLowerCase() === "allow"){

      rules[rules.length-1]
      ?.allow.push(value);

    }

  }


  return rules;

}

export function isAllowedByRobots(
  url:string,
  rules:RobotsRule[]
):boolean {


  const path = new URL(url).pathname;


  const globalRule =
    rules.find(
      rule=>rule.userAgent==="*"
    );


  if(!globalRule){
    return true;
  }


  for(const allowed of globalRule.allow){

    if(
      allowed &&
      path.startsWith(allowed)
    ){
      return true;
    }

  }


  for(const blocked of globalRule.disallow){

    if(
      blocked &&
      path.startsWith(blocked)
    ){
      return false;
    }

  }


  return true;

}