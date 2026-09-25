import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { listCourses, enroll, updateEnrollment } from "../controllers/course.controller";

const router = Router();
router.use(authenticate);
router.get("/", listCourses);
router.post("/:id/enroll", enroll);
router.patch("/:id/progress", updateEnrollment);
export default router;
