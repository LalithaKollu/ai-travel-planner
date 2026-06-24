"use client";

import { useMemo, useState } from "react";
import { apiFetch } from "../lib/api";

const budgetOptions = ["Low", "Medium", "High"];
const interestOptions = ["Food", "Culture", "Adventure", "Shopping", "Relaxation"];

export default function Home() {
  const [form, setForm] = useState({
    destination: "",
    days: 3,
    budgetType: "Medium",
    interests: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState("");

  const handleInput = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const toggleInterest = (interest) => {
    setForm((current) => {
      const active = current.interests.includes(interest);
      return {
        ...current,
        interests: active
          ? current.interests.filter((item) => item !== interest)
          : [...current.interests, interest],
      };
    });
  };

  const submitTrip = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await apiFetch("/api/trips", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setTrip(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const itineraryOutput = useMemo(() => {
    if (!trip) return null;
    return trip.itinerary.map((day) => (
      <div key={day.day} className="rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-xl shadow-slate-900/20">
        <h3 className="text-lg font-semibold text-slate-100">{day.title}</h3>
        <ul className="mt-3 space-y-2 text-slate-300">
          {day.activities.map((activity, index) => (
            <li key={index} className="rounded-xl bg-slate-950 px-3 py-2">{activity}</li>
          ))}
        </ul>
      </div>
    ));
  }, [trip]);

  return (
    <main className="min-h-screen px-6 py-10 sm:px-10">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6 rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-sky-400/80">AI Travel Planner</p>
            <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Create your personalized itinerary</h1>
            <p className="mt-4 max-w-2xl text-slate-400">Enter your destination, travel style, and interests. The agent will build a day-by-day plan, budget estimate, and hotel suggestions for your trip.</p>
          </div>

          <form onSubmit={submitTrip} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-slate-200">
                <span>Destination</span>
                <input
                  value={form.destination}
                  onChange={(e) => handleInput("destination", e.target.value)}
                  className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400"
                  placeholder="Tokyo"
                />
              </label>
              <label className="space-y-2 text-slate-200">
                <span>Number of days</span>
                <input
                  type="number"
                  min="1"
                  value={form.days}
                  onChange={(e) => handleInput("days", Number(e.target.value))}
                  className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-slate-200">
                <span>Budget type</span>
                <select
                  value={form.budgetType}
                  onChange={(e) => handleInput("budgetType", e.target.value)}
                  className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400"
                >
                  {budgetOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>

              <div className="space-y-2 text-slate-200">
                <span>Interests</span>
                <div className="grid gap-2 sm:grid-cols-2">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`rounded-3xl border px-4 py-2 text-sm transition ${form.interests.includes(interest)
                        ? "border-sky-400 bg-sky-500/20 text-sky-200"
                        : "border-slate-700 bg-slate-950 text-slate-300"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded-3xl bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Generating itinerary..." : "Generate itinerary"}
            </button>

            {error && <p className="rounded-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p>}
          </form>
        </section>

        <section className="space-y-6">
          {trip ? (
            <div className="space-y-6 rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40">
              <div className="space-y-3">
                <p className="text-slate-400">Estimated budget</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {Object.entries(trip.budgetEstimate).map(([key, value]) => (
                    <div key={key} className="rounded-3xl bg-slate-950 p-4 text-slate-200">
                      <p className="text-sm uppercase tracking-[0.22em] text-slate-500">{key}</p>
                      <p className="mt-2 text-2xl font-semibold">${value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Hotel suggestions</h2>
                <ul className="grid gap-3">
                  {trip.hotelSuggestions.map((hotel, index) => (
                    <li key={index} className="rounded-3xl border border-slate-700 bg-slate-950 px-4 py-4 text-slate-200">{hotel}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Itinerary</h2>
                <div className="space-y-4">{itineraryOutput}</div>
              </div>
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-slate-700 bg-slate-900/80 p-8 text-slate-400">
              <p className="text-lg font-medium text-slate-100">Your travel score</p>
              <p className="mt-4 text-sm leading-7">Generate a personalized plan to see budget, hotels, and day-by-day suggestions. This UI is ready for the full logged-in experience.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
