"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      // Auto-redirect to login
      router.push("/auth/login");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-md rounded-xl bg-slate-900 p-6">
        <h1 className="mb-4 text-2xl font-semibold">Register</h1>
        <form onSubmit={submit} className="space-y-4">
          <input required placeholder="Name" value={form.name} onChange={(e)=>handleChange('name', e.target.value)} className="w-full rounded px-3 py-2"/>
          <input required type="email" placeholder="Email" value={form.email} onChange={(e)=>handleChange('email', e.target.value)} className="w-full rounded px-3 py-2"/>
          <input required type="password" placeholder="Password" value={form.password} onChange={(e)=>handleChange('password', e.target.value)} className="w-full rounded px-3 py-2"/>
          <button disabled={loading} className="w-full rounded bg-sky-500 px-4 py-2">{loading ? 'Registering...' : 'Register'}</button>
          {error && <div className="text-rose-400">{error}</div>}
        </form>
      </div>
    </main>
  );
}
