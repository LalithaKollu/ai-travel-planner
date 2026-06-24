"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import TripCard from "../../components/TripCard";

export default function DashboardPage() {
  const router = useRouter();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/trips", { method: "GET" });
      setTrips(data);
    } catch (err) {
      setError(err.message);
      if (err.message && err.message.includes("token")) {
        router.push("/auth/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this trip?")) return;
    await apiFetch(`/api/trips/${id}`, { method: "DELETE" });
    setTrips((s) => s.filter((t) => t._id !== id));
  };

  const handleUpdate = async (trip) => {
    const updated = await apiFetch(`/api/trips/${trip._id}`, {
      method: "PUT",
      body: JSON.stringify(trip),
    });
    setTrips((s) => s.map((t) => (t._id === updated._id ? updated : t)));
  };

  const handleRegenerate = async (id, day, prompt) => {
    const updated = await apiFetch(`/api/trips/${id}/regenerate-day`, {
      method: "PATCH",
      body: JSON.stringify({ day, prompt }),
    });
    setTrips((s) => s.map((t) => (t._id === updated._id ? updated : t)));
  };

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Your Trips</h1>
          <div className="space-x-2">
            <button onClick={()=>router.push('/')} className="rounded bg-sky-500 px-3 py-2">Create Trip</button>
            <button onClick={()=>{localStorage.removeItem('token'); router.push('/auth/login')}} className="rounded bg-rose-600 px-3 py-2">Logout</button>
          </div>
        </div>

        {loading && <div>Loading...</div>}
        {error && <div className="text-rose-400">{error}</div>}

        <div className="grid gap-6">
          {trips.length === 0 && !loading && <div className="text-slate-400">No trips yet — create one from the Create Trip button.</div>}
          {trips.map((trip) => (
            <TripCard key={trip._id} trip={trip} onDelete={handleDelete} onUpdate={handleUpdate} onRegenerate={handleRegenerate} />
          ))}
        </div>
      </div>
    </main>
  );
}
