import { Router } from "express";
import multer from "multer";
import { authenticate } from "../middleware/auth";
import { env } from "../config/env";
import { listDocuments, getDocument, uploadDocument, deleteDocument } from "../controllers/document.controller";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.maxFileSize },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf")) cb(null, true);
    else cb(new Error("Only PDF files are supported"));
  }
});

router.use(authenticate);
router.get("/", listDocuments);
router.get("/:id", getDocument);
router.post("/upload", upload.single("file"), uploadDocument);
router.delete("/:id", deleteDocument);
export default router;
