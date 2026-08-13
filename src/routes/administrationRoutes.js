const express = require("express");

const {
  getAdministrations,
  getAdministration,
  createAdministration,
  updateAdministration,
  deleteAdministration,
} = require("../controllers/administrationController");

const upload = require("../middleware/upload");

const router = express.Router();

router.get("/", getAdministrations);

router.get("/:id", getAdministration);

router.post("/", upload.single("file"), createAdministration);

router.put("/:id", upload.single("file"), updateAdministration);

router.delete("/:id", deleteAdministration);

module.exports = router;
