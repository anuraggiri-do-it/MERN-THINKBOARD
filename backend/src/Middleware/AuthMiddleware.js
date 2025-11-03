import jwt from "jsonwebtoken";
import { User } from "../model/AuthModel.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not found in environment variables");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach decoded token data (includes id and role) to request
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
