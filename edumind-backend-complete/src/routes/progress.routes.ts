import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { summary } from "../controllers/progress.controller";

const router = Router();
router.use(authenticate);
router.get("/summary", summary);
export default router;
