const mongoose = require("mongoose");

const tripDaySchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    activities: [
      {
        type: String,
      },
    ],
  },
  { _id: false }
);

const budgetEstimateSchema = new mongoose.Schema(
  {
    flights: Number,
    accommodation: Number,
    food: Number,
    activities: Number,
    total: Number,
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    destination: {
      type: String,
      required: true,
    },
    days: {
      type: Number,
      required: true,
      min: 1,
    },
    budgetType: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },
    interests: [String],
    itinerary: [tripDaySchema],
    hotelSuggestions: [String],
    budgetEstimate: budgetEstimateSchema,
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Trip", tripSchema);
