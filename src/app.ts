import express, {type Application} from "express";
import cors from "cors";

const app: Application=express();
app.use(cors());
app.use(express.json());
app.get("/health", (req, res)=>{
  res.json({
    status: "ok",
    service: "seo-audit-api"
  });
});
export default app;