import express, {type Application} from "express";
import cors from "cors";

import auditRoutes from "./routes/audit.routes";

const app: Application=express();
app.use(cors());
app.use(express.json());
app.use("/api/audits", auditRoutes);
app.get("/health", (req, res)=>{
  res.json({
    status: "ok",
    service: "seo-audit-api"
  });
});
export default app;