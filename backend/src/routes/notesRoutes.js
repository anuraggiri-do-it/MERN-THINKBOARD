import express from "express";
import {
  createNotes,
  deleteNotes,
  getAllNotes,
  getUserNotes,
  getNoteById,
  updateNotes,
} from "../controller/notesController.js";
import { verifyToken } from "../Middleware/AuthMiddleware.js";
import { verifyAdmin } from "../Middleware/roleMidddleware.js";

const router = express.Router();

// Only admin sees all notes
router.get("/all", verifyToken, verifyAdmin, getAllNotes);

// Users only see their own notes
router.get("/my", verifyToken, getUserNotes);

// Shared actions
router.get("/:id", verifyToken, getNoteById);
router.post("/", verifyToken, createNotes);
router.put("/:id", verifyToken, updateNotes);
router.delete("/:id", verifyToken, deleteNotes);

export default router;
