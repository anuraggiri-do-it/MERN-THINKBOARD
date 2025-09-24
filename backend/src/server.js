import dotenv from "dotenv";
// Load environment variables - production ready
dotenv.config();

import express from "express";
import cors from "cors";
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "../config/db.js";
const app = express();
//  Middleware
app.use(cors(
  {
    origin: "http://localhost:5173"// frontend server, change it in production
 
  }
));
app.use(express.json()); //  this middle ware will  parse the json bodies:req.body
// Routes
app.use("/api/notes", notesRoutes);

//  Database Connection
connectDB().then(() => {
  console.log("Database connected successfully");
  app.listen(3000, (err) => {
    if (err) {
      console.error("Failed to start server:", err);
      process.exit(1);
    }
    console.log("Server running on port 3000");
  });
});
