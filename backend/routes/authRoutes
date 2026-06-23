const protect = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();

const { signup, login } = require("../controllers/authcontroller");

router.post("/register", signup);
router.post("/login", login);
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Welcome to protected route",
    user: req.user,
  });
});

module.exports = router;