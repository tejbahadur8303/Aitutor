import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { chat, getConversations, getMessages, deleteConversation } from "../controllers/tutor.controller";

const router = Router();
router.use(authenticate);
router.post("/chat", chat);
router.get("/conversations", getConversations);
router.get("/conversations/:id/messages", getMessages);
router.delete("/conversations/:id", deleteConversation);
export default router;
