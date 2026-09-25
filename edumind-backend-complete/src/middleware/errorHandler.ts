import { Request, Response, NextFunction } from "express";

export function notFound(req: Request, res: Response) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.path}` });
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  const status = Number(err.status || err.statusCode || 500);
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
}
