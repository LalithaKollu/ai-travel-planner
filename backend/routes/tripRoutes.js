const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  generateTrip,
  getTrips,
  getTrip,
  updateTrip,
  deleteTrip,
  regenerateDay,
} = require("../controllers/tripController");

const router = express.Router();

router.use(protect);

router.post("/", generateTrip);
router.get("/", getTrips);
router.get("/:id", getTrip);
router.put("/:id", updateTrip);
router.delete("/:id", deleteTrip);
router.patch("/:id/regenerate-day", regenerateDay);

module.exports = router;
