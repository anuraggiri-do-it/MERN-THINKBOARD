import dotenv from "dotenv";
// Load environment variables - production ready
dotenv.config();
import path from "path";
import express from "express";
import cors from "cors";
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "../config/db.js";
const app = express();
//  Middleware
const __dirname = path.resolve();
// Enable CORS for all routes in development
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173", // frontend server, change it in production
    })
  );
}
app.use(express.json()); //  this middle ware will  parse the json bodies:req.body
// Routes
app.use("/api/notes", notesRoutes);
// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
  });
}

//  Database Connection
connectDB().then(() => {
  console.log("Database connected successfully");
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, "0.0.0.0", (err) => {
    if (err) {
      console.error("Failed to start server:", err);
      process.exit(1);
    }
    console.log(`Server running on port ${PORT}`);
  });
});
