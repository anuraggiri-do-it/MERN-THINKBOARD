import express from "express";
import { signup, login } from "../controller/AuthController.js";
import { verifyToken } from "../Middleware/AuthMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify", verifyToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

export default router;
