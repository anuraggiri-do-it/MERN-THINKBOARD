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
    // Validate user from token
    if (!req.user || !req.user.id) {
      console.error("User not found in request:", req.user);
      return res.status(401).json({ message: "User authentication failed" });
    }

    console.log(`Fetching notes for user: ${req.user.id}`);
    
    const notes = await Notes.find({ user: req.user.id }).sort({ createdAt: -1 });
    
    console.log(`Found ${notes.length} notes for user ${req.user.id}`);
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching user notes:", error);
    
    if (error.name === 'MongoError' || error.name === 'MongooseError') {
      return res.status(500).json({ 
        message: "Database error", 
        details: error.message 
      });
    }
    
    res.status(500).json({ 
      message: "Internal server error", 
      details: error.message 
    });
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

    // Validate input
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    // Validate user from token
    if (!req.user || !req.user.id) {
      console.error("User not found in request:", req.user);
      return res.status(401).json({ message: "User authentication failed" });
    }

    console.log("Creating note for user:", req.user.id);
    
    const newNote = new Notes({ 
      title, 
      content, 
      user: req.user.id 
    });
    
    const savedNote = await newNote.save();
    console.log("Note created successfully:", savedNote._id);
    
    res.status(201).json(savedNote);
  } catch (error) {
    console.error("Error creating note:", error);
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Validation error", 
        details: error.message 
      });
    }
    
    if (error.name === 'MongoError' || error.name === 'MongooseError') {
      return res.status(500).json({ 
        message: "Database error", 
        details: error.message 
      });
    }
    
    res.status(500).json({ 
      message: "Internal server error", 
      details: error.message 
    });
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
    const noteId = req.params.id;
    
    // Validate user from token
    if (!req.user || !req.user.id) {
      console.error("User not found in request:", req.user);
      return res.status(401).json({ message: "User authentication failed" });
    }

    console.log(`Attempting to delete note ${noteId} for user ${req.user.id}`);
    
    const note = await Notes.findById(noteId);
    if (!note) {
      console.log(`Note ${noteId} not found`);
      return res.status(404).json({ message: "Note not found" });
    }
    
    console.log(`Note found. Owner: ${note.user}, Requesting user: ${req.user.id}, User role: ${req.user.role}`);
    
    // Check ownership
    if (note.user.toString() !== req.user.id && req.user.role !== "admin") {
      console.log(`Access denied. Note owner: ${note.user}, User: ${req.user.id}`);
      return res.status(403).json({ message: "Not allowed to delete this note" });
    }
    
    await Notes.findByIdAndDelete(noteId);
    console.log(`Note ${noteId} deleted successfully`);
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    
    // Handle specific errors
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: "Invalid note ID format", 
        details: error.message 
      });
    }
    
    if (error.name === 'MongoError' || error.name === 'MongooseError') {
      return res.status(500).json({ 
        message: "Database error", 
        details: error.message 
      });
    }
    
    res.status(500).json({ 
      message: "Internal server error", 
      details: error.message 
    });
  }
}
