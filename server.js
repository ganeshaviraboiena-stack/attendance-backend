require("dotenv").config();

const express = require("express");

const cors = require("cors");

const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const attendanceRoutes = require("./src/routes/attendanceRoutes");
const leaveRoutes = require("./src/routes/leaveRoutes");
const superAdminRoutes = require(
  "./src/routes/superAdminRoutes"
);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = require("./src/config/db");
connectDB();
// Home Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Attendance API Running...",
  });
});

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use(
  "/api/v1/superadmin",
  superAdminRoutes
);

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/attendance", attendanceRoutes);

app.use("/api/v1/leave", leaveRoutes);

// Route Not Found
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});