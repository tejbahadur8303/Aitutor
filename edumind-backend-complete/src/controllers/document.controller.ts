import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";
import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { Document, DocumentChunk } from "../models/Document";
import { embedding } from "../services/ai";
import { env } from "../config/env";
import { ProgressEvent } from "../models/ProgressEvent";

function chunkText(text: string, size = 900, overlap = 120) {
  const clean = text.replace(/\s+/g, " ").trim();
  const chunks: string[] = [];
  let start = 0;
  while (start < clean.length) {
    const end = Math.min(clean.length, start + size);
    chunks.push(clean.slice(start, end));
    if (end >= clean.length) break;
    start = Math.max(0, end - overlap);
  }
  return chunks;
}

export async function listDocuments(req: AuthRequest, res: Response) {
  const data = await Document.find({ ownerId: req.user!.userId })
    .select("-extractedText -filePath")
    .sort({ createdAt: -1 });
  res.json({ success: true, data });
}

export async function getDocument(req: AuthRequest, res: Response) {
  const data = await Document.findOne({ _id: req.params.id, ownerId: req.user!.userId })
    .select("-extractedText -filePath");
  if (!data) return res.status(404).json({ success: false, message: "Document not found" });
  res.json({ success: true, data });
}

export async function uploadDocument(req: AuthRequest, res: Response) {
  const file = req.file;
  if (!file) return res.status(400).json({ success: false, message: "PDF file is required" });

  const title = req.body.title || path.parse(file.originalname).name;
  const subject = req.body.subject || "";

  const doc = await Document.create({
    ownerId: req.user!.userId,
    title, subject,
    fileName: file.originalname,
    fileType: file.mimetype,
    status: "PROCESSING"
  });

  try {
    fs.mkdirSync(env.uploadDir, { recursive: true });
    const filePath = path.join(env.uploadDir, `${doc._id}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_")}`);
    fs.writeFileSync(filePath, file.buffer);

    const parsed = await pdfParse(file.buffer);
    const chunks = chunkText(parsed.text);

    await DocumentChunk.deleteMany({ documentId: doc._id });
    for (let i = 0; i < chunks.length; i++) {
      const vector = await embedding(chunks[i]);
      await DocumentChunk.create({
        documentId: doc._id,
        ownerId: req.user!.userId,
        text: chunks[i],
        embedding: vector,
        page: 1,
        chunkIndex: i
      });
    }

    doc.filePath = filePath;
    doc.extractedText = parsed.text.slice(0, 500000);
    doc.status = "READY";
    await doc.save();

    await ProgressEvent.create({ userId: req.user!.userId, type: "DOCUMENT", value: 1 });
    res.status(201).json({
      success: true,
      data: {
        ...doc.toObject(),
        extractedText: undefined,
        filePath: undefined,
        chunks: chunks.length
      }
    });
  } catch (error: any) {
    doc.status = "FAILED";
    doc.errorMessage = error.message || "Document processing failed";
    await doc.save();
    res.status(500).json({ success: false, message: "Document processing failed", error: doc.errorMessage });
  }
}

export async function deleteDocument(req: AuthRequest, res: Response) {
  const doc = await Document.findOneAndDelete({ _id: req.params.id, ownerId: req.user!.userId });
  if (!doc) return res.status(404).json({ success: false, message: "Document not found" });
  await DocumentChunk.deleteMany({ documentId: doc._id });
  if (doc.filePath && fs.existsSync(doc.filePath)) fs.unlinkSync(doc.filePath);
  res.json({ success: true, message: "Document deleted" });
}
