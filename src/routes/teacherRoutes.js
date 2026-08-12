const express = require("express");

const {
  getTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} = require("../controllers/teacherController");

const upload = require("../middleware/upload");

const router = express.Router();

router.get("/", getTeachers);
router.get("/:id", getTeacher);

router.post("/", upload.single("photo"), createTeacher);

router.put("/:id", upload.single("photo"), updateTeacher);

router.delete("/:id", deleteTeacher);

module.exports = router;
