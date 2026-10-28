
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import careerRoute from "./api/career.js";
import contactRoute from "./api/contact.js";
import partnersubmitRoute from "./api/partnersubmit.js";
import aboutusRoute from "./api/aboutus.js";
import mailRoute from "./api/mail.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Log whether required email configuration exists (never log secrets)
console.log(
  "EMAIL_USER:",
  process.env.EMAIL_USER ? "Loaded" : "Missing"
);

console.log(
  "EMAIL_PASS:",
  process.env.EMAIL_PASS ? "Loaded" : "Missing"
);

console.log(
  "FRONTEND_URL:",
  process.env.FRONTEND_URL ? "Loaded" : "Missing"
);

// Allowed frontend origins
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
].filter(Boolean);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header, such as health checks
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health-check route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Backend API is running",
    status: "healthy",
  });
});

// API routes
app.use("/api/contact", contactRoute);
app.use("/api/career", careerRoute);
app.use("/api/partnersubmit", partnersubmitRoute);
app.use("/api/aboutus", aboutusRoute);
app.use("/api/mail", mailRoute);

console.log("API routes registered");

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error("API error:", err.message);

  if (res.headersSent) {
    return next(err);
  }

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      error: "Origin not allowed by CORS",
    });
  }

  res.status(500).json({
    error: "Internal server error",
  });
});

// Start server on Render or locally
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
