//import router
import {Router} from "express";
//import functions from controllers folder
import{createAuditController, getAuditsController, getAuditByIdController} from "../controllers/audit.controller";
//create route
const router=Router();
//route requests
router.post("/", createAuditController);
router.get("/", getAuditsController);
router.get("/:id", getAuditByIdController);
//export route
export default router;