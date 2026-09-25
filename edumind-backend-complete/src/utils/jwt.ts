import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function signToken(userId: string, role: string) {
  return jwt.sign({ userId, role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn as any });
}
