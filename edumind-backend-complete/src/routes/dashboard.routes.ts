import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { dashboard } from "../controllers/dashboard.controller";

const router = Router();
router.use(authenticate);
router.get("/", dashboard);
export default router;
