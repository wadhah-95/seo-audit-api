import type {Request, Response} from "express";
import { createAudit, getAuditById } from "../services/audit.service";
import { getAllAudits } from "../services/audit.service";
import { CreateAuditInput, createAuditSchema } from "../schemas/audit.schema";


export async function createAuditController(req: Request, res: Response) {
  //console.log("CREATE AUDIT CONTROLLER IS RUNNING");
  try {
    const validationResult = createAuditSchema.safeParse(req.body);

if (!validationResult.success) {
  res.status(400).json({
    success: false,
    message: "Invalid request body",
    error: {
      code: "VALIDATION_ERROR",
      details: validationResult.error.issues,
    },
  });
  return;
}
    const audit=await createAudit(validationResult.data.url)
    //console.log("normalized url: ", url);
    //console.log("Raw url: ", req.body.url);
    

    res.status(201).json({
      success: true,
      message: "Audit created successfully",
      data: {audit},
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: "Could not create audit",
        error: {code: "AUDIT_CREATE_FAILED", details: error.message},
      });
      return;
    }

    res.status(400).json({
      success: false,
      message: "Could not create audit",
      error: {code: "AUDIT_CREATE_FAILED", details: "Error unknown"},
    });
  }
}

export async function getAuditsController(_req: Request, res: Response){
  try{
  const audits=await getAllAudits();
  res.status(200).json({
    success: true,
    message: "Audits fetched successfully",
    data: {audits},
  });
  }
  catch(error){
    if(error instanceof Error){
      res.status(500).json({
        success: false,
        message: "Could not fetch Audits",
        error: {code: "AUDITS_FETCH_FAILED", details: error.message},
      });
      return;

    }
    res.status(500).json({
      success: false,
      message: "Could not fetch Audits",
      error: {code: "AUDITS_FETCH_FAILED", details: "Error unknown"},
    });
  }
}


export async function getAuditByIdController(req: Request, res: Response){
  const id=Number(req.params.id);
  try{
    const audit=await getAuditById(id);
    if(audit===null){
      res.status(200).json({
        success: false,
        message: "Audit not in database",
        error: {code: "AUDIT_NOT_FOUND"},
      });
    }
    res.status(200).json({
      success: true,
      message: "Audit fetched successfully",
      data: {audit},
    });
  }
  catch(error){
    if(error instanceof Error){
      res.status(500).json({
        success: false, 
        message: "Could not fetch audit ",
        error: {code: "INVALID_AUDIT_ID", details: error.message},
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: "Could not fetch audit",
      error: {code: "INVALID_AUDIT_ID", details: "Error unknown"},
    });
  }
}


