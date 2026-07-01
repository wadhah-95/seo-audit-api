import type {Request, Response} from "express";
import { createAudit, getAuditById } from "../services/audit.service";
import { getAllAudits } from "../services/audit.service";


export async function createAuditController(req: Request, res: Response) {
  //console.log("CREATE AUDIT CONTROLLER IS RUNNING");
  try {
    const audit=await createAudit(req.body.url)
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

export async function getAuditsController(_req: Request, res: Response){
  try{
  const audits=await getAllAudits();
  res.status(200).json({
    message: "Audits fetched successfully",
    audits,
  });
  }
  catch(error){
    if(error instanceof Error){
      res.status(500).json({
        message: "Could not fetch Audits",
        error: error.message,
      });
      return;

    }
    res.status(500).json({
      message: "Could not fetch Audits",
      error: "Error unknown",
    });
  }
}


export async function getAuditByIdController(req: Request, res: Response){
  const id=Number(req.params.id);
  try{
    const audit=await getAuditById(id);
    if(audit===null){
      res.status(200).json({
        message: "Audit not in database",
      });
    }
    res.status(200).json({
      message: "Audit fetched successfully",
      audit,
    });
  }
  catch(error){
    if(error instanceof Error){
      res.status(500).json({
        message: "Could not fetch audit ",
        error: error.message,
      });
    }
    res.status(500).json({
      message: "Could not fetch audit",
      error: "Error unknown",
    });
  }
}


