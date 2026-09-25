import { DocumentChunk } from "../models/Document";
import { embedding } from "./ai";

function cosine(a: number[], b: number[]) {
  const n = Math.min(a.length, b.length);
  let dot = 0, aa = 0, bb = 0;
  for (let i = 0; i < n; i++) {
    dot += a[i] * b[i];
    aa += a[i] * a[i];
    bb += b[i] * b[i];
  }
  return dot / ((Math.sqrt(aa) * Math.sqrt(bb)) || 1);
}

export async function searchDocuments(ownerId: string, query: string, topK = 5) {
  const q = await embedding(query);
  const chunks = await DocumentChunk.find({ ownerId }).lean();
  return chunks
    .map(c => ({ ...c, score: cosine(q, c.embedding || []) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(c => ({
      text: c.text,
      page: c.page,
      chunkIndex: c.chunkIndex,
      documentId: String(c.documentId),
      score: c.score
    }));
}
