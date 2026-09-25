import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { Conversation, Message } from "../models/Conversation";
import { searchDocuments } from "../services/rag";
import { generateText } from "../services/ai";
import { ProgressEvent } from "../models/ProgressEvent";

const SYSTEM = `You are EduMind AI, an expert educational tutor.
Explain at the student's level, use examples, structure answers clearly, and do not invent information from provided study material.
When context is provided, prefer it and mention that the answer is based on the student's materials when appropriate.`;

export async function chat(req: AuthRequest, res: Response) {
  const { message, conversationId, subject } = req.body;
  if (!message?.trim()) return res.status(400).json({ success: false, message: "Message is required" });

  let conversation = conversationId
    ? await Conversation.findOne({ _id: conversationId, userId: req.user!.userId })
    : null;

  if (!conversation) {
    conversation = await Conversation.create({
      userId: req.user!.userId,
      title: String(message).slice(0, 45),
      subject: subject || ""
    });
  }

  await Message.create({ conversationId: conversation._id, role: "user", content: message });

  const docs = await searchDocuments(req.user!.userId, message, 5);
  const context = docs.length
    ? docs.map((d, i) => `[Source ${i + 1}, page ${d.page}]\n${d.text}`).join("\n\n")
    : "No matching study material was found.";

  const answer = await generateText(
    `Relevant study context:\n${context}\n\nStudent question:\n${message}\n\nGive a useful educational answer. If the context is insufficient, clearly say so rather than pretending the context contains the answer.`,
    SYSTEM
  );

  const sources = docs.map(d => ({ documentId: d.documentId, title: "Study material", page: d.page }));
  await Message.create({ conversationId: conversation._id, role: "assistant", content: answer, sources });
  await Conversation.findByIdAndUpdate(conversation._id, { $set: { updatedAt: new Date() } });
  await ProgressEvent.create({ userId: req.user!.userId, type: "CHAT", value: 1 });

  res.json({ success: true, data: { conversationId: String(conversation._id), answer, sources } });
}

export async function getConversations(req: AuthRequest, res: Response) {
  const data = await Conversation.find({ userId: req.user!.userId }).sort({ updatedAt: -1 });
  res.json({ success: true, data });
}

export async function getMessages(req: AuthRequest, res: Response) {
  const conversation = await Conversation.findOne({ _id: req.params.id, userId: req.user!.userId });
  if (!conversation) return res.status(404).json({ success: false, message: "Conversation not found" });
  const data = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 });
  res.json({ success: true, data });
}

export async function deleteConversation(req: AuthRequest, res: Response) {
  const c = await Conversation.findOneAndDelete({ _id: req.params.id, userId: req.user!.userId });
  if (!c) return res.status(404).json({ success: false, message: "Conversation not found" });
  await Message.deleteMany({ conversationId: req.params.id });
  res.json({ success: true, message: "Conversation deleted" });
}
