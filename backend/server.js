const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");
const express = require("express");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);

app.get("/", (req, res) => {
  res.send("AI Travel Planner Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});