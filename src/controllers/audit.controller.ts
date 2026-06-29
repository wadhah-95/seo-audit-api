import type {Request, Response} from "express";

export function createAuditController(req: Request, res: Response){
  const url=req.body.url;
  res.status(201).json({
    message: "Audit created successfully",
    audit: {
      id: "fake_audit-id",
      url,
      score: 85
    },
  });
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
    }
  })
}


