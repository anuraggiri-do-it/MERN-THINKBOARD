import Notes from "../model/Notes.js";

// Admin only - get all notes
export async function getAllNotes(req, res) {
  try {
    const notes = await Notes.find().populate('user', 'username email').sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// User - get only their own notes
export async function getUserNotes(req, res) {
  try {
    const notes = await Notes.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching user notes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function getNoteById(req, res) {
  try {
    const note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    
    // Check ownership (user can only access their own notes, admin can access all)
    if (note.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    
    res.status(200).json(note);
  } catch (error) {
    console.error("Error fetching note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createNotes(req, res) {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const newNote = new Notes({ 
      title, 
      content, 
      user: req.user.id 
    });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateNotes(req, res) {
  try {
    const { title, content } = req.body;
    
    const note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    
    // Check ownership
    if (note.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed to update this note" });
    }
    
    const updatedNote = await Notes.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );
    
    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteNotes(req, res) {
  try {
    const note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    
    // Check ownership
    if (note.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed to delete this note" });
    }
    
    await Notes.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
