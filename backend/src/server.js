import dotenv from "dotenv";
// Load environment variables - production ready
dotenv.config();
import path from "path";
import express from "express";
import cors from "cors";
import notesRoutes from "./routes/notesRoutes.js";
import AuthRoutes from "./routes/AuthRoute.js";
import adminRoutes from "./routes/adminRoutes.js";
import { connectDB } from "../config/db.js";
const app = express();
//  Middleware
const __dirname = path.resolve();
// Enable CORS for all routes in development
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: ["http://localhost:5173", "http://localhost:3000"], // frontend server
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  );
} else {
  // Production CORS
  app.use(cors());
}
app.use(express.json()); //  this middle ware will  parse the json bodies:req.body

// Request logging middleware for debugging
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    if (req.headers.authorization) {
      console.log('Authorization header present');
    } else {
      console.log('No authorization header');
    }
    next();
  });
}

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/notes", notesRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/admin", adminRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({ 
    message: "Something went wrong!", 
    error: process.env.NODE_ENV === "development" ? err.message : "Internal server error" 
  });
});
// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
  });
}

//  Database Connection
connectDB().then(() => {
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, "0.0.0.0", (err) => {
    if (err) {
      console.error("Failed to start server:", err);
      process.exit(1);
    }
    console.log(`Server running on port ${PORT}`);
  });
});
