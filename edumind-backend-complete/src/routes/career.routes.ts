import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { listPaths, recommend } from "../controllers/career.controller";

const router = Router();
router.use(authenticate);
router.get("/paths", listPaths);
router.post("/recommend", recommend);
export default router;
