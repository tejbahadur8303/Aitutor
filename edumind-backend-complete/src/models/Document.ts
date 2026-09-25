import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true },
  subject: { type: String, default: "" },
  fileName: { type: String, default: "" },
  fileType: { type: String, default: "application/pdf" },
  filePath: { type: String, default: "" },
  status: { type: String, enum: ["UPLOADING", "PROCESSING", "READY", "FAILED"], default: "UPLOADING" },
  extractedText: { type: String, default: "" },
  errorMessage: { type: String, default: "" }
}, { timestamps: true });

const chunkSchema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: "Document", required: true, index: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  text: { type: String, required: true },
  embedding: { type: [Number], default: [] },
  page: { type: Number, default: 1 },
  chunkIndex: { type: Number, default: 0 }
}, { timestamps: true });

export const Document = mongoose.model("Document", documentSchema);
export const DocumentChunk = mongoose.model("DocumentChunk", chunkSchema);
