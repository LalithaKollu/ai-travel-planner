const budgetScale = {
  Low: 0.8,
  Medium: 1,
  High: 1.4,
};

const interestActivities = {
  Food: [
    "try local street food",
    "visit a popular food market",
    "dine at a well-rated local restaurant",
  ],
  Culture: [
    "explore a historic museum",
    "visit a famous cultural landmark",
    "take a guided cultural walking tour",
  ],
  Adventure: [
    "go on an outdoor adventure",
    "take a scenic hike",
    "try a local adventure activity",
  ],
  Shopping: [
    "browse the best local markets",
    "visit a popular shopping district",
    "shop for souvenirs and local crafts",
  ],
  Relaxation: [
    "spend time at a peaceful park or garden",
    "visit a relaxing spa or wellness center",
    "enjoy a quiet afternoon at a scenic spot",
  ],
};

const hotelSuggestionsByBudget = {
  Low: [
    "Budget Stay Inn – Affordable and convenient",
    "Traveler's Lodge – Value-friendly option",
    "City Hostel & Suites – Clean and budget-conscious",
  ],
  Medium: [
    "Comfort Plaza Hotel – Mid-range comfort",
    "Downtown Boutique Hotel – Good balance of price and amenities",
    "City Center Comfort Inn – Popular with travelers",
  ],
  High: [
    "Grand Royale Hotel – Luxury with premium service",
    "Premier City Resort – Top-rated upscale stay",
    "Emerald Palace Hotel – Luxury experience",
  ],
};

const sanitizeInterests = (interests) => {
  if (!Array.isArray(interests)) {
    return [];
  }
  return interests
    .map((interest) => String(interest).trim())
    .filter(Boolean);
};

const chooseActivities = (interests, count) => {
  const selected = [];
  const normalized = sanitizeInterests(interests);

  if (normalized.length === 0) {
    return [
      "Explore the local highlights",
      "Try a signature local dish",
      "Enjoy a memorable evening stroll",
    ].slice(0, count);
  }

  for (const interest of normalized) {
    const options = interestActivities[interest] || [];
    if (options.length > 0) {
      selected.push(options[Math.floor(Math.random() * options.length)]);
    }
  }

  while (selected.length < count) {
    selected.push(
      "Discover a local attraction and enjoy the surroundings"
    );
  }

  return selected.slice(0, count);
};

const createDayPlan = ({ destination, dayIndex, interests }) => {
  const dayNumber = dayIndex + 1;
  const activities = chooseActivities(interests, 3);

  return {
    day: dayNumber,
    title: `Day ${dayNumber} in ${destination}`,
    activities: [
      `Visit a top ${destination} attraction`,
      ...activities,
    ],
  };
};

const estimateBudget = ({ days, budgetType }) => {
  const scale = budgetScale[budgetType] || budgetScale.Medium;
  const flights = Math.round(250 * scale);
  const accommodation = Math.round(90 * days * scale);
  const food = Math.round(40 * days * scale);
  const activities = Math.round(35 * days * scale);
  const total = flights + accommodation + food + activities;

  return {
    flights,
    accommodation,
    food,
    activities,
    total,
  };
};

const generateTrip = ({ destination, days, budgetType, interests }) => {
  const sanitizedInterests = sanitizeInterests(interests);
  const itinerary = Array.from({ length: Number(days) }, (_, index) =>
    createDayPlan({ destination, dayIndex: index, interests: sanitizedInterests })
  );
  const budgetEstimate = estimateBudget({ days: Number(days), budgetType });
  const hotelSuggestions =
    hotelSuggestionsByBudget[budgetType] || hotelSuggestionsByBudget.Medium;

  return {
    itinerary,
    budgetEstimate,
    hotelSuggestions,
  };
};

const regenerateDay = ({ trip, day, prompt }) => {
  const existingDay = trip.itinerary.find((item) => item.day === Number(day));
  if (!existingDay) {
    throw new Error(`Day ${day} not found in this itinerary.`);
  }

  const baseActivities = chooseActivities(trip.interests, 2);
  const regenerated = {
    day: existingDay.day,
    title: `Day ${existingDay.day} in ${trip.destination}`,
    activities: [
      prompt
        ? `Regenerated plan: ${prompt}`
        : `Regenerated experience in ${trip.destination}`,
      ...baseActivities,
    ],
  };

  return regenerated;
};

module.exports = {
  generateTrip,
  regenerateDay,
};
