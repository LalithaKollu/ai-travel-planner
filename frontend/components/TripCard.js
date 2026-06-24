"use client";

import { useState } from "react";

export default function TripCard({ trip, onDelete, onUpdate, onRegenerate }) {
  const [adding, setAdding] = useState({});

  const addActivity = async (dayIndex, text) => {
    const newIt = [...trip.itinerary];
    newIt[dayIndex].activities = [...newIt[dayIndex].activities, text];
    await onUpdate({ ...trip, itinerary: newIt });
    setAdding((s) => ({ ...s, [dayIndex]: "" }));
  };

  const removeActivity = async (dayIndex, idx) => {
    const newIt = [...trip.itinerary];
    newIt[dayIndex].activities = newIt[dayIndex].activities.filter((_, i) => i !== idx);
    await onUpdate({ ...trip, itinerary: newIt });
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-700 bg-slate-900 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{trip.destination} — {trip.days} days</h3>
          <p className="text-sm text-slate-400">Created: {new Date(trip.createdAt).toLocaleString()}</p>
        </div>
        <div className="space-x-2">
          <button onClick={() => onDelete(trip._id)} className="rounded bg-rose-600 px-3 py-1 text-sm">Delete</button>
        </div>
      </div>

      <div className="grid gap-3">
        {trip.itinerary.map((day, idx) => (
          <div key={day.day} className="rounded-lg border border-slate-800 p-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{day.title}</h4>
              <div className="flex items-center gap-2">
                <button onClick={() => {
                  const prompt = prompt("Optional prompt for regeneration (leave blank for general)");
                  onRegenerate(trip._id, day.day, prompt);
                }} className="rounded bg-sky-500 px-2 py-1 text-sm">Regenerate</button>
              </div>
            </div>

            <ul className="mt-3 space-y-2">
              {day.activities.map((a, i) => (
                <li key={i} className="flex items-center justify-between rounded bg-slate-950 px-3 py-2">
                  <span>{a}</span>
                  <button onClick={() => removeActivity(idx, i)} className="text-rose-400">Remove</button>
                </li>
              ))}
            </ul>

            <div className="mt-2 flex gap-2">
              <input value={adding[idx] || ""} onChange={(e)=>setAdding(s=>({...s,[idx]:e.target.value}))} placeholder="Add activity" className="flex-1 rounded px-3 py-2"/>
              <button onClick={()=>addActivity(idx, adding[idx]||"")} className="rounded bg-green-600 px-3 py-2 text-sm">Add</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
