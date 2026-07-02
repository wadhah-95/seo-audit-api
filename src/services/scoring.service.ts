/*
SCORING: out of 100 points
severity:
-High: -15 points
-Medium: -8 points
-Low: -3 points
*/

import type {Recommendation} from "./recommendation.service";
export function calculateScore(recommendations: Recommendation[]): number{
  let score: number=100;
  for(let recommendation of recommendations){
    if(recommendation.severity==="High"){
      score=score-15;
    }
    else if(recommendation.severity==="Medium"){
      score=score-8;
    }
    else if(recommendation.severity==="Low"){
      score=score-3;
    }
  }
  if(score<0){
    score=0;
  }
  return score;
}