const express = require("express");

const {
  getCommittees,
  getCommittee,
  createCommittee,
  updateCommittee,
  deleteCommittee,
} = require("../controllers/committeeController");

const upload = require("../middleware/upload");

const router = express.Router();

router.get("/", getCommittees);
router.get("/:id", getCommittee);

router.post("/", upload.single("photo"), createCommittee);

router.put("/:id", upload.single("photo"), updateCommittee);

router.delete("/:id", deleteCommittee);

module.exports = router;
