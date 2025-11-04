import dotenv from "dotenv";
dotenv.config();

import path from "path";
import express from "express";
import cors from "cors";

import { connectDB } from "../config/db.js";
import notesRoutes from "./routes/notesRoutes.js";
import AuthRoutes from "./routes/AuthRoute.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();
const __dirname = path.resolve();

// 🌍 CORS setup
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://mern-thinkboard-4g3k.onrender.com"]
        : ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ✅ Health check routes
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// ✅ Core Routes
app.use("/api/notes", notesRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Serve frontend (production)
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "frontend/dist");
  console.log("✅ Frontend path:", frontendPath);
  console.log("✅ __dirname:", __dirname);
  
  app.use(express.static(frontendPath));
  app.get("*", (req, res) => {
    const indexPath = path.join(frontendPath, "index.html");
    console.log("✅ Serving index.html from:", indexPath);
    res.sendFile(indexPath);
  });
}

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// ✅ Database Connection + Server Start
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  });
