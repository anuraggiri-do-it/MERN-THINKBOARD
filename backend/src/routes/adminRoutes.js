import express from "express";
import { promoteToAdmin, getAllUsers } from "../controller/AdminController.js";
import { verifyToken } from "../Middleware/AuthMiddleware.js";
import { verifyAdmin } from "../Middleware/roleMidddleware.js";

const router = express.Router();

// Admin routes
router.get("/users", verifyToken, verifyAdmin, getAllUsers);
router.put("/promote/:userId", verifyToken, verifyAdmin, promoteToAdmin);

export default router;