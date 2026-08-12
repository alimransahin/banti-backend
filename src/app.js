const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const teacherRoutes = require("./routes/teacherRoutes");
const noticeRoutes = require("./routes/noticeRoutes");

const app = express();

// ================= DATABASE =================

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// ================= MIDDLEWARE =================

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://bantiihs.mdalimransahin.workers.dev",
    ],
  }),
);

app.use(express.json());

// ================= TEST =================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Banti IHS Backend is running",
  });
});

// ================= ROUTES =================

app.use("/api/teachers", teacherRoutes);
app.use("/api/notices", noticeRoutes);

module.exports = app;
