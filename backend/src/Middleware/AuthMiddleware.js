import jwt from "jsonwebtoken";
import { User } from "../model/AuthModel.js";

export const verifyToken = async (req, res, next) => {
  try {
    // You can store token either in cookies or Authorization header
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user in DB
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user to request (so next route has access)
    req.user = user;
    next(); // ✅ Go to next middleware or controller
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
