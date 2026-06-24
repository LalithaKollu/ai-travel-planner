"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.message || "Login failed");

      // Save token
      localStorage.setItem("token", body.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-md rounded-xl bg-slate-900 p-6">
        <h1 className="mb-4 text-2xl font-semibold">Login</h1>
        <form onSubmit={submit} className="space-y-4">
          <input required type="email" placeholder="Email" value={form.email} onChange={(e)=>handleChange('email', e.target.value)} className="w-full rounded px-3 py-2"/>
          <input required type="password" placeholder="Password" value={form.password} onChange={(e)=>handleChange('password', e.target.value)} className="w-full rounded px-3 py-2"/>
          <button disabled={loading} className="w-full rounded bg-sky-500 px-4 py-2">{loading ? 'Logging in...' : 'Login'}</button>
          {error && <div className="text-rose-400">{error}</div>}
        </form>
      </div>
    </main>
  );
}
