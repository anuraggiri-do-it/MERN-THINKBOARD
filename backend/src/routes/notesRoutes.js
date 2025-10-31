import express from "express";
import {
  createNotes,
  deleteNotes,
  getAllNotes,
  getNoteById,
  updateNotes,
} from "../controller/notesController.js";
import { verifyToken } from "../Middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getAllNotes);
router.get("/:id", verifyToken, getNoteById);
router.post("/", verifyToken, createNotes);
router.put("/:id", verifyToken, updateNotes);
router.delete("/:id", verifyToken, deleteNotes);
export default router;
