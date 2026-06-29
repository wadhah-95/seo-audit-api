import {Router} from "express";
import{createAuditController, getAuditsController, getAuditByIdController} from "../controllers/audit.controller";
const router=Router();
router.post("/", createAuditController);
router.get("/", getAuditsController);
router.get("/:id", getAuditByIdController);
export default router;