import type {Request, Response} from "express";
import { createAudit } from "../services/audit.servise";
export function createAuditController(req: Request, res: Response) {
  try {
    const audit=createAudit(req.body.url)
    //console.log("normalized url: ", url);
    //console.log("Raw url: ", req.body.url);

    res.status(201).json({
      message: "Audit created successfully",
      audit,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        message: "Could not create audit",
        error: error.message,
      });
      return;
    }

    res.status(400).json({
      message: "Could not create audit",
      error: "Unknown error",
    });
  }
}

export function getAuditsController(_req: Request, res: Response){
  res.status(200).json({
    audits: [
      {
        id: 123,
        score: 85,
        url: "http://example1.com",

      },
      {
        id: 124,
        score: 20,
        url: "http://example2.com",
      },
      {
        id: 125,
        score: 100,
        url: "http://example3.com",
      }
    ]
  })
}

export function getAuditByIdController(req: Request, res: Response){
  const id=req.params.id;
  res.status(200).json({
    message: "Audit found successfully",
    audit: {
      id,
      score: 85,
      url: "https://example.com",
    },
  });
}


