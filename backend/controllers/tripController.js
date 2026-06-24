const Trip = require("../models/trip");
const aiService = require("../utils/aiService");

const generateTrip = async (req, res) => {
  try {
    const { destination, days, budgetType, interests } = req.body;

    if (!destination || !days || !budgetType) {
      return res.status(400).json({
        message: "Destination, days, and budgetType are required.",
      });
    }

    const generated = aiService.generateTrip({
      destination,
      days,
      budgetType,
      interests,
    });

    const trip = await Trip.create({
      user: req.user.id,
      destination,
      days,
      budgetType,
      interests: Array.isArray(interests) ? interests : [],
      itinerary: generated.itinerary,
      budgetEstimate: generated.budgetEstimate,
      hotelSuggestions: generated.hotelSuggestions,
      notes: req.body.notes || "",
    });

    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip || trip.user.toString() !== req.user.id) {
      return res.status(404).json({
        message: "Trip not found or access denied.",
      });
    }

    res.json(trip);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip || trip.user.toString() !== req.user.id) {
      return res.status(404).json({
        message: "Trip not found or access denied.",
      });
    }

    const allowedUpdates = [
      "destination",
      "days",
      "budgetType",
      "interests",
      "itinerary",
      "hotelSuggestions",
      "budgetEstimate",
      "notes",
    ];

    for (const key of allowedUpdates) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        trip[key] = req.body[key];
      }
    }

    await trip.save();
    res.json(trip);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip || trip.user.toString() !== req.user.id) {
      return res.status(404).json({
        message: "Trip not found or access denied.",
      });
    }

    await trip.deleteOne();
    res.json({ message: "Trip deleted successfully." });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const regenerateDay = async (req, res) => {
  try {
    const { day, prompt } = req.body;
    const trip = await Trip.findById(req.params.id);

    if (!trip || trip.user.toString() !== req.user.id) {
      return res.status(404).json({
        message: "Trip not found or access denied.",
      });
    }

    if (!day) {
      return res.status(400).json({
        message: "Day number is required to regenerate.",
      });
    }

    const regeneratedDay = aiService.regenerateDay({ trip, day, prompt });
    trip.itinerary = trip.itinerary.map((item) =>
      item.day === Number(day) ? regeneratedDay : item
    );

    await trip.save();
    res.json(trip);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  generateTrip,
  getTrips,
  getTrip,
  updateTrip,
  deleteTrip,
  regenerateDay,
};
