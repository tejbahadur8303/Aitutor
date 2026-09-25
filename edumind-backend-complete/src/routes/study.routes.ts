import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { listTasks, createTask, updateTask, deleteTask } from "../controllers/study.controller";

const router = Router();
router.use(authenticate);
router.get("/", listTasks);
router.post("/", createTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);
export default router;
