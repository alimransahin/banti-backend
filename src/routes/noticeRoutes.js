const express = require("express");

const {
  getNotices,
  getNotice,
  createNotice,
  updateNotice,
  deleteNotice,
} = require("../controllers/noticeController");

const upload = require("../middleware/upload");

const router = express.Router();

router.get("/", getNotices);

router.get("/:id", getNotice);

router.post("/", upload.array("attachment", 10), createNotice);

router.put("/:id", upload.array("attachment", 10), updateNotice);

router.delete("/:id", deleteNotice);

module.exports = router;
