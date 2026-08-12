const express = require("express");
const cors = require("cors");

const teacherRoutes = require("./routes/teacherRoutes");
const noticeRoutes = require("./routes/noticeRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Banti IHS Backend is running",
  });
});

// Routes
app.use("/api/teachers", teacherRoutes);
app.use("/api/notices", noticeRoutes);

module.exports = app;
