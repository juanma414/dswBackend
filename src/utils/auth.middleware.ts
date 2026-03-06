import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "./jwt.utils.js";

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token no proporcionado o formato inválido" });
  }

  const token = authHeader.substring(7); // Remover "Bearer "

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }

  req.user = decoded;
  next();
}

export function adminMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: "No autenticado" });
  }

  if (req.user.userRol !== "administrator") {
    return res.status(403).json({ message: "Acceso denegado - se requiere rol de administrador" });
  }

  next();
}
