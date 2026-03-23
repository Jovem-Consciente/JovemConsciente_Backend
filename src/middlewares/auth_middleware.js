import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt.js";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token; 

    if (!token) {
      return res.status(401).json({ message: "Utilizador não autenticado" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded; 
    next();

  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};
